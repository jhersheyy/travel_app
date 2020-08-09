import {getLatLong} from './helpers'
import {getWeather} from './helpers'
import {getCountdown} from './helpers'
import {getPic} from './helpers'

/* Global Variables */
const geoURL= 'http://api.geonames.org/postalCodeSearchJSON?placename='
const geoKey= '&maxRows=1&countryBias=US&username=jhersheyy' //note the US bias

//weatherURL's in function only (using template literals-were causing referenceErrors)
const weatherKey= '430488ce7d904004b4252036356fc59d';
//pixURL in function, also using template literals
const pixKey= '17824144-5c1b0272b392f2756cef29e29';

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
      let projData = {title: "geoInfo", data: {city: geoData.city_name, lat: geoData.lat, long: geoData.lng, region: geoData.adminName1, country: geoData.countryCode}};
      postData('/add', projData)
      //return projData.data;
  })
  /*use projData from serverside to query weatherbit api*/
  .then(function(){
    let allData = getProjData();
    return allData})
  .then(function(pData){
    pData = pData['geoInfo'];
    let lat = pData.lat;
    let long =pData.long; 
    let weatherInfo= getWeather(lat, long, depDate, weatherKey);//object of important info from api query
    return weatherInfo})
  //send weatherData back to projectData on server side
  .then(function(wInfo){
    let weatherData = {title: "weatherInfo", data: wInfo};//format for projData
    postData('/add',weatherData);
  })
  //updates ui with data and relevant img from pixabay
  .then(()=>
    updateUI()
  )
}

const getProjData = async () =>{
  const request = await fetch('/all')
  try{
    const allData = await request.json();
    //console.log("ALLDATA: ",allData);
    return allData;
  } catch(error){
    console.log("error in getProjData():: ", error);
  }
}

/*Gets image from pixabay and updates UI with project data and image*/
const updateUI = async () => {
  //retrieve data from our app
  const allData = await getProjData()
  
  .then(allData => {
    let gData = allData['geoInfo'];
    console.log("UPDATE UI GDATA: ", gData);
    //let wData = allData['weatherInfo'];
    //console.log("UPDATE UI WDATA: ", wData);
    let place = gData.loc;
  //}
    let picResult= getPic(place, pixKey);//takes input, key
    return picResult})
  .then(picResult=>{
    console.log("UUI picresult: ", picResult);
    let img = picResult.hits[0];
    console.log("UUI img data: ",img);
    let imgURL = img.webformatURL;
    console.log("UUI: imgURL: ", imgURL);
  //select the necessary elements on the DOM (index.html), 
  //update their necessary values to reflect the dynamic values for temp, date, user input
    document.getElementById('date').innerHTML = "DATE: " ;//+ allData.date;
    document.getElementById('temp').innerHTML = "TEMP: " ;//+ allData.temp;
    document.getElementById('content').innerHTML = "NOTE: ";//+ allData.content;
  })
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