import React, { useState, useEffect } from "react";
import SearchBar from "./components/SearchBar.jsx";
import WeatherCard from "./components/WeatherCard.jsx";
import Forecast from "./components/Forecast.jsx";
import { getCurrentWeather, getWeatherForecast } from "./services/weatherAPI.js";
import {
  MapPin,
  Thermometer,
  Trash2
} from "lucide-react";

import "./index.css";
import "./App.css";

export default function App() {
  /* ================= STATE ================= */
  const [weather, setWeather] = useState(null);
  const [forecast, setForecast] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [favorites, setFavorites] = useState(
    JSON.parse(localStorage.getItem("favorites") || "[]")
  );
  const [history, setHistory] = useState(
    JSON.parse(localStorage.getItem("history") || "[]")
  );
  const [darkMode, setDarkMode] = useState(
    JSON.parse(localStorage.getItem("darkMode") || "false")
  );
  const [unit, setUnit] = useState(
    JSON.parse(localStorage.getItem("unit") || `"C"`)
  );

  /* ================= EFFECTS ================= */
  useEffect(() => {
    document.body.classList.toggle("dark", darkMode);
  }, [darkMode]);

  /* ================= CORE SEARCH ================= */
  const handleSearch = async (city) => {
    if (!city) return;

    setLoading(true);
    setError(null);

    const timeout = setTimeout(() => {
      setError("Request timed out. Try again.");
      setLoading(false);
    }, 10000);

    try {
      const current = await getCurrentWeather(city);
      const future = await getWeatherForecast(city, 5);

      setWeather(current);
      setForecast(future);

      const newHistory = [
        current.city,
        ...history.filter(h => h.toLowerCase() !== current.city.toLowerCase())
      ].slice(0, 8);

      localStorage.setItem("history", JSON.stringify(newHistory));
      setHistory(newHistory);
    } catch (err) {
      setError(err.message || "Failed to fetch weather");
      setWeather(null);
      setForecast([]);
    } finally {
      clearTimeout(timeout);
      setLoading(false);
    }
  };

  /* ================= LOCATION ================= */
  const detectLocation = () => {
    if (!navigator.geolocation) {
      setError("Geolocation not supported");
      return;
    }

    setLoading(true);

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        try {
          const { latitude, longitude } = pos.coords;
          const key = import.meta.env.VITE_API_KEY;

          const res = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${key}&units=metric`
          );
          const data = await res.json();

          handleSearch(data.name);
        } catch {
          setError("Location detection failed");
        } finally {
          setLoading(false);
        }
      },
      () => {
        setError("Location permission denied");
        setLoading(false);
      }
    );
  };

  /* ================= UTILITIES ================= */
  const toggleUnit = () => {
    const newUnit = unit === "C" ? "F" : "C";
    localStorage.setItem("unit", JSON.stringify(newUnit));
    setUnit(newUnit);
  };

  const toggleDarkMode = () => {
    const newMode = !darkMode;
    localStorage.setItem("darkMode", JSON.stringify(newMode));
    setDarkMode(newMode);
  };

  const addFavorite = (city) => {
    const updated = [city, ...favorites.filter(f => f !== city)];
    localStorage.setItem("favorites", JSON.stringify(updated));
    setFavorites(updated);
  };

  const removeFavorite = (city) => {
    const updated = favorites.filter(f => f !== city);
    localStorage.setItem("favorites", JSON.stringify(updated));
    setFavorites(updated);
  };

  const clearHistory = () => {
    localStorage.setItem("history", "[]");
    setHistory([]);
  };

  /* ================= RENDER ================= */
  return (
    <div className="container">

      {/* Top Bar */}
      <div className="top-bar">
        <button className="toggle" onClick={toggleDarkMode}>
          {darkMode ? "☀ Light" : "🌙 Dark"}
        </button>
      </div>

      <h1 className="title text-center">Weather Dashboard</h1>

      <SearchBar onSearch={handleSearch} />

      <div className="text-center mt-3">
        <button className="detect-btn" onClick={detectLocation}>
          <MapPin size={14}/> Detect My Location
        </button>
      </div>

      {loading && <div className="loader"></div>}
      {error && <p className="error text-center">{error}</p>}

      {weather && <WeatherCard weather={weather} onFavorite={addFavorite} />}

      {forecast.length > 0 && (
        <Forecast forecast={forecast} unit={unit} />
      )}

      {/* Favorites */}
      <div className="favorites-section">
        <h2>Favorite Cities</h2>
        <div className="favorites-list">
          {favorites.map((c, i) => (
            <div key={i} className="fav-row">
              <button className="fav-city" onClick={() => handleSearch(c)}>{c}</button>
              <button onClick={() => removeFavorite(c)}><Trash2 size={14}/></button>
            </div>
          ))}
        </div>
      </div>

      {/* History */}
      <div className="history-section">
        <h2>Search History</h2>
        <div className="history-list">
          {history.map((c, i) => (
            <button key={i} onClick={() => handleSearch(c)} className="history-city">
              {c}
            </button>
          ))}
        </div>

        {history.length > 0 && (
          <button className="clear-history-btn" onClick={clearHistory}>
            <Trash2 size={14}/> Clear History
          </button>
        )}
      </div>

      {/* Unit Toggle */}
      <div className="unit-section">
        <button onClick={toggleUnit} className="unit-toggle">
          <Thermometer size={14}/> Switch °{unit === "C" ? "F" : "C"}
        </button>
      </div>

    </div>
  );
}
