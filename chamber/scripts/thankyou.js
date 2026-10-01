// Only the fields marked "required" on the join form are displayed here,
// per the assignment: first name, last name, email, mobile number, business name, timestamp.
const fieldLabels = {
  firstName: 'First Name',
  lastName: 'Last Name',
  email: 'Email Address',
  mobilePhone: 'Mobile Phone Number',
  orgName: 'Business/Organization Name',
  timestamp: 'Submitted On'
};

const params = new URLSearchParams(window.location.search);
const detailsList = document.querySelector('#confirmation-details');

const formatValue = (key, value) => {
  if (key === 'timestamp') {
    const date = new Date(value);
    return date.toLocaleString('en-US', {
      dateStyle: 'long',
      timeStyle: 'short'
    });
  }
  return value;
};

const requiredKeys = Object.keys(fieldLabels);
let hasData = false;

requiredKeys.forEach((key) => {
  if (params.has(key)) {
    hasData = true;
    const dt = document.createElement('dt');
    dt.textContent = fieldLabels[key];

    const dd = document.createElement('dd');
    dd.textContent = formatValue(key, params.get(key));

    detailsList.appendChild(dt);
    detailsList.appendChild(dd);
  }
});

if (!hasData) {
  detailsList.innerHTML = '<p>No application data was found. Please fill out the <a href="join.html">join form</a> first.</p>';
}

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
