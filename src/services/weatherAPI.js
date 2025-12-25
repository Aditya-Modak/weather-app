const API_KEY = import.meta.env.VITE_API_KEY;
const WEATHER_URL = "https://api.openweathermap.org/data/2.5/weather";
const FORECAST_URL = "https://api.openweathermap.org/data/2.5/forecast";

// Convert wind degrees to compass direction
export function convertWindDegToDirection(deg) {
  const dirs = ["N", "NE", "E", "SE", "S", "SW", "W", "NW"];
  const ix = Math.round(deg / 45) % 8;
  return dirs[ix];
}

// Fetch current weather
export async function getCurrentWeather(city) {
  try {
    const res = await fetch(`${WEATHER_URL}?q=${city}&appid=${API_KEY}&units=metric`);
    if (!res.ok) {
      const errData = await res.json().catch(() => null);
      throw new Error(errData?.message || "City not found");
    }

    const data = await res.json();

   return {
  city: data.name,
  country: data.sys.country,
  temp: data.main.temp,
  temp_min: data.main.temp_min,
  temp_max: data.main.temp_max,
  condition: data.weather[0].main,
  description: data.weather[0].description,
  humidity: data.main.humidity,
  wind: data.wind.speed,
  wind_deg: data.wind.deg,
  feels_like: data.main.feels_like
};

  } catch (err) {
    console.error("Current Weather API Error:", err);
    throw err;
  }
}

// Fetch forecast
export async function getWeatherForecast(city, days = 5) {
  try {
    const res = await fetch(`${FORECAST_URL}?q=${city}&appid=${API_KEY}&units=metric`);
    if (!res.ok) {
      const errData = await res.json().catch(() => null);
      throw new Error(errData?.message || "Forecast not available");
    }

    const data = await res.json();

    // Group into daily buckets
    const dailyMap = {};
    data.list.forEach(item => {
      const date = new Date(item.dt * 1000).toLocaleDateString("en-IN", {
        weekday: "short",
        day: "numeric",
        month: "short",
      });

      if (!dailyMap[date]) dailyMap[date] = [];
      dailyMap[date].push(item);
    });

    const selectedDays = Object.keys(dailyMap).slice(0, days);

 return selectedDays.map(date => {
  const items = dailyMap[date];
  const temps = items.map(i => i.main.temp);

  return {
    date,
    temp: temps[Math.floor(temps.length / 2)], // midday approx
    temp_min: Math.min(...temps),
    temp_max: Math.max(...temps),
    condition: items[0].weather[0].main,
    description: items[0].weather[0].description,
    humidity: items[0].main.humidity,
    wind: items[0].wind.speed,
    wind_deg: items[0].wind.deg,
    feels_like: items[0].main.feels_like
  };
});


  } catch (err) {
    console.error("Forecast API Error:", err);
    throw err;
  }
}
