export const encouragement = {
  en: [
    "Small steps still move you forward.",
    "You showed up today — that counts.",
    "Progress, not perfection.",
    "One activity at a time. You've got this.",
    "Consistency beats intensity. Keep going.",
    "Future you will thank you for this.",
    "Every habit starts with one rep.",
    "You're building something that lasts."
  ],
  fr: [
    "Chaque petit pas compte.",
    "Vous êtes venu aujourd'hui, c'est déjà beaucoup.",
    "Progrès, pas perfection.",
    "Une activité à la fois. Vous pouvez le faire.",
    "La régularité bat l'intensité.",
    "Le futur vous remerciera.",
    "Chaque habitude commence par une répétition."
  ],
  es: [
    "Cada pequeño paso cuenta.",
    "Hoy te presentaste, y eso importa.",
    "Progreso, no perfección.",
    "Una actividad a la vez. Tú puedes.",
    "La constancia vence a la intensidad.",
    "Tu yo futuro te lo agradecerá.",
    "Cada hábito comienza con una repetición."
  ],
  yo: [
    "Ìgbésẹ̀ kékeré ṣì ń gbé ọ síwájú.",
    "O farahàn lónìí — ìyẹn kó jọ́rẹ́.",
    "Ìtẹ̀síwájú, kì í ṣe pípé.",
    "Iṣẹ́ kan ní àkókò kan. O lè ṣe é.",
    "Ìduróṣinṣin ṣẹ́gun kíkanra."
  ]
};

export function randomEncouragement(lang = "en") {
  const list = encouragement[lang] || encouragement.en;
  return list[Math.floor(Math.random() * list.length)];
}
