const searchForm = document.getElementById("searchForm");
const cityInput = document.getElementById("cityInput");


// ======================================
// SEARCH CITY
// ======================================

searchForm.addEventListener("submit", function (event) {

  event.preventDefault();

  const city = cityInput.value.trim();

  if (city === "") {
    alert("Please enter a city name");
    return;
  }

  getWeather(city);

});


// ======================================
// GET CITY COORDINATES
// ======================================

async function getWeather(city) {

  try {

    // Geocoding API
    const geoResponse = await fetch(
      `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1&language=en&format=json`
    );

    const geoData = await geoResponse.json();


    // City not found
    if (!geoData.results || geoData.results.length === 0) {

      alert("City not found!");

      return;
    }


    // First matching city
    const location = geoData.results[0];


    const latitude = location.latitude;
    const longitude = location.longitude;
    const cityName = location.name;
    const countryName = location.country;


    // Get weather
    await getWeatherData(
      latitude,
      longitude,
      cityName,
      countryName
    );


  } catch (error) {

    console.log("Error:", error);

    alert("Something went wrong!");

  }

}


// ======================================
// GET WEATHER DATA
// ======================================

async function getWeatherData(
  latitude,
  longitude,
  cityName,
  countryName
) {

  try {

    const weatherResponse = await fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,dew_point_2m,apparent_temperature,precipitation,rain,showers,snowfall,weather_code,cloud_cover,pressure_msl,surface_pressure,wind_speed_10m,wind_direction_10m,wind_gusts_10m&hourly=temperature_2m,relative_humidity_2m,dew_point_2m,apparent_temperature,precipitation_probability,precipitation,rain,showers,snowfall,weather_code,cloud_cover,visibility,wind_speed_10m,wind_direction_10m,wind_gusts_10m,uv_index&daily=weather_code,temperature_2m_max,temperature_2m_min,apparent_temperature_max,apparent_temperature_min,uv_index_max,sunrise,sunset,daylight_duration,sunshine_duration,rain_sum,showers_sum,snowfall_sum,precipitation_sum,precipitation_hours,precipitation_probability_max,wind_speed_10m_max,wind_gusts_10m_max,wind_direction_10m_dominant&timezone=auto`
    );


    const data = await weatherResponse.json();


    console.log(data);


    // ==================================
    // LOCATION
    // ==================================

    document.getElementById("cityName").innerText =
      cityName;

    document.getElementById("countryName").innerText =
      countryName;


    document.getElementById("placeCity").innerText =
      cityName;

    document.getElementById("placeCountry").innerText =
      countryName;


    // ==================================
    // CURRENT WEATHER
    // ==================================

    const current = data.current;

    const hourly = data.hourly;

    // Current time ka hour nikal rahe hain
    const currentHour = current.time.slice(0, 13);

    // Hourly array me same hour ka index find kar rahe hain
    const currentHourIndex = hourly.time.findIndex(time => {
      return time.slice(0, 13) === currentHour;
    });

    document.getElementById("temperature").innerText =
      `${current.temperature_2m}°C`;


    document.getElementById("feelsLike").innerText =
      `${current.apparent_temperature}°C`;


    document.getElementById("humidity").innerText =
      `${current.relative_humidity_2m}%`;


    document.getElementById("dewPoint").innerText =
      `${current.dew_point_2m}°C`;


    document.getElementById("cloudCover").innerText =
      `${current.cloud_cover}%`;


    document.getElementById("pressure").innerText =
      `${current.pressure_msl} hPa`;


    document.getElementById("surfacePressure").innerText =
      `${current.surface_pressure} hPa`;


    document.getElementById("windSpeed").innerText =
      `${current.wind_speed_10m} km/h`;


    document.getElementById("windDirection").innerText =
      `${current.wind_direction_10m}°`;


    document.getElementById("windGust").innerText =
      `${current.wind_gusts_10m} km/h`;


    document.getElementById("precipitation").innerText =
      `${current.precipitation} mm`;


    document.getElementById("rain").innerText =
      `${current.rain} mm`;


    document.getElementById("showers").innerText =
      `${current.showers} mm`;


    document.getElementById("snowfall").innerText =
      `${current.snowfall} cm`;


    // ==================================
    // WEATHER CONDITION
    // ==================================

    const weatherInfo =
      getWeatherCondition(current.weather_code);

    setWeatherTheme(current.weather_code);


    document.getElementById("weatherIcon").innerText =
      weatherInfo.icon;


    document.getElementById("weatherCondition").innerText =
      weatherInfo.text;


    // ==================================
    // DAILY DATA
    // ==================================

    const daily = data.daily;
    createHourlyForecast(
      data.hourly,
      data.current.time
    );
    createDailyForecast(
      data.daily,
      latitude,
      longitude,
      cityName,
      countryName
    );
    setupScrollAnimations();


    document.getElementById("sunrise").innerText =
      formatTime(daily.sunrise[0]);


    document.getElementById("sunset").innerText =
      formatTime(daily.sunset[0]);


    document.getElementById("daylight").innerText =
      formatDuration(daily.daylight_duration[0]);


    document.getElementById("sunshine").innerText =
      formatDuration(daily.sunshine_duration[0]);


    document.getElementById("uvIndex").innerText =
      daily.uv_index_max[0];


    document.getElementById("rainProbability").innerText =
      `${daily.precipitation_probability_max[0]}%`;


    // ==================================
    // RECOMMENDATION
    // ==================================

    const recommendation =
      getRecommendation(current.temperature_2m, current.rain);

    document.getElementById(
      "weatherRecommendation"
    ).innerText = recommendation;




    // ==================================
    // POPULAR PLACE
    // ==================================

    const popularPlace =
      getPopularPlace(cityName);

    document.getElementById(
      "popularPlace"
    ).innerText = popularPlace;


  } catch (error) {

    console.log("Weather Error:", error);

  }

}


// ======================================
// WEATHER CONDITION FUNCTION
// ======================================

function getWeatherCondition(code) {

  if (code === 0) {
    return {
      text: "Clear Sky",
      icon: "☀️"
    };
  }

  if (code >= 1 && code <= 3) {
    return {
      text: "Partly Cloudy",
      icon: "🌤️"
    };
  }

  if (code >= 45 && code <= 48) {
    return {
      text: "Foggy",
      icon: "🌫️"
    };
  }

  if (code >= 51 && code <= 67) {
    return {
      text: "Rainy",
      icon: "🌧️"
    };
  }

  if (code >= 71 && code <= 77) {
    return {
      text: "Snowy",
      icon: "❄️"
    };
  }

  if (code >= 80 && code <= 82) {
    return {
      text: "Rain Showers",
      icon: "🌦️"
    };
  }

  if (code >= 95) {
    return {
      text: "Thunderstorm",
      icon: "⛈️"
    };
  }

  return {
    text: "Unknown",
    icon: "🌤️"
  };

}

// ======================================
// WEATHER RECOMMENDATION
// ======================================

function getRecommendation(temperature, rain) {

  if (rain > 0) {

    return "☔ Carry an umbrella because rain is expected.";

  }

  if (temperature >= 35) {

    return "🧴 Carry a water bottle, 🧢 wear a cap and prefer light clothes.";

  }

  if (temperature >= 28) {

    return "🧴 Keep a water bottle with you and wear comfortable clothes.";

  }

  if (temperature <= 10) {

    return "🧥 Wear warm/full clothes and keep yourself protected from the cold.";

  }

  if (temperature <= 18) {

    return "🧥 A light jacket or warm clothes would be a good idea.";

  }

  return "😎 Weather looks comfortable. Normal comfortable clothes should be fine.";

}

// ======================================
// HOURLY FORECAST
// ======================================

function createHourlyForecast(hourly, currentTime) {

  const hourlyContainer =
    document.getElementById("hourlyForecast");

  hourlyContainer.innerHTML = "";


  const currentDate =
    new Date(currentTime);


  let startIndex =
    hourly.time.findIndex(time => {
      return new Date(time) >= currentDate;
    });


  if (startIndex === -1) {
    startIndex = 0;
  }


  for (
    let i = startIndex;
    i < startIndex + 8;
    i++
  ) {

    if (i >= hourly.time.length) {
      break;
    }


    const time =
      new Date(hourly.time[i]);


    const temperature =
      hourly.temperature_2m[i];


    const feelsLike =
      hourly.apparent_temperature[i];


    const rainProbability =
      hourly.precipitation_probability[i];


    const windSpeed =
      hourly.wind_speed_10m[i];


    const weatherCode =
      hourly.weather_code[i];


    const weatherInfo =
      getWeatherCondition(weatherCode);


    const card =
      document.createElement("div");


    card.className = "col";


    card.innerHTML = `

      <div class="card shadow-sm text-center h-100">

        <div class="card-body">

          <h6>
            ${formatHour(time)}
          </h6>

          <div style="font-size: 2rem;">
            ${weatherInfo.icon}
          </div>

          <h4>
            ${temperature}°C
          </h4>

          <p class="mb-1">
            Feels ${feelsLike}°C
          </p>

          <p class="mb-1">
            🌧️ ${rainProbability}%
          </p>

          <p class="mb-0">
            💨 ${windSpeed} km/h
          </p>

        </div>

      </div>

    `;


    hourlyContainer.appendChild(card);

  }

}

// ======================================
// POPULAR PLACE
// ======================================

function getPopularPlace(city) {

  const places = {

    "New Delhi": "India Gate",

    "Delhi": "India Gate",

    "Agra": "Taj Mahal",

    "Mumbai": "Gateway of India",

    "Jaipur": "Hawa Mahal",

    "Hyderabad": "Charminar",

    "Kolkata": "Victoria Memorial",

    "Bengaluru": "Lalbagh Botanical Garden",

    "Chennai": "Marina Beach",

    "Varanasi": "Ganges Ghats",

    "London": "Big Ben",

    "Paris": "Eiffel Tower",

    "Tokyo": "Tokyo Tower"

  };


  return places[city] || "Explore the popular places of this city";


}


// ======================================
// FORMAT TIME
// ======================================

function formatTime(dateTime) {

  const date = new Date(dateTime);

  return date.toLocaleTimeString([], {
    hour: "numeric",
    minute: "2-digit"
  });

}


// ======================================
// FORMAT DURATION
// ======================================

function formatDuration(seconds) {

  const hours = Math.floor(seconds / 3600);

  const minutes = Math.floor(
    (seconds % 3600) / 60
  );


  return `${hours}h ${minutes}m`;

}


// ======================================
// INITIAL WEATHER
// ======================================

getWeather("Delhi");


// ======================================
// DARK / LIGHT MODE
// ======================================

const themeToggle =
  document.getElementById("themeToggle");


// Check saved theme when page loads
const savedTheme =
  localStorage.getItem("theme");


// If user previously selected dark mode
if (savedTheme === "dark") {

  document.body.classList.add("dark-mode");

  themeToggle.innerText = "☀️ Light Mode";

}


// Toggle theme on button click
themeToggle.addEventListener("click", function () {

  document.body.classList.toggle("dark-mode");


  // Check current mode
  if (document.body.classList.contains("dark-mode")) {

    // Change button text
    themeToggle.innerText = "☀️ Light Mode";

    // Save dark mode
    localStorage.setItem("theme", "dark");

  } else {

    // Change button text
    themeToggle.innerText = "🌙 Dark Mode";

    // Save light mode
    localStorage.setItem("theme", "light");

  }

});

// ======================================
// FORMAT HOUR
// ======================================

function formatHour(time) {

  return time.toLocaleTimeString([], {
    hour: "numeric",
    minute: "2-digit"
  });

}

// ======================================
// 7 DAY FORECAST
// ======================================

function createDailyForecast(
  daily,
  latitude,
  longitude,
  cityName,
  countryName
) {

  const dailyContainer =
    document.getElementById("dailyForecast");

  dailyContainer.innerHTML = "";


  for (let i = 0; i < 7; i++) {

    const date = daily.time[i];

    const weatherCode =
      daily.weather_code[i];

    const weatherInfo =
      getWeatherCondition(weatherCode);

    const maxTemp =
      daily.temperature_2m_max[i];

    const minTemp =
      daily.temperature_2m_min[i];

    const feelsMax =
      daily.apparent_temperature_max[i];

    const feelsMin =
      daily.apparent_temperature_min[i];

    const rainProbability =
      daily.precipitation_probability_max[i];

    const windSpeed =
      daily.wind_speed_10m_max[i];


    // URL for selected day
    const forecastURL =
      `forecast.html?lat=${latitude}` +
      `&lon=${longitude}` +
      `&city=${encodeURIComponent(cityName)}` +
      `&country=${encodeURIComponent(countryName)}` +
      `&date=${date}`;


    const card =
      document.createElement("div");

    card.className = "col";


    card.innerHTML = `

      <a
        href="${forecastURL}"
        class="daily-card-link"
      >

        <div class="daily-weather-card">

          <!-- Date -->
          <div class="daily-date">
            ${formatDay(new Date(date))}
          </div>


          <!-- Weather Icon -->
          <div class="daily-icon">
            ${weatherInfo.icon}
          </div>


          <!-- Weather Condition -->
          <div class="daily-condition">
            ${weatherInfo.text}
          </div>


          <!-- Temperature -->
          <div class="daily-temperature">

            <span class="temp-high">
              ${maxTemp}°
            </span>

            <span class="temp-divider">
              /
            </span>

            <span class="temp-low">
              ${minTemp}°
            </span>

          </div>


          <!-- Feels Like -->
          <div class="daily-feels">
            Feels ${feelsMax}° / ${feelsMin}°
          </div>


          <!-- Bottom Details -->
          <div class="daily-details">

            <div>
              <span>🌧️</span>
              <span>${rainProbability}%</span>
            </div>

            <div>
              <span>💨</span>
              <span>${windSpeed} km/h</span>
            </div>

          </div>


          <!-- View More -->
          <div class="view-day">
            View hourly →
          </div>

        </div>

      </a>

    `;


    dailyContainer.appendChild(card);

  }

}

// ======================================
// FORMAT DAY
// ======================================

function formatDay(date) {

  return date.toLocaleDateString([], {
    weekday: "short",
    month: "short",
    day: "numeric"
  });

}

// ======================================
// WEATHER THEME
// ======================================

function setWeatherTheme(code) {

  const body = document.body;


  // Purani weather classes remove
  body.classList.remove(
    "weather-clear",
    "weather-cloudy",
    "weather-rain",
    "weather-cold"
  );


  // Clear
  if (code === 0) {

    body.classList.add("weather-clear");

  }


  // Cloudy
  else if (code >= 1 && code <= 48) {

    body.classList.add("weather-cloudy");

  }


  // Rain
  else if (code >= 51 && code <= 82) {

    body.classList.add("weather-rain");

  }


  // Cold / Snow
  else if (code >= 71 && code <= 77) {

    body.classList.add("weather-cold");

  }

}

// ======================================
// SCROLL REVEAL ANIMATION
// ======================================

function setupScrollAnimations() {

  const elements =
    document.querySelectorAll(
      ".card, .place-recommendation-card, .daily-weather-card"
    );


  const observer =
    new IntersectionObserver(

      (entries) => {

        entries.forEach((entry) => {

          if (entry.isIntersecting) {

            entry.target.classList.add("show");

          } else {

            entry.target.classList.remove("show");

          }

        });

      },

      {
        threshold: 0.15
      }

    );


  elements.forEach((element) => {

    element.classList.add("scroll-reveal");

    observer.observe(element);

  });

}