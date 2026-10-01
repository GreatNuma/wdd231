// ===== Timestamp: record when the form was loaded =====
const timestampField = document.querySelector('#timestamp');
timestampField.value = new Date().toISOString();

// ===== Membership modals =====
const learnMoreLinks = document.querySelectorAll('.learn-more');

learnMoreLinks.forEach((link) => {
  link.addEventListener('click', (event) => {
    event.preventDefault();
    const modalId = link.getAttribute('data-modal');
    const modal = document.querySelector(`#${modalId}`);
    modal.showModal();
  });
});

const closeButtons = document.querySelectorAll('.modal-close');

closeButtons.forEach((button) => {
  button.addEventListener('click', () => {
    const modal = button.closest('dialog');
    modal.close();
  });
});

// Close modal when clicking outside its content (on the ::backdrop area)
const modals = document.querySelectorAll('.membership-modal');

modals.forEach((modal) => {
  modal.addEventListener('click', (event) => {
    const rect = modal.getBoundingClientRect();
    const clickedInside =
      event.clientX >= rect.left &&
      event.clientX <= rect.right &&
      event.clientY >= rect.top &&
      event.clientY <= rect.bottom;

    if (!clickedInside) {
      modal.close();
    }
  });
});

// ===== Mobile nav toggle (shared behavior across pages) =====
const menuToggle = document.querySelector('#menu-toggle');
const primaryNav = document.querySelector('#primary-nav');

menuToggle.addEventListener('click', () => {
  const isOpen = primaryNav.classList.toggle('open');
  menuToggle.setAttribute('aria-expanded', isOpen);
});

// ===== Footer: year and last modified =====
document.querySelector('#year').textContent = new Date().getFullYear();
document.querySelector('#last-modified').textContent = document.lastModified;
