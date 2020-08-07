/* Global Variables */
const geoURL= 'http://api.geonames.org/postalCodeSearchJSON?placename='
const geoKey= '&maxRows=1&username=jhersheyy'

//weatherURL's in function only (using template literals-were causing referenceErrors)
const weatherKey= '430488ce7d904004b4252036356fc59d';

//Initial function to load page and then make event listener
function initPage(e){
  // Event listener to add function to existing HTML DOM element
  document.getElementById('generate').addEventListener('click', performAction);
}

/* Function called by event listener */
function performAction(e){
    /*retrieve and store user input from UI*/
    let location =  document.getElementById('location').value; 
    let depDate = document.getElementById('dday').value;//format: 2020-08-20
    
    /*get and save how many days til trip date*/
    let countdown = getCountdown(depDate);

    /*convert input location to lat,long with geonames api*/
    getLatLong(geoURL,location,geoKey)
    //getLatLong returns object with location info keys and info vals from api

    /*send info from api to server to save as project data*/
    .then(function(geoData){
        let projData = {loc: location, lat: geoData.lat, long: geoData.lng, region: geoData.adminName1, country: geoData.countryCode}
        postData('/add', projData)
        return projData;
    })
    /*use projData to query weatherbit api*/
    .then(function(pData){
      let lat = pData.lat;
      let long =pData.long;
      let temp= getWeather(lat, long, depDate, weatherKey);
      console.log(temp);
    })
    
    //.then(()=>
    //    updateUI()
    //)
}

const updateUI = async () => {
  const request = await fetch('/all');
  //retrieve data from our app
  try{
    const allData = await request.json();
    
    //select the necessary elements on the DOM (index.html), 
    //update their necessary values to reflect the dynamic values for temp, date, user input
    document.getElementById('date').innerHTML = "DATE: " + allData.date;
    document.getElementById('temp').innerHTML = "TEMP: " + allData.temp;
    document.getElementById('content').innerHTML = "NOTE: "+ allData.content;

}catch(error){
    console.log("error", error);
  }
}

const getLatLong = async(url, location, key)=>{
  const res = await fetch(url+location+key)
  try{
    const data = await res.json();
    return data.postalCodes[0];
  } catch(error){
    console.log("error in getLatLong():: ",error)
  }
}
/* Function to GET Web API Data*/
const getWeather = async (lat, long, date, key)=>{
  const currWeatherURL=`https://api.weatherbit.io/v2.0/forecast/daily?&lat=${lat}&lon=${long}&units=I&days=1&key=${key}`;
  //const histWeatherURL=`https://api.weatherbit.io/v2.0/history/daily&lat=${lat}&lon=${long}&start_date=${date}&end_date=${endDate}&units=I&key=${key}`;
  const res = await fetch(currWeatherURL)
  try {
    const data = await res.json();
    console.log(data)
    console.log("temp: ", data.data[0].temp);
    return data;
  }  catch(error) {
    console.log("error", error);
    // appropriately handle the error
  }
}

/* Function to POST data */
const postData = async ( url = '/add', data = {})=>{

    const response = await fetch(url, {
    method: 'POST', 
    credentials: 'same-origin', 
    headers: {
        'Content-Type': 'application/json',
    },
    body: JSON.stringify(data), // body data type must match "Content-Type" header        
  })
    try {
      const newData = await response.json();
      return newData;
    }catch(error) {
    console.log("error", error);
    }
};


function getCountdown(ddate){
  // Create a new date instance dynamically with JS
  let d = new Date();
  //convert input date to Date obj
  let dd = new Date(ddate);
  const day_in_ms = 1000 * 60 * 60 * 24 ;
  //get dates in ms
  let d_full = Date.UTC(d.getFullYear(), d.getMonth(), d.getDate());
  let dd_full= Date.UTC(dd.getFullYear(), dd.getMonth(), dd.getDate()); 
  //conert back to days
  let result= Math.floor(dd_full-d_full)/day_in_ms;
  return result;
}

export { initPage }