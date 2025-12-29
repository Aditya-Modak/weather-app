import React from "react";
import { motion } from "framer-motion";
import { ArrowDown, ArrowUp,Calendar,
 Compass, Wind, Droplets } from "lucide-react";
import "./Forecast.css";

function getForecastIcon(condition) {
  const map = {
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
  return map[condition] || "🌍";
}

function convertWindDegToDirection(deg) {
  if (deg === undefined || deg === null || isNaN(deg)) return "—";
  const dirs = ["N","NE","E","SE","S","SW","W","NW"];
  const ix = Math.round(deg / 45) % 8;
  return dirs[ix];
}

export default function Forecast({ forecast = [], unit = "C", onClearHistory }) {
  const safeForecast = Array.isArray(forecast) ? forecast : [];
  const convertTemp = (t) => (unit === "C" ? t : (t * 9) / 5 + 32);

  return (
    <motion.div className="forecastBox" initial={{opacity:0,y:20}} animate={{opacity:1,y:0}}>
      <h2 className="text-center text-2xl font-extrabold mb-5 forecast-title">5-Day Forecast</h2>

      <div className="forecastGrid">
        {safeForecast.map((day, i) => {
          const temp = Number(day.temp);
          const min = Number(day.temp_min);
          const max = Number(day.temp_max);
          const humidity = day.humidity;
          const windSpeed = day.wind;
          const windDeg = day.wind_deg;
          const windDir = convertWindDegToDirection(windDeg);
          const compassDir = convertWindDegToDirection(windDeg);

          return (
            <motion.div key={i} className="forecastCard" whileHover={{scale:1.03}}>
              <div className="forecastIcon">{getForecastIcon(day.condition)}</div>

              <p className="forecastDate">
                <Calendar size={14} className="inline mr-1 text-yellow-600"/>
                {day.date || "—"}
              </p>

              <p className="forecastTemp text-blue-700">
                🌡 {isNaN(temp) ? "—" : `${convertTemp(temp).toFixed(1)}°${unit}`}
              </p>

              <div className="minmax">
                <span className="min"><ArrowDown size={14}/> {isNaN(min) ? "—" : `${convertTemp(min).toFixed(1)}°`}</span>
                <span className="max"><ArrowUp size={14}/> {isNaN(max) ? "—" : `${convertTemp(max).toFixed(1)}°`}</span>
              </div>

              <div className="stat-row">
                <span className="humidity"><Droplets size={14} className="text-red-500"/> {humidity}%</span>
                <span className="wind"><Wind size={14} className="text-blue-500"/> {windSpeed} m/s</span>
              </div>

              <div className="direction-row">
                <Compass size={16} className="text-green-600"/> 
                <span className="wind-dir">{compassDir}</span>
              </div>
            </motion.div>
          );
        })}
      </div>

      {onClearHistory && (
        <div className="text-center">
          <button onClick={onClearHistory} className="clear-history-btn mt-4">
            <Trash2 size={16}/> Clear History
          </button>
        </div>
      )}
    </motion.div>
  );
}