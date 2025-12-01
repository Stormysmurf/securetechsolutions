(function(){
  function onScrollHeader(){
    const header = document.getElementById('header');
    if(!header) return;
    if(window.scrollY > 50) header.classList.add('scrolled'); 
    else header.classList.remove('scrolled');
  }

  window.addEventListener('scroll', onScrollHeader);

  document.addEventListener('DOMContentLoaded', ()=>{

    onScrollHeader();

    // Slideshow
    const slides = document.querySelectorAll('.slide');
    if(slides && slides.length){
      let current = 0;

      function show(i){ 
        slides.forEach((s,idx)=> s.classList.toggle('active', idx===i)); 
      }

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
      setInterval(()=>{ current=(current+1)%slides.length; show(current); }, 5000);
    }

    // Service buttons navigation
    document.querySelectorAll('.service-btn').forEach(btn=>{
      btn.addEventListener('click', e=>{
        const target = btn.getAttribute('data-target');
        if(target) return location.href = target;
      });
    });

// ===== NEON CARDS INTERACTIVITY =====
(function initNeonCards() {
  const serviceCards = document.querySelectorAll('.service-card');
  
  if (!serviceCards.length) return;
  
  console.log(`🎨 Enhancing ${serviceCards.length} service cards with neon effects`);
  
  // Add CSS animations for neon effects
  if (!document.querySelector('#neon-cards-styles')) {
    const style = document.createElement('style');
    style.id = 'neon-cards-styles';
    style.textContent = `
      .card-ripple-container {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        overflow: hidden;
        border-radius: 16px;
        pointer-events: none;
        z-index: 1;
      }
      
      .card-ripple {
        position: absolute;
        border-radius: 50%;
        background: radial-gradient(circle, rgba(255,20,147,0.6) 0%, rgba(138,43,226,0.4) 70%, transparent 100%);
        transform: translate(-50%, -50%);
        animation: rippleExpand 0.8s ease-out;
        pointer-events: none;
        width: 0;
        height: 0;
      }
      
      @keyframes rippleExpand {
        to {
          width: 300px;
          height: 300px;
          opacity: 0;
        }
      }
      
      .card-pulse {
        animation: cardPulse 0.6s ease;
      }
      
      @keyframes cardPulse {
        0% { transform: scale(1); }
        50% { transform: scale(1.05); }
        100% { transform: scale(1); }
      }
    `;
    document.head.appendChild(style);
  }

  // Initialize each card
  serviceCards.forEach((card, index) => {
    // Add data attribute for identification
    card.setAttribute('data-card-index', index);
    
    // Add ripple effect container
    const rippleContainer = document.createElement('div');
    rippleContainer.className = 'card-ripple-container';
    card.appendChild(rippleContainer);
    
    // Add click effect
    card.addEventListener('click', function(e) {
      if (e.target.classList.contains('service-btn')) return;
      
      // Create ripple effect
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      const ripple = document.createElement('div');
      ripple.className = 'card-ripple';
      ripple.style.left = `${x}px`;
      ripple.style.top = `${y}px`;
      
      rippleContainer.appendChild(ripple);
      setTimeout(() => ripple.remove(), 1000);
      
      // Pulse animation
      card.classList.add('card-pulse');
      setTimeout(() => card.classList.remove('card-pulse'), 600);
      
      // Click the button inside the card
      const button = card.querySelector('.service-btn');
      if (button) {
        setTimeout(() => button.click(), 300);
      }
    });
    
    // Add keyboard navigation
    card.setAttribute('tabindex', '0');
    card.addEventListener('keydown', function(e) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        card.click();
      }
    });
  });
  
  console.log('✅ Neon card enhancements applied');
})();

    // WhatsApp Lottie
    (function(){
      const container = document.getElementById('whatsapp-lottie');
      if(!container) return;

      const waLink = 'https://wa.me/254113301244?text=Hello%2C%20I%20want%20to%20inquire%20about%20your%20services';
      const jsonPath = 'assets/whatsapp.json';

      fetch(jsonPath,{method:'HEAD'}).then(res=>{
        if(!res.ok) return;
        lottie.loadAnimation({
          container: container,
          renderer: 'svg',
          loop: true,
          autoplay: true,
          path: jsonPath
        });
        container.style.cursor='pointer';
        container.addEventListener('click', ()=> window.open(waLink,'_blank'));
      }).catch(err=>{
        container.innerHTML='📞';
      });
    })();

    // Tiny Lottie Phone
    (function(){
      const phoneContainer = document.getElementById('phone-animation');
      if(!phoneContainer) return;

      const phoneJsonPath = 'assets/phone.json';
      try{
        const phoneAnim = lottie.loadAnimation({
          container: phoneContainer,
          renderer: 'svg',
          loop: true,
          autoplay: true,
          path: phoneJsonPath
        });
        phoneContainer.style.cursor='pointer';
        phoneContainer.addEventListener('click', ()=> location.href='tel:+254113301244');
      }catch(e){
        phoneContainer.innerHTML='📞';
      }
    })();

    // face recognition card BIOMETRIC ANIMATIONS
    (function(){
      const container = document.getElementById('biometric-lottie-1');

      if(!container) {
        console.log('ℹ️ biometric-lottie-1 container not found');
        return;
      }

      console.log('🚀 Loading face.json for biometric-lottie-1...');

      fetch('assets/face.json')
        .then(response => {
          console.log('📡 Response status for face.json:', response.status);
          if (!response.ok) {
            throw new Error(`HTTP ${response.status}: face.json not found`);
          }
          return response.json();
        })
        .then(animationData => {
          console.log('✅ face.json loaded successfully for biometric-lottie-1');

          const anim = lottie.loadAnimation({
            container: container,
            renderer: 'svg',
            loop: true,
            autoplay: true,
            animationData: animationData
          });

          anim.addEventListener('DOMLoaded', () => {
            console.log('✅ face.json animation rendered successfully for biometric-lottie-1!');
          });
        })
        .catch(error => {
          console.error('❌ Failed to load face.json for biometric-lottie-1:', error);
        });
    })();

    // CCTV Lottie animation
    (function(){
      const container = document.getElementById('cctv-lottie');

      if(!container) {
        return;
      }

      console.log('🚀 Starting CCTV animation load...');

      fetch('assets/cctv.json')
        .then(response => {
          console.log('📡 CCTV Response status:', response.status);
          if (!response.ok) {
            throw new Error(`HTTP ${response.status}: cctv.json not found`);
          }
          return response.json();
        })
        .then(animationData => {
          console.log('✅ cctv.json loaded successfully');

          const anim = lottie.loadAnimation({
            container: container,
            renderer: 'svg',
            loop: true,
            autoplay: true,
            animationData: animationData
          });

          anim.addEventListener('DOMLoaded', () => {
            console.log('✅ CCTV animation rendered successfully!');
          });
        })
        .catch(error => {
          console.error('❌ Failed to load CCTV animation:', error.message);
        });
    })();

  });
})();

// face recognition card BIOMETRIC ANIMATIONS main page
(function(){
  const container = document.getElementById('biometric-lottie');

  if(!container) {
    console.log('ℹ️ biometric-lottie container not found');
    return;
  }

  console.log('🚀 Loading face.json for biometric-lottie...');

  fetch('assets/face.json')
    .then(response => {
      console.log('📡 Response status for face.json:', response.status);
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: face.json not found`);
      }
      return response.json();
    })
    .then(animationData => {
      console.log('✅ face.json loaded successfully for biometric-lottie');

      const anim = lottie.loadAnimation({
        container: container,
        renderer: 'svg',
        loop: true,
        autoplay: true,
        animationData: animationData
      });

      anim.addEventListener('DOMLoaded', () => {
        console.log('✅ face.json animation rendered successfully for biometric-lottie!');
      });
    })
    .catch(error => {
      console.error('❌ Failed to load face.json for biometric-lottie:', error);
    });
})();

// fingerprint card BIOMETRIC ANIMATIONS
(function(){
  const container = document.getElementById('biometric-lottie-fn');

  if(!container) {
    console.log('ℹ️ biometric-lottie-fn container not found');
    return;
  }

  console.log('🚀 Loading fn.json for biometric-lottie-fn...');

  fetch('assets/fn.json')
    .then(response => {
      console.log('📡 Response status for fn.json:', response.status);
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: fn.json not found`);
      }
      return response.json();
    })
    .then(animationData => {
      console.log('✅ fn.json loaded successfully for biometric-lottie-fn');

      const anim = lottie.loadAnimation({
        container: container,
        renderer: 'svg',
        loop: true,
        autoplay: true,
        animationData: animationData
      });

      anim.addEventListener('DOMLoaded', () => {
        console.log('✅ fn.json animation rendered successfully for biometric-lottie-fn!');
      });
    })
    .catch(error => {
      console.error('❌ Failed to load fn.json for biometric-lottie-fn:', error);
    });
})();

// networking card ANIMATIONS
(function(){
  const container = document.getElementById('net-lottie');

  if(!container) {
    console.log('ℹ️ net-lottie container not found');
    return;
  }

  console.log('🚀 Loading net.json for net-lottie...');

  fetch('assets/net.json')
    .then(response => {
      console.log('📡 Response status for net.json:', response.status);
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: net.json not found`);
      }
      return response.json();
    })
    .then(animationData => {
      console.log('✅ net.json loaded successfully for net-lottie');

      const anim = lottie.loadAnimation({
        container: container,
        renderer: 'svg',
        loop: true,
        autoplay: true,
        animationData: animationData
      });

      anim.addEventListener('DOMLoaded', () => {
        console.log('✅ net.json animation rendered successfully for net-lottie!');
      });
    })
    .catch(error => {
      console.error('❌ Failed to load net.json for net-lottie:', error);
    });
})();

// Slideshow helpers
let currentSlide=0;
const slides=document.querySelectorAll('.slide');
let slideInterval;

function showSlide(index){
  if(!slides || slides.length===0) return;
  slides.forEach((slide,i)=> slide.classList.toggle('active', i===index));
}
function nextSlide(){ if(!slides || slides.length===0) return; currentSlide=(currentSlide+1)%slides.length; showSlide(currentSlide);}
function prevSlide(){ if(!slides || slides.length===0) return; currentSlide=(currentSlide-1+slides.length)%slides.length; showSlide(currentSlide);}
function startSlideshow(){ if(!slides || slides.length===0) return; slideInterval=setInterval(nextSlide,3500);}
function stopSlideshow(){ if(slideInterval){ clearInterval(slideInterval); } }
if(document.querySelectorAll('.slide').length>0) startSlideshow();
function scrollToServices(){ const s=document.getElementById('services'); if(s) s.scrollIntoView({behavior:'smooth'});}