
import './App.css';
// images
import search from './assets/search.png';
import clear from "./assets/clear.webp";
import cloud from "./assets/cloud.jpg";
import drizzle from "./assets/drizzle.png"
import humidityicon from "./assets/humidity.png"
import windicon from "./assets/wind.png"
import rain from "./assets/rain.webp"
import snow from "./assets/snow.png"
import { useEffect, useState } from 'react';

const Weatherdetails = ({ icon, temp, city, country, lat, log,humidity,wind }) => {
  return (
    <>
      <div className='image'><img src={icon}></img>
      </div>
      <div className='temp'>{temp}&deg;C</div>
      <div className='location'>{city}</div>
      <div className='country'>{country}</div>
      <div className='cord'>
        <div>
          <span className='lat'>Latitude</span><span>{lat}</span>
        </div>
        <div>
          <span className='log'>Longitude</span><span>{log}</span>
        </div>
      </div>
      <div className='data-container'>
        <div className='element'>
          <img src={humidityicon} alt="humidity" className='icon'></img>
          <div className='data'>
            <div className='humidity-percent'>{humidity}%</div>
            <div className='text'>Humidity</div>

          </div>
        </div>
        <div className='element'>
          <img src={windicon} alt="wind" className='icon'></img>
          <div className='data'>
            <div className='Wind-percent'>{wind}km/h</div>
            <div className='text'>Wind speed</div>

          </div>
        </div>
      </div>
    </>
  )
}

function App() {

  let api_key="8cd991a78653641b8f5be4c6e4a47663"
  const [text,settext]=useState("Chennai")
  const [icon, seticon] = useState(drizzle)
  const [temp, settemp] = useState(0)
  const [city, setcity] = useState("Chennai")
  const [country, setcountry] = useState("India")
  const [lat, setlat] = useState(0)
  const [log, setlog] = useState(0)
  const [humidity, sethumidity]=useState(0)
  const [wind, setwind]=useState(0)
  const [citynotfound, setcitynotfound]=useState(false);
  const [loading, setloading]=useState(false)
  const [error, seterror]=useState(null)

  const weatherIconmap={
    "01d":clear,
    "01n":clear,
    "02d":cloud,
    "02n":cloud,
    "03d":drizzle,
    "03n":drizzle,
    "04d":drizzle,
    "04n":drizzle,
    "09d":rain,
    "09n":rain,
    "10d":rain,
    "10n":rain,
    "13d":snow,
    "13n":snow,


  };

const searchbar = async () => {

  setloading(true);
  let url=`https://api.openweathermap.org/data/2.5/weather?q=${text}&appid=${api_key}&units=Metric`;

  try{
    let res=await fetch(url);
    let data=await res.json();
    //console.log(data)
    if(data.cod==="404")
      {
        console.error("city not found");
        setcitynotfound(true)
        setloading(false)
        return;
      }
      sethumidity(data.main.humidity);
      setwind(data.wind.speed);
      settemp(Math.floor(data.main.temp));
      setcity(data.name);
      setcountry(data.sys.country)
      setlat(data.coord.lat);
      setlog(data.coord.lon)
      const weatherIconcode=data.weather[0].icon;
      seticon(weatherIconmap[weatherIconcode] || clear);
      setcitynotfound(false);
  }
  catch(error)
  {
    seterror("An error occurred while fetching data.")
  }
  finally
  {
    setloading(false);
  }
}
  const handlecity=(e)=>{
    settext(e.target.value)
  }
  const handlekeydown=(e)=>{
    if(e.key==="Enter")
      {
        searchbar();
      }
  }

  useEffect(function(){
    searchbar();
  }, []);
  return (
    <>
      <div className='container'>
        <div className='input-container'>
          <input onChange={handlecity} className="cityinput" type="text" placeholder='Search city'value={text} onKeyDown={handlekeydown}></input>
          <div className='search-icon' onClick={()=>searchbar()}><img src={search}></img></div>
        </div>
        
      {loading && <div className='loading-message'>Loading...</div>}
      {error && <div className='error-message'>{error}</div>}
      {citynotfound && <div className='city-notfound'>City not found</div>}

      {!loading && !citynotfound && !error && <Weatherdetails icon={icon} temp={temp} city={city} country={country} lat={lat} log={log} humidity={humidity} wind={wind}></Weatherdetails>}
      </div>
    </>
  );
}

export default App;
