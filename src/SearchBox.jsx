// importing textField and Button from Metrial UI
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { useState } from "react";
const API_KEY = import.meta.env.VITE_WEATHER_API_KEY;  // getting our Api key from .env file

export default function SearchBox() {
  const GEO_API_URL = "http://api.openweathermap.org/geo/1.0/direct";
  const WEATHER_API_URL = "https://api.openweathermap.org/data/2.5/weather";

  const [city, setCity] = useState("");
  const [weather, setWeather] = useState(null);

  const getWeather = async () => {
    try {
      const geoResponse = await fetch(`${GEO_API_URL}?q=${city}&limit=1&appid=${API_KEY}`);
      if (!geoResponse.ok) throw new Error("Failed to fetch location data");

      const geoData = await geoResponse.json();
      if (geoData.length === 0) {
        alert("City not found!");
        return;
      }

      const { lat, lon } = geoData[0];

      const weatherResponse = await fetch(`${WEATHER_API_URL}?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`);
      if (!weatherResponse.ok) throw new Error("Failed to fetch weather data");

      const weatherData = await weatherResponse.json();
      setWeather(weatherData);

    } catch (error) {
      console.error("Error fetching weather data:", error);
      alert("Error fetching data. Please try again.");
    }
  };

  const handleChange = (e) => setCity(e.target.value);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (city.trim() === "") {
      alert("Please enter a city name.");
      return;
    }
    getWeather();
    setCity("");
  };

  return (
    <div className="weather-card">
      {/* 🔍 SEARCH SECTION */}
      <h5>Search for the weather</h5>
      <form onSubmit={handleSubmit}>
        <TextField
          id="city"
          label="City Name"
          variant="filled"
          color="success"
          value={city}
          onChange={handleChange}
          fullWidth
          sx={{
            backgroundColor: 'rgba(255,255,255,0.2)',
            borderRadius: '8px',
            input: { color: '#fff' },
            label: { color: '#e0e7ff' }
          }}
        />
        <br /><br />
        <Button
          variant="contained"
          color="success"
          type="submit"
          fullWidth
          sx={{ padding: '0.8rem', fontSize: '1rem' }}
        >
          Search
        </Button>
      </form>

      {/* ☀️ WEATHER INFO SECTION */}
      {weather && (
        <div style={{ marginTop: "2.5rem" }}>
          <h4>{weather.name}</h4>
          <p>🌡️ Temperature: {weather.main.temp}°C</p>
          <p>🌥️ Condition: {weather.weather[0].description}</p>
          <p>💨 Wind Speed: {weather.wind.speed} m/s</p>
        </div>
      )}
    </div>
  );
}
