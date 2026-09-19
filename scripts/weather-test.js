// ===== Lagos coordinates =====
const LAT = 6.52;
const LON = 3.38;

const API_KEY = '59069118e3afd706fbab534936f73be9';
const currentWeatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${LAT}&lon=${LON}&units=metric&appid=${API_KEY}`;
const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${LAT}&lon=${LON}&units=metric&appid=${API_KEY}`;

const currentWeatherEl = document.querySelector('#current-weather');
const forecastEl = document.querySelector('#forecast');

// ===== Current weather =====
const getCurrentWeather = async () => {
  try {
    const response = await fetch(currentWeatherUrl);
    const data = await response.json();

    if (!response.ok) {
      // Show the actual API error message for debugging instead of a generic string
      throw new Error(`(${response.status}) ${data.message || 'Unknown error'}`);
    }

    displayCurrentWeather(data);
  } catch (error) {
    console.error('Error fetching current weather:', error);
    currentWeatherEl.innerHTML = `<p class="error-message">Weather unavailable: ${error.message}</p>`;
  }
};

const displayCurrentWeather = (data) => {
  const temp = Math.round(data.main.temp);
  const description = data.weather[0].description;
  const icon = data.weather[0].icon;

  currentWeatherEl.innerHTML = `
    <img src="https://openweathermap.org/img/wn/${icon}@2x.png" alt="${description}" width="60" height="60">
    <div>
      <p class="current-temp">${temp}&deg;C</p>
      <p class="current-desc">${description}</p>
    </div>
  `;
};

// ===== 3-day forecast =====
const getForecast = async () => {
  try {
    const response = await fetch(forecastUrl);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(`(${response.status}) ${data.message || 'Unknown error'}`);
    }

    displayForecast(data.list);
  } catch (error) {
    console.error('Error fetching forecast:', error);
    forecastEl.innerHTML = `<p class="error-message">Forecast unavailable: ${error.message}</p>`;
  }
};

const displayForecast = (list) => {
  // The 5-day/3-hour forecast returns entries every 3 hours.
  // Pick the entry closest to 12:00 for each of the next 3 distinct days.
  const dailyEntries = list.filter((entry) => entry.dt_txt.includes('12:00:00')).slice(0, 3);

  dailyEntries.forEach((entry) => {
    const date = new Date(entry.dt_txt);
    const dayLabel = date.toLocaleDateString('en-US', { weekday: 'short' });
    const temp = Math.round(entry.main.temp);
    const icon = entry.weather[0].icon;
    const description = entry.weather[0].description;

    const card = document.createElement('div');
    card.classList.add('forecast-card');
    card.innerHTML = `
      <p class="forecast-day">${dayLabel}</p>
      <img src="https://openweathermap.org/img/wn/${icon}.png" alt="${description}" width="40" height="40">
      <p class="forecast-temp">${temp}&deg;C</p>
    `;
    forecastEl.appendChild(card);
  });
};

// ===== Init =====
getCurrentWeather();
getForecast();