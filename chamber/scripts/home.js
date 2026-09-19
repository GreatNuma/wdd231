// ===== Lagos coordinates =====
const LAT = 6.52;
const LON = 3.38;

// Replace YOUR_API_KEY_HERE with my OpenWeatherMap API key
const API_KEY = '59069118e3afd706fbab534936f73be9';
const currentWeatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${LAT}&lon=${LON}&units=metric&appid=${API_KEY}`;
const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${LAT}&lon=${LON}&units=metric&appid=${API_KEY}`;

const currentWeatherEl = document.querySelector('#current-weather');
const forecastEl = document.querySelector('#forecast');

// ===== Current weather =====
const getCurrentWeather = async () => {
  try {
    const response = await fetch(currentWeatherUrl);
    if (!response.ok) throw Error(await response.text());
    const data = await response.json();
    displayCurrentWeather(data);
  } catch (error) {
    console.error('Error fetching current weather:', error);
    currentWeatherEl.innerHTML = '<p>Weather data is currently unavailable.</p>';
  }
};

const displayCurrentWeather = (data) => {
  const temp = Math.round(data.main.temp);
  const description = data.weather[0].description;
  const icon = data.weather[0].icon;

  currentWeatherEl.innerHTML = `
    <img src="https://openweathermap.org/img/wn/${icon}@2x.png" alt="${description}" width="60" height="60">
    <p class="current-temp">${temp}&deg;C</p>
    <p class="current-desc">${description}</p>
  `;
};

// ===== 3-day forecast =====
const getForecast = async () => {
  try {
    const response = await fetch(forecastUrl);
    if (!response.ok) throw Error(await response.text());
    const data = await response.json();
    displayForecast(data.list);
  } catch (error) {
    console.error('Error fetching forecast:', error);
    forecastEl.innerHTML = '<p>Forecast data is currently unavailable.</p>';
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

// ===== Member spotlights =====
const spotlightUrl = 'data/members.json';
const spotlightEl = document.querySelector('#spotlight-cards');

const tierLabels = {
  1: 'Member',
  2: 'Silver',
  3: 'Gold'
};

const getSpotlightMembers = async () => {
  try {
    const response = await fetch(spotlightUrl);
    const data = await response.json();
    const eligible = data.members.filter((member) => member.membershipLevel === 2 || member.membershipLevel === 3);
    const shuffled = eligible.sort(() => 0.5 - Math.random());
    const count = Math.random() < 0.5 ? 2 : 3;
    const selected = shuffled.slice(0, count);
    displaySpotlights(selected);
  } catch (error) {
    console.error('Error fetching spotlight members:', error);
  }
};

const displaySpotlights = (members) => {
  members.forEach((member) => {
    const card = document.createElement('section');
    card.classList.add('spotlight-card');

    const logo = document.createElement('img');
    logo.setAttribute('src', `images/${member.image}`);
    logo.setAttribute('alt', `${member.name} logo`);
    logo.setAttribute('loading', 'lazy');
    logo.setAttribute('width', '160');
    logo.setAttribute('height', '116');

    const name = document.createElement('h3');
    name.textContent = member.name;

    const tierBadge = document.createElement('span');
    tierBadge.classList.add('tier-badge');
    tierBadge.textContent = tierLabels[member.membershipLevel];

    const phone = document.createElement('p');
    phone.textContent = member.phone;

    const address = document.createElement('p');
    address.textContent = member.address;

    const site = document.createElement('a');
    site.classList.add('visit-site');
    site.setAttribute('href', member.url);
    site.setAttribute('target', '_blank');
    site.setAttribute('rel', 'noopener noreferrer');
    site.textContent = `Visit ${member.name}`;

    card.appendChild(logo);
    card.appendChild(name);
    card.appendChild(tierBadge);
    card.appendChild(phone);
    card.appendChild(address);
    card.appendChild(site);

    spotlightEl.appendChild(card);
  });
};

// ===== Mobile nav toggle (shared behavior with directory page) =====
const menuToggle = document.querySelector('#menu-toggle');
const primaryNav = document.querySelector('#primary-nav');

menuToggle.addEventListener('click', () => {
  const isOpen = primaryNav.classList.toggle('open');
  menuToggle.setAttribute('aria-expanded', isOpen);
});

// ===== Footer: year and last modified =====
document.querySelector('#year').textContent = new Date().getFullYear();
document.querySelector('#last-modified').textContent = document.lastModified;

// ===== Init =====
getCurrentWeather();
getForecast();
getSpotlightMembers();
