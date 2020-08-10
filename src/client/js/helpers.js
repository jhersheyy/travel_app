import {getCountry} from './countries'

/*Find difference between today and given date "ddate" */
function getCountdown(ddate){
    // Create a new date instance dynamically with JS
    let d = new Date();
    //convert input date to Date obj
    let dd = new Date(ddate);
    const day_in_ms = 1000 * 60 * 60 * 24 ;
    //get dates in ms
    let d_full = Date.UTC(d.getFullYear(), (d.getMonth()), d.getDate());
    let dd_full= Date.UTC(dd.getFullYear(), (dd.getMonth()), dd.getDate()); 
    //conert back to days
    let result= Math.floor(dd_full-d_full)/day_in_ms;
    return result;
  }

/*gets date after given date*/
function tomorrow(date){
  let d = new Date(date);
  let copy = new Date(date);
  //console.log("input: ",d, " and ", copy);
  copy.setDate(d.getDate()+1);
  //console.log("TOMORROW: from ", d, " to ", copy);
  return copy.toISOString().slice(0,10);//formats into yyyy-mm-dd
}

/*converts date to last year of history*/
function lastYear(d){
  let date = new Date(d);
  let copy = new Date(d);//date;
  copy.setFullYear(date.getFullYear()-1);
  //console.log("ORIGINAL DATE: ", date.toISOString().slice(0,10))
  //console.log("ALTERED DATE: ", copy.toISOString().slice(0,10))
  return copy.toISOString().slice(0,10); //formats into yyyy-mm-dd
}

/*Get Geonames API Location info*/
const getLatLong = async(url, location, key)=>{
  const res = await fetch(url+location+key)
  try{
    const data = await res.json();
    console.log(data);
    return data.postalCodes[0];
  } catch(error){
    console.log("error in getLatLong():: ",error)
  }
}
/*Take in object from weatherbit query, return object of helpful info*/
function getInfo(dataObj){
  let result ={};

  result.max = dataObj.max_temp;
  result.min = dataObj.min_temp;
  result.temp = dataObj.temp;
  result.snow = dataObj.snow;
  result.clouds = dataObj.clouds;
  result.humidity= dataObj.rh;
  //console.log("GET INFO RESULT: ", result);
  return result;
}
/*Get Weatherbit API Weather Data*/
const getWeather = async (lat, long, date, key)=>{
    let weatherURL='';
    //const histWeatherURL=
    if (getCountdown(date) > 16){
      //console.log("Finding historic weather for (unchanged): ",date)
      date = lastYear(date);
      let endDate = tomorrow(date);
      weatherURL=`https://api.weatherbit.io/v2.0/history/daily?lat=${lat}&lon=${long}&start_date=${date}&end_date=${endDate}&units=I&key=${key}`;
    }
    else{
      //console.log("Finding current weather for: ", date);
      weatherURL=`https://api.weatherbit.io/v2.0/forecast/daily?&lat=${lat}&lon=${long}&units=I&key=${key}`;
    }
    const res = await fetch(weatherURL)
    try {
      const data = await res.json();
      //console.log(data)
      if (weatherURL.includes('history')){
        //console.log("USED HISTORY!");
        //used historic api, only one item in data array
        console.log("temp in getweather: ", data.data[0].temp);
        return getInfo(data.data[0]);
      } else{
        //used 16-day forecast api, 16 items in array; use countdown+1
        let i= getCountdown(date)+1;
        //console.log(i);
        //console.log("temp in getweather: ",data.data[i].temp);
        return getInfo(data.data[i]);
      }
    }  catch(error) {
      console.log("error in getWeather():: ", error);
      // appropriately handle the error
    }
  }

function getImgURL(pixdata){
  let newImg = pixdata.hits[0];
  let newImgURL = newImg.webformatURL;
  return newImgURL;
}

const getPic= async(data,key)=>{//gData (geoinfo from proj data-sever)
  let query = encodeURI(data.city);
  let picURL= `https://pixabay.com/api/?key=${key}&q=${query}&safesearch=true&category=places`;
  console.log("GETPIC URL: ", picURL);
  const res = await fetch(picURL);
  try {
    const rdata = await res.json();
    //console.log("GETPIC RESULT: ",data);
    if(rdata.totalHits == 0){//city got no results->region
      //console.log("DATA: ", data)
      //change query to use region instead of city
      query = encodeURI(data.region);
      picURL= `https://pixabay.com/api/?key=${key}&q=${query}&safesearch=true&category=places`;
      console.log("REGION URL: ", picURL)
      const redo = await fetch(picURL);
      const newData= await redo.json();
      if (newData.totalHits==0){//region got no results->country
        //if no region results, use country
        query = encodeURI(getCountry(data.country));//country saved as 2 letter code from geonames
        picURL= `https://pixabay.com/api/?key=${key}&q=${query}&safesearch=true&category=places`;
        console.log("COUNTRY URL: ",picURL)
        const redo2 = await fetch(picURL);
        const newData2= await redo2.json();
        // if (newData2.totalHits==0){//still no hits
        //   return './media/img_na.png'
        // } else{
          return getImgURL(newData2);
        // }
      } else{
        return getImgURL(newData);
      }
    } else{
      return getImgURL(rdata);
    }
  } catch(error) {
    console.log("error in getPic():: ", error);
    // appropriately handle the error
  }}

export{ getLatLong, 
        getWeather,
        getCountdown,
        getPic
      }
  