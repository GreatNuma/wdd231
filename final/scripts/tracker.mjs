import {
  initNavToggle,
  setYear,
  getPrefs,
  savePrefs,
  getActivities,
  saveActivities,
  formatSeconds
} from "./shared.mjs";
import { applyTranslations, languageOptions } from "./i18n.mjs";
import { countries } from "./countries.mjs";
import { randomEncouragement } from "./encouragement.mjs";

const activityForm = document.querySelector("#activity-form");
const activityList = document.querySelector("#activity-list");
const filterType = document.querySelector("#filter-type");
const searchInput = document.querySelector("#search-input");
const clearAllButton = document.querySelector("#clear-all");
const totalCount = document.querySelector("#total-count");
const doneCount = document.querySelector("#done-count");
const openCount = document.querySelector("#open-count");
const progressPercent = document.querySelector("#progress-percent");
const celebrationBanner = document.querySelector("#celebration-banner");
const exportBtn = document.querySelector("#export-btn");
const importFile = document.querySelector("#import-file");

const countrySelect = document.querySelector("#country-select");
const languageSelect = document.querySelector("#language-select");
const savePrefsBtn = document.querySelector("#save-prefs-btn");

const encouragementText = document.querySelector("#encouragement-text");
const refreshEncouragementBtn = document.querySelector("#refresh-encouragement");

const openLibraryBtn = document.querySelector("#open-library-btn");
const libraryModal = document.querySelector("#library-modal");
const libraryList = document.querySelector("#library-list");
const librarySearch = document.querySelector("#library-search");
const closeLibraryBtn = document.querySelector("#close-library-btn");

const timerModal = document.querySelector("#timer-modal");
const timerActivityLabel = document.querySelector("#timer-activity-label");
const timerDisplay = document.querySelector("#timer-display");
const timerStartBtn = document.querySelector("#timer-start-btn");
const timerPauseBtn = document.querySelector("#timer-pause-btn");
const timerResetBtn = document.querySelector("#timer-reset-btn");
const closeTimerBtn = document.querySelector("#close-timer-btn");

let currentPrefs = getPrefs();
let libraryData = null; // cached after first successful fetch
let timerState = { activityId: null, remainingSeconds: 0, intervalId: null, isCountdown: false };

// ===== Activity CRUD =====
function addActivity(event) {
  event.preventDefault();

  const formData = new FormData(activityForm);
  const minutesRaw = formData.get("activity-minutes");

  const activity = {
    id: Date.now(),
    name: formData.get("activity-name").trim(),
    category: formData.get("activity-type"),
    priority: formData.get("activity-priority"),
    minutes: minutesRaw ? Number(minutesRaw) : null,
    note: formData.get("activity-note").trim(),
    completed: false
  };

  const activities = getActivities();
  activities.push(activity);
  saveActivities(activities);
  activityForm.reset();
  renderActivities();
}

function toggleActivity(id) {
  const activities = getActivities().map((activity) =>
    activity.id === id ? { ...activity, completed: !activity.completed } : activity
  );
  saveActivities(activities);
  renderActivities();
}

function deleteActivity(id) {
  const activities = getActivities().filter((activity) => activity.id !== id);
  saveActivities(activities);
  renderActivities();
}

function clearActivities() {
  const activities = getActivities();
  if (activities.length === 0) return;

  if (window.confirm("Clear every activity from your tracker?")) {
    localStorage.removeItem("tamagren-tracker-activities");
    renderActivities();
  }
}

function renderActivities() {
  const activities = getActivities();
  const selectedType = filterType.value;
  const searchTerm = searchInput ? searchInput.value.toLowerCase().trim() : "";

  let visible = selectedType === "all"
    ? activities
    : activities.filter((activity) => activity.category === selectedType);

  if (searchTerm) {
    visible = visible.filter((activity) =>
      activity.name.toLowerCase().includes(searchTerm) ||
      (activity.note && activity.note.toLowerCase().includes(searchTerm))
    );
  }

  activityList.innerHTML = "";

  if (visible.length === 0) {
    activityList.innerHTML = `
      <li class="empty-state">
        <p>Nothing here yet. Add an activity or browse the library.</p>
      </li>
    `;
  } else {
    visible.forEach((activity) => {
      const li = document.createElement("li");
      li.className = `activity-item ${activity.completed ? "completed" : ""}`;
      li.innerHTML = `
        <button class="check-button" type="button" data-action="toggle" data-id="${activity.id}" aria-label="${activity.completed ? `Mark ${activity.name} as open` : `Mark ${activity.name} as complete`}">
          ${activity.completed ? "✓" : ""}
        </button>
        <div class="activity-details">
          <div class="activity-meta">
            <span class="tag">${activity.category}</span>
            <span class="priority priority-${activity.priority}">${activity.priority} priority</span>
            ${activity.minutes ? `<span class="tag">${activity.minutes} min</span>` : ""}
          </div>
          <h3>${activity.name}</h3>
          ${activity.note ? `<p>${activity.note}</p>` : ""}
        </div>
        <div class="activity-actions">
          ${activity.minutes ? `<button class="btn-small" type="button" data-action="timer" data-id="${activity.id}">${document.documentElement.lang === "fr" ? "Minuteur" : "Timer"}</button>` : ""}
          <button class="delete-button" type="button" data-action="delete" data-id="${activity.id}" aria-label="Delete ${activity.name}">Delete</button>
        </div>
      `;
      activityList.appendChild(li);
    });
  }

  updateStats(activities);
}

function updateStats(activities) {
  const total = activities.length;
  const completed = activities.filter((activity) => activity.completed).length;
  const open = total - completed;
  const percentage = total === 0 ? 0 : Math.round((completed / total) * 100);

  totalCount.textContent = `${total}`;
  doneCount.textContent = `${completed}`;
  openCount.textContent = `${open}`;
  progressPercent.textContent = `${percentage}%`;

  if (celebrationBanner) {
    celebrationBanner.hidden = !(total > 0 && open === 0);
  }
}

function handleListClick(event) {
  const actionButton = event.target.closest("button[data-action]");
  if (!actionButton) return;

  const id = Number(actionButton.dataset.id);
  const action = actionButton.dataset.action;

  if (action === "toggle") toggleActivity(id);
  else if (action === "delete") deleteActivity(id);
  else if (action === "timer") openTimerFor(id);
}

// ===== Backup: export / import =====
function exportData() {
  const data = localStorage.getItem("tamagren-tracker-activities") || "[]";
  const blob = new Blob([data], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "tamagren-tracker-backup.json";
  a.click();
  URL.revokeObjectURL(url);
}

function importData(event) {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = (e) => {
    try {
      const parsed = JSON.parse(e.target.result);
      if (Array.isArray(parsed)) {
        saveActivities(parsed);
        renderActivities();
        alert("Data successfully imported!");
      } else {
        alert("Invalid backup file format.");
      }
    } catch (err) {
      alert("Error reading JSON file.");
    }
  };
  reader.readAsText(file);
}

// ===== Preferences: country + language =====
function populatePreferenceSelects() {
  countrySelect.innerHTML = countries
    .map((c) => `<option value="${c.code}">${c.name}</option>`)
    .join("");
  languageSelect.innerHTML = languageOptions
    .map((l) => `<option value="${l.code}">${l.label}</option>`)
    .join("");

  countrySelect.value = currentPrefs.country;
  languageSelect.value = currentPrefs.language;
}

function handleSavePrefs() {
  currentPrefs = {
    country: countrySelect.value,
    language: languageSelect.value
  };
  savePrefs(currentPrefs);
  applyTranslations(currentPrefs.language);
  showEncouragement();
}

// ===== Encouragement =====
function showEncouragement() {
  if (encouragementText) {
    encouragementText.textContent = randomEncouragement(currentPrefs.language);
  }
}

// ===== Activity Library (Fetch API + try/catch) =====
async function fetchLibrary() {
  if (libraryData) return libraryData;

  try {
    const response = await fetch("data/activities.json");
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    libraryData = await response.json();
    return libraryData;
  } catch (error) {
    console.error("Could not load the activity library:", error);
    libraryList.innerHTML = `<li class="empty-state"><p>Could not load the library right now. Please try again.</p></li>`;
    return [];
  }
}

function renderLibrary(items) {
  if (items.length === 0) {
    libraryList.innerHTML = `<li class="empty-state"><p>No matching activities found.</p></li>`;
    return;
  }

  libraryList.innerHTML = items
    .map(
      (item) => `
      <li class="activity-item">
        <div class="activity-details">
          <div class="activity-meta">
            <span class="tag">${item.category}</span>
            <span class="tag">${item.minutes} min</span>
            <span class="tag">${item.difficulty}</span>
          </div>
          <h3>${item.name}</h3>
          <p>${item.description}</p>
        </div>
        <button class="btn-small" type="button" data-add-id="${item.id}">Add to Tracker</button>
      </li>
    `
    )
    .join("");
}

async function openLibrary() {
  libraryModal.showModal();
  const items = await fetchLibrary();
  renderLibrary(items);
}

function handleLibrarySearch() {
  if (!libraryData) return;
  const term = librarySearch.value.toLowerCase().trim();
  const filtered = term
    ? libraryData.filter(
        (item) =>
          item.name.toLowerCase().includes(term) || item.category.toLowerCase().includes(term)
      )
    : libraryData;
  renderLibrary(filtered);
}

function handleLibraryClick(event) {
  const addBtn = event.target.closest("button[data-add-id]");
  if (!addBtn || !libraryData) return;

  const item = libraryData.find((entry) => entry.id === addBtn.dataset.addId);
  if (!item) return;

  const activities = getActivities();
  activities.push({
    id: Date.now(),
    name: item.name,
    category: item.category,
    priority: "normal",
    minutes: item.minutes,
    note: item.description,
    completed: false
  });
  saveActivities(activities);
  renderActivities();

  addBtn.textContent = "Added!";
  addBtn.disabled = true;
}

// ===== Timer modal =====
function openTimerFor(id) {
  const activity = getActivities().find((a) => a.id === id);
  if (!activity) return;

  resetTimerState();
  timerState.activityId = id;
  timerState.isCountdown = Boolean(activity.minutes);
  timerState.remainingSeconds = activity.minutes ? activity.minutes * 60 : 0;

  timerActivityLabel.textContent = activity.name;
  timerDisplay.textContent = formatSeconds(timerState.remainingSeconds);
  timerModal.showModal();
}

function tickTimer() {
  if (timerState.isCountdown) {
    timerState.remainingSeconds -= 1;
    if (timerState.remainingSeconds <= 0) {
      timerState.remainingSeconds = 0;
      timerDisplay.textContent = formatSeconds(0);
      stopTimerInterval();
      timerActivityLabel.textContent = `Done! ${randomEncouragement(currentPrefs.language)}`;
      return;
    }
  } else {
    timerState.remainingSeconds += 1;
  }
  timerDisplay.textContent = formatSeconds(timerState.remainingSeconds);
}

function startTimer() {
  if (timerState.intervalId) return;
  timerState.intervalId = setInterval(tickTimer, 1000);
}

function pauseTimer() {
  stopTimerInterval();
}

function stopTimerInterval() {
  if (timerState.intervalId) {
    clearInterval(timerState.intervalId);
    timerState.intervalId = null;
  }
}

function resetTimerState() {
  stopTimerInterval();
  timerState = { activityId: null, remainingSeconds: 0, intervalId: null, isCountdown: false };
}

function resetTimerDisplay() {
  const activity = getActivities().find((a) => a.id === timerState.activityId);
  stopTimerInterval();
  timerState.remainingSeconds = activity && activity.minutes ? activity.minutes * 60 : 0;
  timerDisplay.textContent = formatSeconds(timerState.remainingSeconds);
}

// ===== Init =====
function init() {
  initNavToggle();
  setYear();
  applyTranslations(currentPrefs.language);
  populatePreferenceSelects();
  showEncouragement();

  if (!localStorage.getItem("tamagren-tracker-activities")) {
    saveActivities([]);
  }

  activityForm.addEventListener("submit", addActivity);
  activityList.addEventListener("click", handleListClick);
  filterType.addEventListener("change", renderActivities);
  if (searchInput) searchInput.addEventListener("input", renderActivities);
  clearAllButton.addEventListener("click", clearActivities);
  if (exportBtn) exportBtn.addEventListener("click", exportData);
  if (importFile) importFile.addEventListener("change", importData);

  savePrefsBtn.addEventListener("click", handleSavePrefs);
  if (refreshEncouragementBtn) refreshEncouragementBtn.addEventListener("click", showEncouragement);

  openLibraryBtn.addEventListener("click", openLibrary);
  closeLibraryBtn.addEventListener("click", () => libraryModal.close());
  librarySearch.addEventListener("input", handleLibrarySearch);
  libraryList.addEventListener("click", handleLibraryClick);

  timerStartBtn.addEventListener("click", startTimer);
  timerPauseBtn.addEventListener("click", pauseTimer);
  timerResetBtn.addEventListener("click", resetTimerDisplay);
  closeTimerBtn.addEventListener("click", () => {
    stopTimerInterval();
    timerModal.close();
  });

  renderActivities();
}

init();
