const url = 'data/members.json';
const directory = document.querySelector('#directory');

const tierLabels = {
  1: 'Member',
  2: 'Silver',
  3: 'Gold'
};

const getMemberData = async () => {
  try {
    const response = await fetch(url);
    const data = await response.json();
    displayMembers(data.members);
  } catch (error) {
    console.error('Error fetching member data:', error);
  }
};

const displayMembers = (members) => {
  members.forEach((member) => {
    const card = document.createElement('section');
    card.classList.add('member-card', `tier-${member.membershipLevel}`);

    const name = document.createElement('h2');
    name.textContent = member.name;

    const logo = document.createElement('img');
    logo.setAttribute('src', `images/${member.image}`);
    logo.setAttribute('alt', `${member.name} logo`);
    logo.setAttribute('loading', 'lazy');
    logo.setAttribute('width', '220');
    logo.setAttribute('height', '160');

    const category = document.createElement('p');
    category.textContent = member.category;

    const address = document.createElement('p');
    address.textContent = member.address;

    const phone = document.createElement('p');
    phone.textContent = member.phone;

    const site = document.createElement('a');
    site.classList.add('visit-site');
    site.setAttribute('href', member.url);
    site.setAttribute('target', '_blank');
    site.setAttribute('rel', 'noopener noreferrer');
    site.textContent = `Visit ${member.name}`;

    const tierBadge = document.createElement('span');
    tierBadge.classList.add('tier-badge');
    tierBadge.textContent = tierLabels[member.membershipLevel];

    card.appendChild(name);
    card.appendChild(logo);
    card.appendChild(category);
    card.appendChild(address);
    card.appendChild(phone);
    card.appendChild(tierBadge);
    card.appendChild(site);

    directory.appendChild(card);
  });
};

// ===== Grid / List view toggle =====
const gridBtn = document.querySelector('#grid-view');
const listBtn = document.querySelector('#list-view');

gridBtn.addEventListener('click', () => {
  directory.classList.remove('list-layout');
  directory.classList.add('grid-layout');
  gridBtn.classList.add('active');
  gridBtn.setAttribute('aria-pressed', 'true');
  listBtn.classList.remove('active');
  listBtn.setAttribute('aria-pressed', 'false');
});

listBtn.addEventListener('click', () => {
  directory.classList.remove('grid-layout');
  directory.classList.add('list-layout');
  listBtn.classList.add('active');
  listBtn.setAttribute('aria-pressed', 'true');
  gridBtn.classList.remove('active');
  gridBtn.setAttribute('aria-pressed', 'false');
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

// ===== Init =====
getMemberData();
