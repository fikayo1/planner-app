import React, { useState, useEffect } from 'react';
import axios from 'axios';
import "../App.css"
import {API_KEY} from "../config.js"
export default function WeatherWidget() {
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWeather = async (latitude, longitude) => {
      try {
        const response = await axios.get(
          `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${API_KEY}`
        );
        setWeather(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching weather:', error);
        setLoading(false);
      }
    };

    const getLocation = () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const { latitude, longitude } = position.coords;
            fetchWeather(latitude, longitude);
          },
          (error) => {
            console.error('Error retrieving location:', error);
            setLoading(false);
          }
        );
      } else {
        console.error('Geolocation is not supported by this browser.');
        setLoading(false);
      }
    };

    getLocation();

    // Cleanup function
    return () => {
      // Any cleanup logic if needed
    };
  }, []);

  if (loading) {
    return <p>Loading weather...</p>;
  }

  if (!weather) {
    return <p>Failed to fetch weather data.</p>;
  }

  const { name, main, weather: weatherDetails } = weather;
  const { temp, humidity } = main;
  const weatherCondition = weatherDetails[0].description;

  return (
    <div className="weather-card">
      <h1>Current Weather Condition</h1>
      <p>Location: {name}</p>
      <p>Temperature: {Math.round(temp - 273.15)}°C</p>
      <p>Humidity: {humidity}%</p>
      <p>Condition: {weatherCondition}</p>
    </div>
  );
}
