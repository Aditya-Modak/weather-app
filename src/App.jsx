import React, { useState, useEffect } from "react";
import SearchBar from "./components/SearchBar.jsx";
import WeatherCard from "./components/WeatherCard.jsx";
import Forecast from "./components/Forecast.jsx";
import { getCurrentWeather, getWeatherForecast } from "./services/weatherAPI.js";
import { MapPin, Thermometer, Heart, Clock, Trash2 } from "lucide-react";

import "./index.css";
import "./App.css";

export default function App() {
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

  useEffect(() => {
    document.body.classList.toggle("dark", darkMode);
  }, [darkMode]);

  const toggleDarkMode = () => {
    const newMode = !darkMode;
    localStorage.setItem("darkMode", JSON.stringify(newMode));
    setDarkMode(newMode);
  };

  const toggleUnit = () => {
    const newUnit = unit === "C" ? "F" : "C";
    localStorage.setItem("unit", JSON.stringify(newUnit));
    setUnit(newUnit);
  };

  const clearHistory = () => {
    localStorage.setItem("history", "[]");
    setHistory([]);
  };

  const handleSearch = async (city) => {
    setLoading(true);
    setError(null);
    try {
      const current = await getCurrentWeather(city);
      const future = await getWeatherForecast(city, 5);
      setWeather(current);
      setForecast(future);

      const newHistory = [
        current.city,
        ...history.filter(c => c.toLowerCase() !== current.city.toLowerCase())
      ].slice(0, 8);

      localStorage.setItem("history", JSON.stringify(newHistory));
      setHistory(newHistory);
    } catch (err) {
      setError(err.message);
      setWeather(null);
      setForecast([]);
    } finally {
      setLoading(false);
    }
  };

  const addFavorite = (city) => {
    const newFav = [city, ...favorites.filter(f => f.toLowerCase() !== city.toLowerCase())];
    localStorage.setItem("favorites", JSON.stringify(newFav));
    setFavorites(newFav);
  };

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-950 text-slate-900 dark:text-slate-100 p-4 sm:p-6 md:p-8 flex flex-col items-center">

      {/* Top control bar */}
      <header className="w-full max-w-4xl flex items-center justify-between bg-white dark:bg-slate-900 p-3 rounded-full border border-slate-200 dark:border-slate-800 shadow-md">
        <button className="flex items-center gap-1 text-xs px-3 py-1 hover:bg-blue-500/10 rounded-full transition">
          <MapPin size={14}/> Geo
        </button>

        <button onClick={toggleUnit} className="flex items-center gap-1 text-xs px-3 py-1 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-full transition">
          <Thermometer size={14}/> °{unit === "C" ? "F" : "C"}
        </button>

        <button onClick={toggleDarkMode} className="text-xs px-3 py-1 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-full transition">
          {darkMode ? "Light" : "Dark"}
        </button>
      </header>

      {/* Main title */}
      <h1 className="text-3xl font-bold text-center mt-6 tracking-tight">Weather Dashboard</h1>

      {/* Search */}
      <div className="w-full max-w-xl mt-6">
        <SearchBar onSearch={handleSearch} />
      </div>

      {/* Loading & errors */}
      {loading && <div className="mt-8 animate-spin w-10 h-10 border-t-2 border-b-2 border-blue-500 rounded-full"></div>}
      {error && <p className="mt-6 text-red-500 text-sm font-medium">{error}</p>}

      {/* Main content grid */}
      <main className="w-full max-w-4xl grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">
        <div className="lg:col-span-2">
          <WeatherCard weather={weather} onFavorite={addFavorite}/>
        </div>

        <div className="lg:col-span-1">
          <Forecast forecast={forecast} unit={unit}/>
        </div>
      </main>

      {/* Favorites */}
      <section className="w-full max-w-4xl bg-white/60 dark:bg-slate-900/40 backdrop-blur-md p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow mt-8 lg:mt-2">
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-semibold text-base flex items-center gap-1"><Heart size={16}/> Favorites</h2>
          {history.length > 0 && (
            <button onClick={clearHistory} className="text-[11px] text-red-500 hover:text-red-300">Clear</button>
          )}
        </div>
        {favorites.length === 0 && <p className="text-xs opacity-50 text-center py-3">No favorites saved</p>}
        <div className="flex flex-wrap gap-2 justify-center">
          {favorites.map((c,i)=>(
            <button key={i} onClick={()=>handleSearch(c)} className="px-3 py-1 bg-slate-700 text-white text-xs rounded-full hover:bg-blue-500 transition">
              {c}
            </button>
          ))}
        </div>
      </section>

      {/* Search History */}
      <section className="w-full max-w-4xl bg-white/60 dark:bg-slate-900/40 backdrop-blur-md p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow mt-6">
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-semibold text-base flex items-center gap-1"><Clock size={16}/> Search History</h2>
          {history.length > 0 && (
            <button onClick={clearHistory} className="text-[11px] text-red-500 hover:text-red-300">Clear</button>
          )}
        </div>
        {history.length === 0 && <p className="text-xs opacity-50 text-center py-3">No searches yet</p>}
        <div className="flex flex-wrap gap-2 justify-center">
          {history.map((c,i)=>(
            <button key={i} onClick={()=>handleSearch(c)} className="px-3 py-1 bg-slate-800/80 text-white dark:bg-slate-700/30 dark:text-slate-300 text-xs rounded-full hover:bg-blue-500/20 transition">
              {c}
            </button>
          ))}
        </div>
      </section>
    </div>
  );
}