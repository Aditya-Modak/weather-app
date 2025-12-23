import { useState } from "react";
import SearchBar from "./components/SearchBar";
import WeatherCard from "./components/WeatherCard";
import { getWeather } from "./services/weatherAPI";

function App() {
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [darkMode, setDarkMode] = useState(false);

  async function handleSearch(city) {
    setLoading(true);
    setError("");
    setWeather(null);

    try {
      const data = await getWeather(city);
      setWeather(data);
    } catch (err) {
      setError(err.message);
    }

    setLoading(false);
  }

  return (
    <div className={darkMode ? "container dark" : "container"}>
      <button className="toggle" onClick={() => setDarkMode(!darkMode)}>
        {darkMode ? "☀️ Light Mode" : "🌙 Dark Mode"}
      </button>

      <h1>🌤 Weather App</h1>

      <SearchBar onSearch={handleSearch} />

     {loading && <div className="loader"></div>}
      {error && <p className="error">{error}</p>}
      {weather && <WeatherCard weather={weather} />}
    </div>
  );
}

export default App;
