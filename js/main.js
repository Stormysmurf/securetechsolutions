// Shared JS for site: slideshow, header scroll, service buttons, WhatsApp loader
(function(){
  // Header scroll effect
  function onScrollHeader(){
    const header = document.getElementById('header');
    if(!header) return;
    if(window.scrollY > 50) header.classList.add('scrolled'); else header.classList.remove('scrolled');
  }
  window.addEventListener('scroll', onScrollHeader);
  document.addEventListener('DOMContentLoaded', ()=>{
    onScrollHeader();

    // Slideshow (simple auto-rotate if slides present)
    const slides = document.querySelectorAll('.slide');
    if(slides && slides.length){
      let current = 0;
      function show(i){ slides.forEach((s,idx)=> s.classList.toggle('active', idx===i)); }
      function next(){ current = (current+1)%slides.length; show(current); }
      // if nav exists, wire it
      const left = document.querySelector('.slide-nav.left');
      const right = document.querySelector('.slide-nav.right');
      if(left) left.addEventListener('click', ()=>{ current = (current-1+slides.length)%slides.length; show(current); });
      if(right) right.addEventListener('click', ()=>{ current = (current+1)%slides.length; show(current); });
      show(current);
      setInterval(next, 5000);
    }

    // Service buttons navigation (data-target or fallback to location.href if existing onclick)
    document.querySelectorAll('.service-btn').forEach(btn => {
      btn.addEventListener('click', e=>{
        const target = btn.getAttribute('data-target');
        if(target) return location.href = target;
        // fallback: leave onclick that may already be present
      });
    });

    // WhatsApp Lottie loader with fallback
    (function(){
      const container = document.getElementById('whatsapp-lottie');
      const waLink = 'https://wa.me/254113301244?text=Hello%2C%20I%20want%20to%20inquire%20about%20your%20services';
      const jsonPath = 'assets/whatsapp.json';
      function renderFallback(){
        const a = document.createElement('a'); a.href = waLink; a.target = '_blank'; a.rel = 'noopener noreferrer';
        const img = document.createElement('img'); img.src = 'assets/whatsapp.webp'; img.alt = 'WhatsApp'; img.style.width='80px'; img.style.height='80px'; img.style.borderRadius='50%';
        a.appendChild(img); if(container) container.replaceWith(a);
      }
      if(!container){
        // If no container, try to ensure a whatsapp-float anchor exists
        const existing = document.querySelector('.whatsapp-float');
        if(existing) existing.addEventListener('click', ()=>{});
        return;
      }
      fetch(jsonPath,{method:'HEAD'}).then(res=>{
        if(res.ok && window.lottie){
          try{
            lottie.loadAnimation({container:container,renderer:'svg',loop:true,autoplay:true,path:jsonPath});
            container.style.cursor='pointer';
            container.addEventListener('click', ()=> window.open(waLink,'_blank'));
            return;
          }catch(e){ console.warn('Lottie failed',e); renderFallback(); }
        } else renderFallback();
      }).catch(err=>{ renderFallback(); });
    })();
  });
})();
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

// WhatsApp Floating Lottie
(function() {
  // Create container dynamically
  const whatsappContainer = document.createElement('div');
  whatsappContainer.id = 'whatsapp-lottie';
  whatsappContainer.title = 'Chat with us on WhatsApp';
  document.body.appendChild(whatsappContainer);

  // Load Lottie animation
  const whatsappAnim = lottie.loadAnimation({
    container: whatsappContainer,
    renderer: 'svg',
    loop: true,
    autoplay: true,
    path: 'assets/whatsapp.json'
  });

  // Clickable action
  whatsappContainer.addEventListener('click', () => {
    window.open(
      'https://wa.me/254113301244?text=Hello%2C%20I%20want%20to%20inquire%20about%20security%20solutions',
      '_blank'
    );
  });
})();