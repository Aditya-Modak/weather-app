const API_KEY = import.meta.env.VITE_API_KEY;
const BASE_URL = "https://api.openweathermap.org/data/2.5/weather";

export async function getWeather(city) {
  const response = await fetch(
    `${BASE_URL}?q=${city}&appid=${API_KEY}&units=metric`
  );

  if (!response.ok) {
    throw new Error("City not found");
  }

  const data = await response.json();

  return {
    city: data.name,
    country: data.sys.country,
    temp: data.main.temp,
    condition: data.weather[0].main,
    description: data.weather[0].description,
    humidity: data.main.humidity,
    wind: data.wind.speed,
  };
}
