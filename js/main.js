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

    // Biometric Lottie JSON Background - UPDATED FOR face.json
    (function(){
      const container = document.getElementById('biometric-lottie');
      
      // Check if container exists and lottie library is loaded
      if(!container) {
        console.warn('Biometric container #biometric-lottie not found');
        return;
      }
      
      if(!window.lottie) {
        console.warn('Lottie library not loaded');
        return;
      }

      const biometricJsonPath = 'assets/face.json';
      
      // Optional: Check if file exists before loading
      fetch(biometricJsonPath, {method: 'HEAD'})
        .then(res => {
          if(!res.ok) {
            console.warn('face.json not found at:', biometricJsonPath);
            return;
          }
          
          // Load the animation
          lottie.loadAnimation({
            container: container,
            renderer: 'svg',
            loop: true,
            autoplay: true,
            path: biometricJsonPath
          });
          
          console.info('Biometric Lottie (face.json) loaded successfully');
        })
        .catch(err => {
          console.warn('Failed to load biometric animation:', err);
        });
    })();

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

// Alternative method - loads JSON content directly instead of using path
(function(){
  const container = document.getElementById('biometric-lottie');
  
  if(!container) {
    console.error('❌ Container #biometric-lottie not found');
    return;
  }
  
  if(!window.lottie) {
    console.error('❌ Lottie library not loaded');
    return;
  }

  const biometricJsonPath = 'assets/face.json';
  
  console.log('🔄 Attempting to load:', biometricJsonPath);
  
  // Fetch and parse JSON directly
  fetch(biometricJsonPath)
    .then(response => {
      console.log('📡 Response status:', response.status);
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: File not found at ${biometricJsonPath}`);
      }
      return response.json();
    })
    .then(animationData => {
      console.log('✅ JSON loaded successfully:', animationData);
      
      // Load using animationData instead of path
      const anim = lottie.loadAnimation({
        container: container,
        renderer: 'svg',
        loop: true,
        autoplay: true,
        animationData: animationData  // ← Using parsed JSON directly
      });
      
      console.log('✅ Animation loaded successfully');
      
      // Listen for errors
      anim.addEventListener('DOMLoaded', () => {
        console.log('✅ Animation DOM loaded');
      });
      
      anim.addEventListener('data_failed', () => {
        console.error('❌ Animation data failed to load');
      });
    })
    .catch(error => {
      console.error('❌ Failed to load biometric animation:', error);
      console.error('Tried path:', biometricJsonPath);
    });
})();