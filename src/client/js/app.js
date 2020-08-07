/* Global Variables */
const geoURL= 'http://api.geonames.org/postalCodeSearchJSON?placename='
const geoKey= '&maxRows=1&username=jhersheyy'
// Create a new date instance dynamically with JS
//let d = new Date();
//let newDate = (d.getMonth()+1)+'.'+ d.getDate()+'.'+ d.getFullYear();

//Initial function to load page and then make event listener
function initPage(e){
  // Event listener to add function to existing HTML DOM element
  document.getElementById('generate').addEventListener('click', performAction);
}

/* Function called by event listener */
function performAction(e){
    let location =  document.getElementById('location').value; 
    //let uContent = document.getElementById('feelings').value;

    /*convert input location to lat,long with geonames api*/
    getLatLong(geoURL,location,geoKey)
    //getLatLong returns object with location info keys and info vals from api

    /*send info from api to server to save as project data*/
    .then(function(geoData){
        let projData = {loc: location, lat: geoData.lat, long: geoData.lng, region: geoData.adminName1, country: geoData.countryCode}
        postData('/add', projData)
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
  console.log("URL SET TO: ",url+location+key);
  const res = await fetch(url+location+key)
  try{
    const data = await res.json();
    console.log("in getlatlong: ", data)
    return data.postalCodes[0];
  } catch(error){
    console.log("error in getLatLong():: ",error)
  }
}
/* Function to GET Web API Data
const getWeather = async (baseURL, zip, key)=>{
    const res = await fetch(baseURL+zip+key)
    try {
      const data = await res.json();
      return data;
    }  catch(error) {
      console.log("error", error);
      // appropriately handle the error
    }
  }*.

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

export { initPage }