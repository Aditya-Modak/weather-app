import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  MapPin,
  Wind,
  Droplets,
  Thermometer,
  Calendar,
  Compass,
  Heart,
  ArrowDown,
  ArrowUp
} from "lucide-react";
import "./WeatherCard.css";


function getWeatherIcon(condition) {
  const icons = {
    clear: "☀️",
    clouds: "☁️",
    rain: "🌧️",
    drizzle: "🌦️",
    thunderstorm: "⛈️",
    snow: "❄️",
    mist: "🌫️",
    haze: "🌫️",
    fog: "🌫️",
  };
  return icons[condition?.toLowerCase()] || "🌍";
}

function convertWindDegToDirection(deg) {
  if (deg === undefined || deg === null || isNaN(deg)) return "—";
  const dirs = ["N","NE","E","SE","S","SW","W","NW"];
  const ix = Math.round(deg / 45) % 8;
  return dirs[ix];
}

export default function WeatherCard({ weather, onFavorite }) {
  const [unit, setUnit] = useState("C");

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("unit") || `"C"`);
    setUnit(saved);
  }, []);

  const toggleUnit = () => {
    const newUnit = unit === "C" ? "F" : "C";
    localStorage.setItem("unit", JSON.stringify(newUnit));
    setUnit(newUnit);
  };

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
  const tempMin = convertTemp(weather.temp_min);
  const tempMax = convertTemp(weather.temp_max);
  const feels = convertTemp(weather.feels_like);
  const humidity = weather.humidity;
  const windSpeed = weather.wind;
  const windDeg = weather.wind_deg;
  const windDir = convertWindDegToDirection(windDeg);

  return (
    <motion.div className="card" initial={{opacity:0,y:15}} animate={{opacity:1,y:0}}>

      <div className="top-controls">
        <button onClick={toggleUnit} className="unit-toggle">
          <Thermometer size={14}/> °{unit === "C" ? "F" : "C"}
        </button>
        <button onClick={() => onFavorite?.(weather.city)} className="fav-toggle">
          <Heart size={14}/> Favorite
        </button>
      </div>

      <div className="location">
        <MapPin size={20} className="pin"/>
        <h2 className="city">{weather.city}</h2>
        <span className="country">{weather.country}</span>
      </div>

      <div className="icon text-center">{getWeatherIcon(weather.condition)}</div>

      <div className="temperature">
        <span className="temp-value">
          {isNaN(temp) ? "—" : temp.toFixed(1)}
        </span>
        <span className="temp-unit">°{unit}</span>
      </div>

      <div className="minmax">
        <span><ArrowDown size={14} className="inline text-blue-400"/> {isNaN(tempMin) ? "—" : tempMin.toFixed(1)}°</span>
        <span className="mx-2">|</span>
        <span><ArrowUp size={14} className="inline text-red-400"/> {isNaN(tempMax) ? "—" : tempMax.toFixed(1)}°</span>
      </div>

      <p className="description">{weather.description}</p>

      <div className="divider"></div>

      <div className="info-grid">
        <div className="stat-item">
          <Droplets size={16} className="stat-icon blue"/>
          <span className="label">Humidity</span>
          <span className="value">{humidity ? `${humidity}%` : "—"}</span>
        </div>

        <div className="stat-item">
          <Wind size={16} className="stat-icon lightblue"/>
          <span className="label">Wind</span>
          <span className="value">{windSpeed ? `${windSpeed} m/s` : "—"}</span>
        </div>

        <div className="stat-item">
          <Compass size={16} className="stat-icon violet"/>
          <span className="label">Direction</span>
          <span className="value">{windDir}</span>
        </div>

        <div className="stat-item">
          <Thermometer size={16} className="stat-icon gray"/>
          <span className="label">Feels Like</span>
          <span className="value">{feels ? `${feels.toFixed(1)}°${unit}` : "—"}</span>
        </div>
      </div>

    </motion.div>
  );
}