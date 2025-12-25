import React from "react";
import { motion } from "framer-motion";
import { ArrowDown, ArrowUp, Wind, Droplets, Calendar, Compass } from "lucide-react";
import "../index.css";
import "./Forecast.css";


export function convertWindDegToDirection(deg) {
  if (deg === undefined || deg === null || isNaN(deg)) return "—";
  const dirs = ["N", "NE", "E", "SE", "S", "SW", "W", "NW"];
  const ix = Math.round(deg / 45) % 8;
  return dirs[ix];
}

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

export default function Forecast({ forecast = [], unit = "C", onClearHistory }) {
  const safeForecast = Array.isArray(forecast) ? forecast : [];

  const convertTemp = (t) => {
    if (t === undefined || t === null || isNaN(t)) return "—";
    return unit === "C" ? t : (t * 9) / 5 + 32;
  };

  return (
    <motion.div
      className="forecastBox"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <h2 className="text-center text-xl font-bold mb-4 flex items-center justify-center gap-1">
        <Calendar size={18}/> 5-Day Forecast
      </h2>

      <div className="forecastGrid">
        {safeForecast.map((day, i) => {
          const temp = Number(day.temp);
          const min = Number(day.temp_min);
          const max = Number(day.temp_max);
          const humidity = Number(day.humidity);
          const windSpeed = Number(day.wind);
          const windDir = convertWindDegToDirection(day.wind_deg);

          return (
            <motion.div
              key={i}
              className="forecastCard"
              whileHover={{ scale: 1.04 }}
              transition={{ type: "spring", stiffness: 120 }}
            >
              {/* WEATHER ICON */}
              <div className="forecastIcon text-center">
                {getForecastIcon(day.condition)}
              </div>

              {/* DATE */}
              <p className="forecastDate text-center flex items-center justify-center gap-1">
                <Calendar size={12}/> {day.date || "—"}
              </p>

              {/* TEMPERATURE */}
              <p className="forecastTemp text-center">
                {isNaN(temp) ? "—" : `${convertTemp(temp).toFixed(1)}°${unit}`}
              </p>

              {/* MIN / MAX TEMPERATURE */}
              <div className="minmax text-center flex items-center justify-center gap-2 mt-2">
                <span className="inline-flex items-center gap-1">
                  <ArrowDown size={14}/> {isNaN(min) ? "—" : `${convertTemp(min).toFixed(1)}°`}
                </span>
                <span className="inline-flex items-center gap-1">
                  <ArrowUp size={14}/> {isNaN(max) ? "—" : `${convertTemp(max).toFixed(1)}°`}
                </span>
                <span className="text-[10px] opacity-60">°{unit}</span>
              </div>

              {/* HUMIDITY / WIND / DIRECTION */}
              <div className="stat-row flex justify-center gap-3 text-xs text-slate-400 mt-3">
                <span className="inline-flex items-center gap-1">
                  <Droplets size={12}/> {isNaN(humidity) ? "—" : `${humidity}%`}
                </span>

                <span className="inline-flex items-center gap-1">
                  <Wind size={12}/> {isNaN(windSpeed) ? "—" : `${windSpeed} m/s`}
                </span>

                <span className="inline-flex items-center gap-1">
                  <Compass size={12}/> {windDir}
                </span>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* CLEAR HISTORY */}
      {onClearHistory && (
        <div className="text-center mt-3">
          <button onClick={onClearHistory} className="clear-history-btn">
            Clear Search History
          </button>
        </div>
      )}
    </motion.div>
  );
}
