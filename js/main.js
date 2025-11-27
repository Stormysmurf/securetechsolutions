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

    // WhatsApp Lottie loader with resilient fallback
    (function(){
      const container = document.getElementById('whatsapp-lottie');
      const waLink = 'https://wa.me/254113301244?text=Hello%2C%20I%20want%20to%20inquire%20about%20your%20services';
      const jsonPath = 'assets/whatsapp.json';

      function renderFallbackInside(){
        if(!container) return;
        container.innerHTML = '';
        const a = document.createElement('a'); a.href = waLink; a.target = '_blank'; a.rel = 'noopener noreferrer';
        a.className = 'whatsapp-fallback';

        // Try common filenames the user may have provided
        const candidates = [
          'assets/whatsapp.webp',
          'assets/whatsapp.png',
          'assets/whatsapp.jpg',
          'assets/whatsapp.jpeg',
          'assets/whatsapp.gif'
        ];

        function tryLoadImage(list, idx){
          if(idx >= list.length){
            // last resort: use built-in webp path (may 404 but keeps structure)
            const img = document.createElement('img'); img.src = 'assets/whatsapp.webp'; img.alt = 'WhatsApp'; img.style.width='60px'; img.style.height='60px'; img.style.borderRadius='50%';
            a.appendChild(img); container.appendChild(a); return;
          }
          const path = list[idx];
          const img = new Image();
          img.onload = function(){ img.alt='WhatsApp'; img.style.width='60px'; img.style.height='60px'; img.style.borderRadius='50%'; a.appendChild(img); container.appendChild(a); };
          img.onerror = function(){ tryLoadImage(list, idx+1); };
          img.src = path;
        }

        tryLoadImage(candidates, 0);
      }

      if(!container){
        // No container: nothing to attach; leave existing .whatsapp-float anchors as-is.
        const existing = document.querySelector('.whatsapp-float');
        if(existing) existing.addEventListener('click', ()=>{});
        return;
      }

      // First check if the JSON exists (cheap HEAD). Then wait briefly for lottie to be available.
      fetch(jsonPath,{method:'HEAD'}).then(res=>{
        if(!res.ok){ renderFallbackInside(); return; }

        // Wait up to 5s for window.lottie to be present (poll every 100ms).
        const start = Date.now();
        const timeout = 5000;
        (function waitForLottie(){
          if(window.lottie){
            try{
              container.innerHTML = '';
              // Keep a reference to the animation to avoid it being GC'd
              const anim = lottie.loadAnimation({container:container,renderer:'svg',loop:true,autoplay:true,path:jsonPath});
              window._whatsappLottie = anim;
              console.info('WhatsApp Lottie loaded', jsonPath);
              container.style.cursor='pointer';
              container.addEventListener('click', ()=> window.open(waLink,'_blank'));
              return;
            }catch(e){ console.warn('Lottie load failed', e); renderFallbackInside(); return; }
          }
          if(Date.now() - start < timeout){
            setTimeout(waitForLottie, 100);
          } else {
            // Lottie never loaded in time — show static fallback
            renderFallbackInside();
          }
        })();
      }).catch(err=>{ renderFallbackInside(); });
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

// Make JS safer: guard missing elements and keep a single WhatsApp Lottie loader
// (A DOMContentLoaded-based loader above handles creating or using `#whatsapp-lottie`.)

// Safe slideshow start/stop helpers
function safeQuery(selector){ try{ return document.querySelector(selector); }catch(e){ return null; } }
const heroSlideshowEl = safeQuery('.hero-slideshow');
if(heroSlideshowEl){
  try{ heroSlideshowEl.addEventListener('mouseenter', stopSlideshow); }catch(e){}
  try{ heroSlideshowEl.addEventListener('mouseleave', startSlideshow); }catch(e){}
}

// Ensure slideshow functions only run when slides are present
if(!slides || slides.length === 0){
  // prevent errors if there are no slides
  function startSlideshow(){}
  function stopSlideshow(){}
}

// Tiny Lottie Phone Animation
lottie.loadAnimation({
  container: document.getElementById('phone-animation'),
  renderer: 'svg',
  loop: true,
  autoplay: true,
  path: 'assets/animations/phone.json' // adjust to your path
});