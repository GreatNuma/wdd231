import { initNavToggle, setYear, getPrefs } from "./shared.mjs";
import { applyTranslations } from "./i18n.mjs";

const fieldLabels = {
  fullName: "Full Name",
  email: "Email Address",
  subject: "Subject",
  message: "Message",
  timestamp: "Submitted On"
};

function formatValue(key, value) {
  if (key === "timestamp") {
    return new Date(value).toLocaleString("en-US", { dateStyle: "long", timeStyle: "short" });
  }
  return value;
}

function renderConfirmation() {
  const params = new URLSearchParams(window.location.search);
  const list = document.querySelector("#confirmation-details");
  let hasData = false;

  Object.keys(fieldLabels).forEach((key) => {
    if (params.has(key)) {
      hasData = true;
      const dt = document.createElement("dt");
      dt.textContent = fieldLabels[key];
      const dd = document.createElement("dd");
      dd.textContent = formatValue(key, params.get(key));
      list.appendChild(dt);
      list.appendChild(dd);
    }
  });

  if (!hasData) {
    list.innerHTML = `<p>No message data found. Please use the <a href="contact.html">contact form</a>.</p>`;
  }
}

initNavToggle();
setYear();
applyTranslations(getPrefs().language);
renderConfirmation();
