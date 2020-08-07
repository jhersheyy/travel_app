/*Find difference between today and given date "ddate" */
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

/*Get Geonames API Location info*/
const getLatLong = async(url, location, key)=>{
  const res = await fetch(url+location+key)
  try{
    const data = await res.json();
    return data.postalCodes[0];
  } catch(error){
    console.log("error in getLatLong():: ",error)
  }
}

/*Get Weatherbit API Weather Data*/
const getWeather = async (lat, long, date, key)=>{
    const currWeatherURL=`https://api.weatherbit.io/v2.0/forecast/daily?&lat=${lat}&lon=${long}&units=I&key=${key}`;
    //const histWeatherURL=`https://api.weatherbit.io/v2.0/history/daily&lat=${lat}&lon=${long}&start_date=${date}&end_date=${endDate}&units=I&key=${key}`;
    const res = await fetch(currWeatherURL)
    try {
      const data = await res.json();
      console.log(data)
      console.log("temp in getweather: ", data.data[0].temp);
      return data;
    }  catch(error) {
      console.log("error", error);
      // appropriately handle the error
    }
  }

  export{ getLatLong, 
          getWeather,
          getCountdown
        }
  