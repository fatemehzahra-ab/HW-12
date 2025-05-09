import "./style.css";
import "./index.css";

document.addEventListener("DOMContentLoaded", () => {
  const selectBox = document.getElementById("selectBox");
  const detailsDiv = document.getElementById("details");
  let countries = [];

  fetch("https://restcountries.com/v3.1/all")
    .then((response) => response.json())
    .then((data) => {
      countries = data;

      countries.forEach((item) => {
        const option = document.createElement("option");
        option.value = item.cca3;
        option.textContent = item.name.common;
        selectBox.appendChild(option);
      });
    })
    .catch((error) => {
      console.error("Error fetching country data:", error);
      detailsDiv.textContent = "Failed to load country data";
    });

  selectBox.addEventListener("change", () => {
    const selectedId = selectBox.value;
    if (selectedId) {
      const country = countries.find((c) => c.cca3 === selectedId);
      displayWeatherDetails(country);
    } else {
      detailsDiv.textContent = "Please select a country";
      detailsDiv.classList = "text-center";
    }
  });

  function displayWeatherDetails(country) {
    if (!country) {
      detailsDiv.textContent = "Country not found";
      return;
    }

    const capital = country.capital ? country.capital[0] : null;
    if (capital) {
      detailsDiv.innerHTML = `<div>Fetching weather data for ${capital}...</div>
      `;

      fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${capital}&appid=0cd3346ab46a7671bd8e3412bda4fecd&units=metric`
      )
        .then((response) => {
          if (!response.ok) {
            throw new Error("Weather data not found");
          }
          return response.json();
        })
        .then((weatherData) => {
          detailsDiv.innerHTML = `<div class="w-full max-w-sm mx-auto bg-sky-50 rounded-xl shadow-md p-6 text-left space-y-4">
             <h4 class="text-xl font-semibold text-gray-800">Weather in ${capital}</h4>
             <p class="text-gray-600">🌡 Temperature: <strong>${weatherData.main.temp} °C</strong></p>
             <p class="text-gray-600">🌥 Condition: <strong>${weatherData.weather[0].description}</strong></p>
             <p class="text-gray-600">💧 Humidity: <strong>${weatherData.main.humidity}%</strong></p>
             <p class="text-gray-600">💨 Wind Speed: <strong>${weatherData.wind.speed} m/s</strong></p>
            </div>
          `;
        })
        .catch((error) => {
          console.error("Error fetching weather data:", error);
          detailsDiv.textContent = `Failed to load weather data for ${capital}`;
        });
    } else {
      detailsDiv.textContent = "No capital city available for weather data";
    }
  }
});
