import { discoverItems } from '../data/discover.mjs';

const gallery = document.querySelector('#discover-gallery');

const displayItems = (items) => {
  items.forEach((item, index) => {
    const card = document.createElement('article');
    card.classList.add('discover-card');
    card.style.gridArea = `c${index + 1}`;

    const title = document.createElement('h2');
    title.textContent = item.name;

    const figure = document.createElement('figure');
    const img = document.createElement('img');
    img.setAttribute('src', item.image);
    img.setAttribute('alt', item.name);
    img.setAttribute('loading', 'lazy');
    img.setAttribute('width', '300');
    img.setAttribute('height', '200');
    figure.appendChild(img);

    const address = document.createElement('address');
    address.textContent = item.address;

    const description = document.createElement('p');
    description.textContent = item.description;

    const learnMoreBtn = document.createElement('button');
    learnMoreBtn.type = 'button';
    learnMoreBtn.textContent = 'Learn More';
    learnMoreBtn.classList.add('learn-more-btn');

    card.appendChild(title);
    card.appendChild(figure);
    card.appendChild(address);
    card.appendChild(description);
    card.appendChild(learnMoreBtn);

    gallery.appendChild(card);
  });
};

displayItems(discoverItems);

// ===== Visit tracking via localStorage =====
const visitMessageEl = document.querySelector('#visit-message');
const visitMessageText = document.querySelector('#visit-message-text');
const visitMessageClose = document.querySelector('#visit-message-close');

const showVisitMessage = () => {
  const lastVisit = localStorage.getItem('lastVisit');
  const now = Date.now();
  let message;

  if (!lastVisit) {
    message = 'Welcome! Let us know if you have any questions.';
  } else {
    const msSinceLastVisit = now - Number(lastVisit);
    const oneDay = 1000 * 60 * 60 * 24;

    if (msSinceLastVisit < oneDay) {
      message = 'Back so soon! Awesome!';
    } else {
      const daysSince = Math.floor(msSinceLastVisit / oneDay);
      const dayWord = daysSince === 1 ? 'day' : 'days';
      message = `You last visited ${daysSince} ${dayWord} ago.`;
    }
  }

  visitMessageText.textContent = message;
  visitMessageEl.hidden = false;

  localStorage.setItem('lastVisit', String(now));
};

showVisitMessage();

visitMessageClose.addEventListener('click', () => {
  visitMessageEl.hidden = true;
});

// ===== Mobile nav toggle =====
const menuToggle = document.querySelector('#menu-toggle');
const primaryNav = document.querySelector('#primary-nav');

menuToggle.addEventListener('click', () => {
  const isOpen = primaryNav.classList.toggle('open');
  menuToggle.setAttribute('aria-expanded', isOpen);
});

// ===== Footer: year and last modified =====
document.querySelector('#year').textContent = new Date().getFullYear();
document.querySelector('#last-modified').textContent = document.lastModified;
