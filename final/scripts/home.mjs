import { initNavToggle, setYear, getPrefs, getActivities, initVisitBanner } from "./shared.mjs";
import { applyTranslations } from "./i18n.mjs";
import { randomEncouragement } from "./encouragement.mjs";

function updateHeroSummary() {
  const heroCount = document.querySelector("#hero-count");
  const heroFocus = document.querySelector("#hero-focus");
  if (!heroCount || !heroFocus) return;

  const activities = getActivities();
  const nextActivity = activities.find((activity) => !activity.completed);

  heroCount.textContent = `${activities.length}`;
  heroFocus.textContent = nextActivity
    ? `${nextActivity.name}${nextActivity.category ? ` (${nextActivity.category})` : ""}`
    : "Add your first activity to get started.";
}

function init() {
  initNavToggle();
  setYear();

  const { language } = getPrefs();
  applyTranslations(language);

  initVisitBanner(document.querySelector("#visit-banner"));
  updateHeroSummary();

  const encouragementText = document.querySelector("#encouragement-text");
  if (encouragementText) {
    encouragementText.textContent = randomEncouragement(language);
  }
}

init();
