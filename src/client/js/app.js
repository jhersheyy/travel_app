import {getLatLong} from './helpers'
import {getWeather} from './helpers'
import {getCountdown} from './helpers'

/* Global Variables */
const geoURL= 'http://api.geonames.org/postalCodeSearchJSON?placename='
const geoKey= '&maxRows=1&username=jhersheyy'

//weatherURL's in function only (using template literals-were causing referenceErrors)
const weatherKey= '430488ce7d904004b4252036356fc59d';

/*Initial function to load page and then make event listener*/
function initPage(e){
  // Event listener to add function to existing HTML DOM element
  document.getElementById('generate').addEventListener('click', performAction);
}

/* Function called by event listener */
function performAction(e){
    //retrieve and store user input from UI
    let location =  document.getElementById('location').value; 
    let depDate = document.getElementById('dday').value;//format: 2020-08-20
    
    //get and save how many days til trip date
    let countdown = getCountdown(depDate);
    postData('/add', {title: "countdown", data:{daysLeft: countdown}});

    //convert input location to lat,long with geonames api
    getLatLong(geoURL,location,geoKey)
    ////gLL() returns object with loc info keys and vals from api

    //send info from api to server to save as project data
    .then(function(geoData){
        let projData = {title: "geoInfo", data: {loc: location, lat: geoData.lat, long: geoData.lng, region: geoData.adminName1, country: geoData.countryCode}};
        postData('/add', projData)
        return projData.data;
    })
    /*use projData to query weatherbit api*/
    .then(function(pData){//data object only
      let lat = pData.lat;
      let long =pData.long; //need to make this wait!!!!
      let weatherInfo= getWeather(lat, long, depDate, weatherKey);//object of important info from api query
      return weatherInfo})
    .then(function(wInfo){
      let weatherData = {title: "weatherInfo", data: wInfo};//format for projData
      postData('/add',weatherData);
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