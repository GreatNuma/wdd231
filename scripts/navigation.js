const menuButton = document.querySelector('#menu');
const navMenu = document.querySelector('#nav-menu');

menuButton.addEventListener('click', () => {
    navMenu.classList.toggle('open');
    menuButton.classList.toggle('open');
    // Change icon based on state
    menuButton.textContent = navMenu.classList.contains('open') ? '✖' : '☰';
});