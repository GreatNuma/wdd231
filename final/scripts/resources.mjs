import { initNavToggle, setYear, getPrefs } from "./shared.mjs";
import { applyTranslations } from "./i18n.mjs";

const resourceGrid = document.querySelector("#resource-grid");
const recommendationForm = document.querySelector("#recommendation-form");
const recommendationEl = document.querySelector("#recommendation");

const readingList = [
  { title: "Atomic Habits — Core Ideas", author: "James Clear", note: "The foundational framework behind small, consistent habit changes." },
  { title: "Deep Work Principles", author: "Cal Newport", note: "Why focused, distraction-free work produces outsized results." },
  { title: "The Science of Motivation", author: "Various", note: "Research-backed strategies for staying motivated long-term." },
  { title: "Designing Your Routine", author: "Various", note: "Practical tips for building a daily structure that actually sticks." }
];

let cachedActivities = null;

function renderResourceGrid() {
  resourceGrid.innerHTML = readingList
    .map(
      (item) => `
      <article class="resource-card">
        <p class="number">READING</p>
        <h3>${item.title}</h3>
        <p>${item.note}</p>
      </article>
    `
    )
    .join("");
}

async function fetchActivities() {
  if (cachedActivities) return cachedActivities;

  try {
    const response = await fetch("data/activities.json");
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    cachedActivities = await response.json();
    return cachedActivities;
  } catch (error) {
    console.error("Could not load activities for recommendations:", error);
    return [];
  }
}

async function handleRecommendation(event) {
  event.preventDefault();
  const goal = document.querySelector("#goal").value;
  if (!goal) return;

  const activities = await fetchActivities();
  const matches = activities.filter((activity) => activity.category === goal).slice(0, 3);

  if (matches.length === 0) {
    recommendationEl.innerHTML = `<p>No matches found for that focus area yet.</p>`;
    return;
  }

  recommendationEl.innerHTML = `
    <p>Here are a few activities for <strong>${goal}</strong>:</p>
    <ul>
      ${matches.map((item) => `<li>${item.name} — ${item.minutes} min (${item.difficulty})</li>`).join("")}
    </ul>
    <p><a href="tracker.html">Open your tracker</a> to add any of these from the Activity Library.</p>
  `;
}

function init() {
  initNavToggle();
  setYear();
  applyTranslations(getPrefs().language);
  renderResourceGrid();
  recommendationForm.addEventListener("submit", handleRecommendation);
}

init();
