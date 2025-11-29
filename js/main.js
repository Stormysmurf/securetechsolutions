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

    // Biometric dotLottie - now handled by <dotlottie-player> component in HTML
    // No JavaScript needed as the player handles it automatically
    (function(){
      const player = document.querySelector('#biometric-lottie');
      if(player){
        console.info('Biometric dotLottie player found and will auto-load');
        
        // Optional: Add error handler
        player.addEventListener('error', (e) => {
          console.warn('Failed to load biometric animation:', e);
        });
        
        // Optional: Confirm when loaded
        player.addEventListener('ready', () => {
          console.info('Biometric dotLottie loaded successfully');
        });
      }
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