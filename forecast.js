// ======================================
// GET DATA FROM URL
// ======================================

const params =
  new URLSearchParams(window.location.search);


const latitude =
  params.get("lat");

const longitude =
  params.get("lon");

const city =
  params.get("city");

const country =
  params.get("country");

const selectedDate =
  params.get("date");


// ======================================
// CHECK URL DATA
// ======================================

if (
  !latitude ||
  !longitude ||
  !selectedDate
) {

  alert("Invalid forecast page.");

  window.location.href = "index.html";

}


// ======================================
// FETCH WEATHER
// ======================================

async function loadSelectedDay() {

  try {

    const response = await fetch(

      `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,dew_point_2m,apparent_temperature,precipitation,rain,showers,snowfall,weather_code,cloud_cover,pressure_msl,surface_pressure,wind_speed_10m,wind_direction_10m,wind_gusts_10m&hourly=temperature_2m,relative_humidity_2m,apparent_temperature,precipitation_probability,precipitation,rain,showers,snowfall,weather_code,cloud_cover,visibility,wind_speed_10m,wind_direction_10m,wind_gusts_10m,uv_index&daily=weather_code,temperature_2m_max,temperature_2m_min,apparent_temperature_max,apparent_temperature_min,uv_index_max,sunrise,sunset,daylight_duration,sunshine_duration,rain_sum,showers_sum,snowfall_sum,precipitation_sum,precipitation_hours,precipitation_probability_max,wind_speed_10m_max,wind_gusts_10m_max,wind_direction_10m_dominant&timezone=auto`

    );


    const data =
      await response.json();


    console.log(data);


    // Load selected day
    displaySelectedDay(data);


  } catch (error) {

    console.log(
      "Forecast Error:",
      error
    );

  }

}


// ======================================
// DISPLAY SELECTED DAY
// ======================================

function displaySelectedDay(data) {

  const daily =
    data.daily;


  // Find selected date
  const dayIndex =
    daily.time.indexOf(selectedDate);


  if (dayIndex === -1) {

    alert("Selected day data not found.");

    return;

  }


  // ==================================
  // DAY INFORMATION
  // ==================================

  const weatherCode =
    daily.weather_code[dayIndex];


  const weatherInfo =
    getWeatherCondition(weatherCode);


  const maxTemp =
    daily.temperature_2m_max[dayIndex];


  const minTemp =
    daily.temperature_2m_min[dayIndex];


  const feelsMax =
    daily.apparent_temperature_max[dayIndex];


  const feelsMin =
    daily.apparent_temperature_min[dayIndex];


  // ==================================
  // LOCATION
  // ==================================

  document.getElementById(
    "selectedCity"
  ).innerText = city;


  document.getElementById(
    "selectedCountry"
  ).innerText = country;


  // ==================================
  // DATE
  // ==================================

  document.getElementById(
    "selectedDate"
  ).innerText =
    formatFullDate(selectedDate);


  // ==================================
  // WEATHER
  // ==================================

  document.getElementById(
    "selectedIcon"
  ).innerText =
    weatherInfo.icon;


  document.getElementById(
    "selectedCondition"
  ).innerText =
    weatherInfo.text;


  document.getElementById(
    "selectedMax"
  ).innerText =
    `${maxTemp}°`;


  document.getElementById(
    "selectedMin"
  ).innerText =
    `${minTemp}°`;


  document.getElementById(
    "selectedFeels"
  ).innerText =
    `Feels ${feelsMax}° / ${feelsMin}°`;


  // ==================================
  // DETAILS
  // ==================================

  createSelectedDayDetails(
    daily,
    dayIndex
  );


  // ==================================
  // HOURLY
  // ==================================

  createSelectedDayHourly(
    data.hourly
  );
  setupScrollAnimations();

}


// ======================================
// DAY DETAILS
// ======================================

function createSelectedDayDetails(
  daily,
  index
) {

  const container =
    document.getElementById(
      "selectedDetails"
    );


  container.innerHTML = `

    <div class="col-md-4">
      <div class="detail-page-card">
        <span>🌧️</span>
        <strong>
          ${daily.precipitation_probability_max[index]}%
        </strong>
        <small>Rain Probability</small>
      </div>
    </div>


    <div class="col-md-4">
      <div class="detail-page-card">
        <span>💨</span>
        <strong>
          ${daily.wind_speed_10m_max[index]} km/h
        </strong>
        <small>Max Wind Speed</small>
      </div>
    </div>


    <div class="col-md-4">
      <div class="detail-page-card">
        <span>💨</span>
        <strong>
          ${daily.wind_gusts_10m_max[index]} km/h
        </strong>
        <small>Max Wind Gust</small>
      </div>
    </div>


    <div class="col-md-4">
      <div class="detail-page-card">
        <span>☀️</span>
        <strong>
          ${daily.uv_index_max[index]}
        </strong>
        <small>UV Index</small>
      </div>
    </div>


    <div class="col-md-4">
      <div class="detail-page-card">
        <span>🌅</span>
        <strong>
          ${formatTime(daily.sunrise[index])}
        </strong>
        <small>Sunrise</small>
      </div>
    </div>


    <div class="col-md-4">
      <div class="detail-page-card">
        <span>🌇</span>
        <strong>
          ${formatTime(daily.sunset[index])}
        </strong>
        <small>Sunset</small>
      </div>
    </div>


    <div class="col-md-4">
      <div class="detail-page-card">
        <span>🌧️</span>
        <strong>
          ${daily.rain_sum[index]} mm
        </strong>
        <small>Total Rain</small>
      </div>
    </div>


    <div class="col-md-4">
      <div class="detail-page-card">
        <span>☀️</span>
        <strong>
          ${formatDuration(daily.daylight_duration[index])}
        </strong>
        <small>Daylight</small>
      </div>
    </div>


    <div class="col-md-4">
      <div class="detail-page-card">
        <span>☀️</span>
        <strong>
          ${formatDuration(daily.sunshine_duration[index])}
        </strong>
        <small>Sunshine</small>
      </div>
    </div>

  `;

}


// ======================================
// SELECTED DAY HOURLY FORECAST
// ======================================

function createSelectedDayHourly(hourly) {

  const container =
    document.getElementById(
      "selectedHourlyForecast"
    );


  container.innerHTML = "";


  // Only selected date's hours
  const selectedHours =
    hourly.time
      .map((time, index) => {

        return {
          time,
          index
        };

      })
      .filter(item => {

        return item.time.startsWith(
          selectedDate
        );

      });


  selectedHours.forEach(item => {

    const i = item.index;


    const time =
      new Date(hourly.time[i]);


    const weatherInfo =
      getWeatherCondition(
        hourly.weather_code[i]
      );


    const card =
      document.createElement("div");


    card.className =
      "selected-hour-card";


    card.innerHTML = `

      <div class="hour-time">
        ${formatHour(time)}
      </div>


      <div class="hour-icon">
        ${weatherInfo.icon}
      </div>


      <div class="hour-temperature">
        ${hourly.temperature_2m[i]}°
      </div>


      <div class="hour-condition">
        ${weatherInfo.text}
      </div>


      <div class="hour-info">

        <span>
          🌧️ ${hourly.precipitation_probability[i]}%
        </span>

        <span>
          💧 ${hourly.relative_humidity_2m[i]}%
        </span>

        <span>
          💨 ${hourly.wind_speed_10m[i]} km/h
        </span>

      </div>

    `;


    container.appendChild(card);

  });

}


// ======================================
// WEATHER CONDITION
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
// FORMAT DATE
// ======================================

function formatFullDate(date) {

  const dateObject =
    new Date(date + "T00:00:00");


  return dateObject.toLocaleDateString(
    [],
    {
      weekday: "long",
      month: "long",
      day: "numeric"
    }
  );

}


// ======================================
// FORMAT TIME
// ======================================

function formatTime(dateTime) {

  const date =
    new Date(dateTime);


  return date.toLocaleTimeString(
    [],
    {
      hour: "numeric",
      minute: "2-digit"
    }
  );

}


// ======================================
// FORMAT HOUR
// ======================================

function formatHour(time) {

  return time.toLocaleTimeString(
    [],
    {
      hour: "numeric",
      minute: "2-digit"
    }
  );

}


// ======================================
// FORMAT DURATION
// ======================================

function formatDuration(seconds) {

  const hours =
    Math.floor(seconds / 3600);


  const minutes =
    Math.floor(
      (seconds % 3600) / 60
    );


  return `${hours}h ${minutes}m`;

}


// ======================================
// START
// ======================================

loadSelectedDay();

// ======================================
// SCROLL REVEAL ANIMATION
// ======================================

function setupScrollAnimations() {

  const elements =
    document.querySelectorAll(
      ".selected-day-card, .detail-page-card, .selected-hour-card"
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