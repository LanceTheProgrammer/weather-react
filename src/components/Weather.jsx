import React, { useEffect, useRef, useState } from "react";
import "./Weather.css";
import search_icon from "../assets/search.png";
import clear_icon from "../assets/clear.png";
import cloud_icon from "../assets/cloud.png";
import drizzle_icon from "../assets/drizzle.png";
import humidity_icon from "../assets/humidity.png";
import rain_icon from "../assets/rain.png";
import snow_icon from "../assets/snow.png";
import wind_icon from "../assets/wind.png";

const Weather = () => {
  const inputRef = useRef(); // Reference to the input element

  const [weatherData, setWeatherData] = useState(false); // State to hold weather data

  // Object mapping weather icons to their corresponding images
  const allIcons = {
    "01d": clear_icon,
    "01n": clear_icon,
    "02d": cloud_icon,
    "02n": cloud_icon,
    "03d": cloud_icon,
    "04d": drizzle_icon,
    "09d": rain_icon,
    "09n": rain_icon,
    "10d": rain_icon,
    "10n": rain_icon,
    "13d": snow_icon,
    "13n": snow_icon,
  };

  // Function to search for weather data by city
  const search = async (city) => {
    if (city === "") {
      alert("Enter City Name"); // Alert if city name is empty
      return;
    }
    try {
      const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=imperial&appid=${
        import.meta.env.VITE_APP_ID
      }`;

      const response = await fetch(url); // Fetch weather data from API
      const data = await response.json(); // Convert response to JSON

      if (!response.ok) {
        alert(data.message); // Alert if API request fails
        return;
      }

      console.log(data);
      const icon = allIcons[data.weather[0].icon] || clear_icon; // Get weather icon
      // Set weather data to state
      setWeatherData({
        humidity: data.main.humidity,
        windSpeed: data.wind.speed,
        temperature: Math.floor(data.main.temp),
        location: data.name,
        icon: icon,
      });
    } catch (error) {
      setWeatherData(false); // Set weather data to false if there's an error
      console.error("Error in fetching weather data");
    }
  };

  useEffect(() => {
    search("Portland"); // Fetch weather data for Portland on component mount
  }, []);

  // Event handler for keydown event on input field
  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      search(inputRef.current.value); // Search for weather data when Enter key is pressed
    }
  };

  return (
    <div className="weather">
      <div className="search-bar">
        {/* Input field for city search */}
        <input
          ref={inputRef}
          type="text"
          placeholder="Search"
          onKeyDown={handleKeyDown} // Call handleKeyDown on keydown event
        />
        {/* Button to trigger search */}
        <img
          onClick={() => search(inputRef.current.value)}
          src={search_icon}
          alt=""
        />
      </div>
      {/* Display weather data if available */}
      {weatherData ? (
        <>
          <img src={weatherData.icon} alt="" className="weather-icon" />
          <p className="temperature">{weatherData.temperature}° f</p>
          <p className="location">{weatherData.location}</p>
          <div className="weather-data">
            <div className="col">
              <img src={humidity_icon} alt="" />
              <div>
                <p>{weatherData.humidity} %</p>
                <span>Humidity</span>
              </div>
            </div>
            <div className="col">
              <img src={wind_icon} alt="" />
              <div>
                <p>{weatherData.windSpeed} km/h</p>
                <span>Wind Speed</span>
              </div>
            </div>
          </div>
        </>
      ) : (
        <></>
      )}
    </div>
  );
};

export default Weather;


