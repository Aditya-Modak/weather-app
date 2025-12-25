import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  Wind,
  Droplets,
  Thermometer,
  Heart,
  Compass,
  MapPin
} from "lucide-react";
import "./WeatherCard.css";

export function convertWindDegToDirection(deg) {
  if (deg === undefined || deg === null || isNaN(deg)) return "—";
  const dirs = ["N", "NE", "E", "SE", "S", "SW", "W", "NW"];
  const ix = Math.round(deg / 45) % 8;
  return dirs[ix];
}

function getWeatherIcon(condition) {
  const icons = {
    Clear: "☀️",
    Clouds: "☁️",
    Rain: "🌧️",
    Drizzle: "🌦️",
    Thunderstorm: "⛈️",
    Snow: "❄️",
    Mist: "🌫️",
    Haze: "🌫️",
    Fog: "🌫️",
  };
  return icons[condition] || "🌍";
}

export default function WeatherCard({ weather, onFavorite }) {
  const [unit, setUnit] = useState("C");

  const convertTemp = (t) => {
    if (t === undefined || t === null || isNaN(t)) return NaN;
    return unit === "C" ? t : (t * 9) / 5 + 32;
  };

  if (!weather) {
    return (
      <motion.div className="card empty" initial={{opacity:0}} animate={{opacity:1}}>
        <p>No weather data available.</p>
      </motion.div>
    );
  }

  const temp = convertTemp(weather.temp);
  const feels = convertTemp(weather.feelsLike);
  const humidity = Number(weather.humidity);
  const windSpeed = Number(weather.wind);
  const windDir = convertWindDegToDirection(weather.wind_deg);

  return (
    <motion.div className="card" initial={{opacity:0,y:15}} animate={{opacity:1,y:0}}>

      {/* CITY & COUNTRY */}
      <div className="location">
        <h2 className="city">{weather.city}</h2>
        <span className="country">{weather.country}</span>
      </div>

      {/* WEATHER ICON */}
      <div className="icon text-center text-5xl">
        {getWeatherIcon(weather.condition)}
      </div>

      {/* TEMPERATURE */}
      <div className="temperature">
        <span className="temp-value">{isNaN(temp) ? "—" : temp.toFixed(1)}</span>
        <span className="temp-unit">°{unit}</span>
      </div>

      {/* CONTROLS */}
      <div className="controls">
        <button onClick={() => setUnit(unit === "C" ? "F" : "C")}>
          <Thermometer size={14}/> Toggle °{unit === "C" ? "F" : "C"}
        </button>

        <button onClick={() => onFavorite(weather.city)}>
          <Heart size={14}/> Favorite
        </button>
      </div>

      {/* DESCRIPTION */}
      <p className="description text-center capitalize mt-2">{weather.description}</p>

      <div className="divider"></div>

      {/* WEATHER STATS */}
      <div className="info-grid">
  <div><p className="label">Humidity</p><p className="value"><Droplets size={14}/> {weather.humidity}%</p></div>
  <div><p className="label">Wind Speed</p><p className="value"><Wind size={14}/> {weather.wind} m/s</p></div>
  <div><p className="label">Wind Dir</p><p className="value"><Compass size={14}/> {convertWindDegToDirection(weather.wind_deg)}</p></div>
  <div><p className="label">Feels</p><p className="value"><Thermometer size={14}/> {isNaN(convertTemp(weather.feels_like)) ? "—" : convertTemp(weather.feels_like).toFixed(1)}°{unit}</p></div>
</div>


    </motion.div>
  );
}
