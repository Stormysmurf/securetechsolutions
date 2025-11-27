// Header scroll effect
window.addEventListener('scroll', () => {
  const header = document.getElementById('header');
  if (window.scrollY > 50) {
    header.classList.add('scrolled');
  } else {
    header.classList.remove('scrolled');
  }
});

// Slideshow
let currentSlide = 0;
const slides = document.querySelectorAll('.slide');
let slideInterval;

function showSlide(index) {
  slides.forEach((slide, i) => {
    slide.classList.toggle('active', i === index);
  });
}

function nextSlide() {
  currentSlide = (currentSlide + 1) % slides.length;
  showSlide(currentSlide);
}

function prevSlide() {
  currentSlide = (currentSlide - 1 + slides.length) % slides.length;
  showSlide(currentSlide);
}

function startSlideshow() {
  slideInterval = setInterval(nextSlide, 3500);
}

function stopSlideshow() {
  clearInterval(slideInterval);
}

// Start slideshow
startSlideshow();

// Pause on hover
document.querySelector('.hero-slideshow').addEventListener('mouseenter', stopSlideshow);
document.querySelector('.hero-slideshow').addEventListener('mouseleave', startSlideshow);

// Smooth scroll to services
function scrollToServices() {
  document.getElementById('services').scrollIntoView({ behavior: 'smooth' });
}