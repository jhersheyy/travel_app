import {getLatLong} from './helpers'
import {getWeather} from './helpers'
import {getCountdown} from './helpers'
import {getPic} from './helpers'
import backupimg from '../media/img_na.png'
 
/* Global Variables */
let allData= {};//client side copy of projectData, updates as process request
const geoURL= 'http://api.geonames.org/postalCodeSearchJSON?placename='
const geoKey= '&maxRows=1&countryBias=US&username=jhersheyy' //note the US bias
//weatherURL's in function only (using template literals-were causing referenceErrors)
const weatherKey= '430488ce7d904004b4252036356fc59d';
//pixURL in function, also using template literals
const pixKey= '17824144-5c1b0272b392f2756cef29e29';

/*Initial function= load pg-> then make event listener*/
function initPage(e){
  document.getElementById('generate').addEventListener('click', performAction);
}

/* Function called by event listener: main function*/
function performAction(e){
  //retrieve and store user input from UI
  let location =  document.getElementById('location').value; 
  let depDate = document.getElementById('dday').value;//format: 2020-08-20
  console.log(location, depDate);
  if (location==''||depDate==''){//check inputs filled out
    alert("Please enter valid info.");
  } else{
    //get and save how many days til trip date
    let countdown = getCountdown(depDate);
    postData('/add', {title: "countdown", data:{daysLeft: countdown}});

    //convert input location to lat,long with geonames api
    getLatLong(geoURL,location,geoKey)//returns object with loc info keys/ vals from api
    .then(function(geoData){//send g_info from api to server to save as project data
      try{
        let projData = {title: "geoInfo", data: {city: geoData.placeName, lat: geoData.lat, long: geoData.lng, region: geoData.adminName1, country: geoData.countryCode}};
        postData('/add', projData)
      } catch(error){
        console.log("error in getLatLong():: ",error)
      }
    })
    .then(function(){//get serverside data
      allData = getProjData();
      return allData
    })
    .then(function(pData){//use server data to query weather api
      pData = pData['geoInfo'];//need geonames result only
      let lat = pData.lat;
      let long =pData.long; 
      let weatherInfo= getWeather(lat, long, depDate, weatherKey);//return object of info from api query
      return weatherInfo
    })  
    .then(function(wInfo){//send weatherData back to projectData on server side
      let weatherData = {title: "weatherInfo", data: wInfo};//format for projData
      postData('/add',weatherData);
    })
    .then(()=>//updates ui with data and relevant img from pixabay
      updateUI(depDate)
    )
  }
}

const getProjData = async () =>{
  const request = await fetch('/all')
  try{
    allData = await request.json();
    //console.log("ALLDATA: ",allData);
    return allData;
  } catch(error){
    console.log("error in getProjData():: ", error);
  }
}

/*Gets image from pixabay and updates UI with project data and image*/
const updateUI = async (date) => {
  //retrieve final data from our app
  allData = await getProjData()
  .then(allData => {
    let gData = allData['geoInfo']; //get data to input to getPic()
    console.log("UPDATE UI GDATA: ", gData);
    let picResult= getPic(gData, pixKey);//takes input, key
    return picResult})
  .then(picResult=>{
    allData["imgURL"] = picResult;
    return allData})//returns url for image
  .then(data=>{
    console.log("UPDATE UI TOTAL DATA: ",data);
    let wData = data['weatherInfo'];
    let imgURL = data['imgURL'];
    console.log(imgURL);
    if (imgURL === undefined){
      document.querySelector('.image').setAttribute('src', backupimg);
    } else{
      document.querySelector('.image').setAttribute('src', imgURL);
    }
  //select the necessary elements on the DOM (index.html), 
  //update their necessary values to reflect the dynamic values for temp, date, user input
    document.getElementById('date').innerHTML = "DATE: " + date;
    document.getElementById('temp').innerHTML = "TEMP: " + wData.temp;
    let clouds = wData.clouds; let hum=wData.humidity; let max=wData.max; let min=wData.min;
    document.getElementById('content').innerHTML = `NOTES:: clouds: ${clouds} ; humidity: ${hum} ; max temp: ${max} ; min temp: ${min}`;//"NOTE: "+ wData.content;
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