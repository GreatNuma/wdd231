export const STORAGE_KEYS = {
  activities: "tamagren-tracker-activities",
  prefs: "tamagren-tracker-prefs",
  lastVisit: "tamagren-tracker-last-visit"
};

export function initNavToggle() {
  const toggle = document.querySelector(".nav-toggle");
  const nav = document.querySelector("#primary-nav");
  if (!toggle || !nav) return;

  toggle.addEventListener("click", () => {
    const isOpen = toggle.getAttribute("aria-expanded") === "true";
    toggle.setAttribute("aria-expanded", String(!isOpen));
    nav.classList.toggle("open", !isOpen);
  });
}

export function setYear() {
  const el = document.querySelector("#year");
  if (el) el.textContent = new Date().getFullYear();
}

export function getPrefs() {
  return JSON.parse(localStorage.getItem(STORAGE_KEYS.prefs)) || { country: "NG", language: "en" };
}

export function savePrefs(prefs) {
  localStorage.setItem(STORAGE_KEYS.prefs, JSON.stringify(prefs));
}

export function getActivities() {
  return JSON.parse(localStorage.getItem(STORAGE_KEYS.activities)) || [];
}

export function saveActivities(activities) {
  localStorage.setItem(STORAGE_KEYS.activities, JSON.stringify(activities));
}

export function initVisitBanner(el) {
  if (!el) return;
  const now = Date.now();
  const last = localStorage.getItem(STORAGE_KEYS.lastVisit);
  let message = "Welcome! Let's build a habit today.";

  if (last) {
    const days = Math.floor((now - Number(last)) / 86400000);
    if (days === 0) {
      message = "Welcome back! Great to see you again today.";
    } else if (days === 1) {
      message = "Back after a day away — keep the streak alive!";
    } else if (days > 1) {
      message = `It's been ${days} days since your last visit — welcome back!`;
    }
  }

  el.textContent = message;
  localStorage.setItem(STORAGE_KEYS.lastVisit, String(now));
}

export function formatSeconds(totalSeconds) {
  const minutes = Math.floor(totalSeconds / 60).toString().padStart(2, "0");
  const seconds = Math.floor(totalSeconds % 60).toString().padStart(2, "0");
  return `${minutes}:${seconds}`;
}
