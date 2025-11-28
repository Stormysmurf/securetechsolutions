// Shared JS for site: slideshow, header scroll, service buttons, WhatsApp loader
(function(){
  // Header scroll effect
  function onScrollHeader(){
    const header = document.getElementById('header');
    if(!header) return;
    if(window.scrollY > 50) header.classList.add('scrolled'); 
    else header.classList.remove('scrolled');
  }
  
  window.addEventListener('scroll', onScrollHeader);
  
  document.addEventListener('DOMContentLoaded', ()=>{
    onScrollHeader();

    // Slideshow (simple auto-rotate if slides present)
    const slides = document.querySelectorAll('.slide');
    if(slides && slides.length){
      let current = 0;
      
      function show(i){ 
        slides.forEach((s,idx)=> s.classList.toggle('active', idx===i)); 
      }
      
      function next(){ 
        current = (current+1)%slides.length; 
        show(current); 
      }
      
      // if nav exists, wire it
      const left = document.querySelector('.slide-nav.left');
      const right = document.querySelector('.slide-nav.right');
      
      if(left) left.addEventListener('click', ()=>{ 
        current = (current-1+slides.length)%slides.length; 
        show(current); 
      });
      
      if(right) right.addEventListener('click', ()=>{ 
        current = (current+1)%slides.length; 
        show(current); 
      });
      
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
        const a = document.createElement('a'); 
        a.href = waLink; 
        a.target = '_blank'; 
        a.rel = 'noopener noreferrer';
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
            const img = document.createElement('img'); 
            img.src = 'assets/whatsapp.webp'; 
            img.alt = 'WhatsApp'; 
            img.style.width='60px'; 
            img.style.height='60px'; 
            img.style.borderRadius='50%';
            a.appendChild(img); 
            container.appendChild(a); 
            return;
          }
          const path = list[idx];
          const img = new Image();
          img.onload = function(){ 
            img.alt='WhatsApp'; 
            img.style.width='60px'; 
            img.style.height='60px'; 
            img.style.borderRadius='50%'; 
            a.appendChild(img); 
            container.appendChild(a); 
          };
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
              const anim = lottie.loadAnimation({
                container: container,
                renderer: 'svg',
                loop: true,
                autoplay: true,
                path: jsonPath
              });
              window._whatsappLottie = anim;
              console.info('WhatsApp Lottie loaded', jsonPath);
              container.style.cursor='pointer';
              container.addEventListener('click', ()=> window.open(waLink,'_blank'));
              return;
            }catch(e){ 
              console.warn('Lottie load failed', e); 
              renderFallbackInside(); 
              return; 
            }
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

    // Tiny Lottie Phone Animation
    (function(){
      const phoneContainer = document.getElementById('phone-animation');
      if(!phoneContainer) {
        console.warn('Phone animation container not found');
        return;
      }
      
      const phoneJsonPath = 'assets/phone.json';
      
      // Wait for Lottie to be available, then try to load phone animation
      (function waitForLottiePhone(){
        if(window.lottie){
          try{
            const phoneAnim = lottie.loadAnimation({
              container: phoneContainer,
              renderer: 'svg',
              loop: true,
              autoplay: true,
              path: phoneJsonPath
            });
            console.info('Phone Lottie loaded successfully');
            
            // Make phone animation clickable
            phoneContainer.style.cursor = 'pointer';
            phoneContainer.addEventListener('click', () => {
              window.location.href = 'tel:+254113301244';
            });
          }catch(e){
            console.warn('Phone Lottie load failed:', e);
            // Fallback to emoji
            phoneContainer.innerHTML = '📞';
            phoneContainer.style.fontSize = '24px';
            phoneContainer.style.textAlign = 'center';
            phoneContainer.style.lineHeight = '32px';
          }
        } else if(window._lottieWaitCount < 50){
          window._lottieWaitCount = (window._lottieWaitCount || 0) + 1;
          setTimeout(waitForLottiePhone, 100);
        } else {
          console.warn('Lottie library not available for phone animation');
          // Fallback to emoji
          phoneContainer.innerHTML = '📞';
          phoneContainer.style.fontSize = '24px';
          phoneContainer.style.textAlign = 'center';
          phoneContainer.style.lineHeight = '32px';
        }
      })();
    })();

    // Biometric fingerprint Lottie background for home biometric card
    (function(){
      const bioContainer = document.getElementById('biometric-lottie');
      if(!bioContainer){ console.info('Biometric lottie container not present'); return; }

      const bioJsonPath = encodeURI('assets/Fingerprint biometric scan.json');

      (function waitForLottieBio(){
        if(window.lottie){
          try{
            const anim = lottie.loadAnimation({
              container: bioContainer,
              renderer: 'svg',
              loop: true,
              autoplay: true,
              path: bioJsonPath
            });
            // make sure it's non-interactive and sits behind content
            bioContainer.style.pointerEvents = 'none';
            bioContainer.style.opacity = bioContainer.style.opacity || '0.12';
            window._biometricLottie = anim;
            console.info('Biometric Lottie loaded', bioJsonPath);
          }catch(e){
            console.warn('Biometric Lottie load failed:', e);
            // Fallback: show an inline fingerprint SVG (instead of emoji)
            try{
              bioContainer.innerHTML = `<!-- fingerprint fallback -->
                <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                  <path fill="currentColor" d="M12 2a7 7 0 0 0-7 7v1a1 1 0 0 1-2 0V9a9 9 0 1 1 18 0v1a1 1 0 0 1-2 0V9a7 7 0 0 0-7-7z" opacity="0.9"/>
                  <path fill="currentColor" d="M12 6a5 5 0 0 0-5 5v1a3 3 0 0 1-6 0v-1a9 9 0 1 1 18 0v1a3 3 0 0 1-6 0v-1a5 5 0 0 0-5-5z" opacity="0.7"/>
                </svg>`;
              const svg = bioContainer.querySelector('svg');
              if(svg){ svg.style.width='48px'; svg.style.height='48px'; svg.style.color='#ffffff'; svg.style.opacity='0.95'; }
            }catch(inner){
              bioContainer.innerHTML = '';
            }
          }
        } else if(window._lottieWaitCount < 50){
          window._lottieWaitCount = (window._lottieWaitCount || 0) + 1;
          setTimeout(waitForLottieBio, 100);
        } else {
          console.warn('Lottie library not available for biometric animation');
          // fallback: small svg icon
          try{
            bioContainer.innerHTML = `<!-- fingerprint fallback -->
              <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                <path fill="currentColor" d="M12 2a7 7 0 0 0-7 7v1a1 1 0 0 1-2 0V9a9 9 0 1 1 18 0v1a1 1 0 0 1-2 0V9a7 7 0 0 0-7-7z" opacity="0.9"/>
                <path fill="currentColor" d="M12 6a5 5 0 0 0-5 5v1a3 3 0 0 1-6 0v-1a9 9 0 1 1 18 0v1a3 3 0 0 1-6 0v-1a5 5 0 0 0-5-5z" opacity="0.7"/>
              </svg>`;
            const svg = bioContainer.querySelector('svg');
            if(svg){ svg.style.width='48px'; svg.style.height='48px'; svg.style.color='#ffffff'; svg.style.opacity='0.95'; }
          }catch(e){ /* ignore */ }
        }
      })();
    })();

  });
})();

// Additional slideshow controls (kept for compatibility)
let currentSlide = 0;
const slides = document.querySelectorAll('.slide');
let slideInterval;

function showSlide(index) {
  if (!slides || slides.length === 0) return;
  
  slides.forEach((slide, i) => {
    slide.classList.toggle('active', i === index);
  });
}

function nextSlide() {
  if (!slides || slides.length === 0) return;
  currentSlide = (currentSlide + 1) % slides.length;
  showSlide(currentSlide);
}

function prevSlide() {
  if (!slides || slides.length === 0) return;
  currentSlide = (currentSlide - 1 + slides.length) % slides.length;
  showSlide(currentSlide);
}

function startSlideshow() {
  if (!slides || slides.length === 0) return;
  slideInterval = setInterval(nextSlide, 3500);
}

function stopSlideshow() {
  if (slideInterval) {
    clearInterval(slideInterval);
  }
}

// Start slideshow
if (document.querySelectorAll('.slide').length > 0) {
  startSlideshow();
}

// Safe slideshow start/stop helpers
function safeQuery(selector){ 
  try{ return document.querySelector(selector); }
  catch(e){ return null; } 
}

const heroSlideshowEl = safeQuery('.hero-slideshow');
if(heroSlideshowEl){
  try{ 
    heroSlideshowEl.addEventListener('mouseenter', stopSlideshow); 
  }catch(e){}
  try{ 
    heroSlideshowEl.addEventListener('mouseleave', startSlideshow); 
  }catch(e){}
}

// Smooth scroll to services
function scrollToServices() {
  const servicesSection = document.getElementById('services');
  if (servicesSection) {
    servicesSection.scrollIntoView({ behavior: 'smooth' });
  }
}

// Ensure slideshow functions only run when slides are present
if(!slides || slides.length === 0){
  // prevent errors if there are no slides
  function startSlideshow(){}
  function stopSlideshow(){}
  function nextSlide(){}
  function prevSlide(){}
  function showSlide(){}
}