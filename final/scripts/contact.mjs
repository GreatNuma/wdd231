import { initNavToggle, setYear, getPrefs } from "./shared.mjs";
import { applyTranslations } from "./i18n.mjs";

document.querySelector("#timestamp").value = new Date().toISOString();

initNavToggle();
setYear();
applyTranslations(getPrefs().language);
