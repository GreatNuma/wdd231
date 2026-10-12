export const translations = {
  en: {
    nav: { home: "Home", tracker: "Tracker", resources: "Resources", contact: "Contact", references: "References" },
    tracker: { heading: "Your Activity Tracker", libraryButton: "Browse Activity Library", startTimer: "Start Timer" }
  },
  fr: {
    nav: { home: "Accueil", tracker: "Suivi", resources: "Ressources", contact: "Contact", references: "Références" },
    tracker: { heading: "Votre suivi d'activités", libraryButton: "Parcourir la bibliothèque", startTimer: "Démarrer le minuteur" }
  },
  es: {
    nav: { home: "Inicio", tracker: "Seguimiento", resources: "Recursos", contact: "Contacto", references: "Referencias" },
    tracker: { heading: "Tu seguimiento de actividades", libraryButton: "Explorar biblioteca", startTimer: "Iniciar temporizador" }
  },
  yo: {
    nav: { home: "Ile", tracker: "Atọpa", resources: "Awọn Ọrọ", contact: "Kan si", references: "Awọn Itọkasi" },
    tracker: { heading: "Atọpa Iṣẹ́ Rẹ", libraryButton: "Wo Ibi Ìkówèésí", startTimer: "Bẹ̀rẹ̀ Aago" }
  }
};

export const languageOptions = [
  { code: "en", label: "English" },
  { code: "fr", label: "Français" },
  { code: "es", label: "Español" },
  { code: "yo", label: "Yorùbá" }
];

export function applyTranslations(lang) {
  const dict = translations[lang] || translations.en;
  document.documentElement.setAttribute("lang", lang);

  document.querySelectorAll("[data-i18n]").forEach((el) => {
    const keyPath = el.dataset.i18n.split(".");
    const value = keyPath.reduce((obj, part) => (obj ? obj[part] : undefined), dict);
    if (value) {
      el.textContent = value;
    }
  });
}
