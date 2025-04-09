document.addEventListener('DOMContentLoaded', () => {
  const hamburger = document.querySelector('.hamburger');
  const navLinks = document.querySelector('.nav-links');
  const links = document.querySelectorAll('.nav-links li');

  hamburger.addEventListener('click', () => {
    // Toggle Nav
    navLinks.classList.toggle('active');
    // Toggle Hamburger Animation
    hamburger.classList.toggle('active');
  });

  // Close menu when clicking on a link
  links.forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('active');
      hamburger.classList.remove('active');
    });
  });
});