import { useState } from "react";

function getWeatherIcon(condition) {
  switch (condition) {
    case "Clear":
      return "☀️";
    case "Clouds":
      return "☁️";
    case "Rain":
      return "🌧️";
    case "Drizzle":
      return "🌦️";
    case "Thunderstorm":
      return "⛈️";
    case "Snow":
      return "❄️";
    case "Mist":
    case "Haze":
    case "Fog":
      return "🌫️";
    default:
      return "🌍";
  }
}

function WeatherCard({ weather }) {
  const [unit, setUnit] = useState("C");

  function convertTemp(temp) {
    return unit === "C" ? temp : (temp * 9) / 5 + 32;
  }

  return (
    <div className="card">
      {/* Location */}
      <div className="location">
        <h2>{weather.city}</h2>
        <span>{weather.country}</span>
      </div>

      {/* Weather Icon */}
      <div className="icon">
        {getWeatherIcon(weather.condition)}
      </div>

      {/* Temperature */}
      <div className="temperature">
        <span className="temp-value">
          {convertTemp(weather.temp).toFixed(1)}
        </span>
        <span className="temp-unit">°{unit}</span>
      </div>

      {/* Toggle */}
      <button
        className="unit-toggle"
        onClick={() => setUnit(unit === "C" ? "F" : "C")}
      >
        Switch to °{unit === "C" ? "F" : "C"}
      </button>

      {/* Description */}
      <p className="description">
        {weather.description}
      </p>

      {/* Divider */}
      <div className="divider"></div>

      {/* Details */}
      <div className="info-grid">
        <div>
          <p className="label">Humidity</p>
          <p className="value">{weather.humidity}%</p>
        </div>

        <div>
          <p className="label">Wind</p>
          <p className="value">{weather.wind} m/s</p>
        </div>
      </div>
    </div>
  );
}

export default WeatherCard;
