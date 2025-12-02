// Apple-style JavaScript
class SecureTech {
  constructor() {
    this.init();
  }

  init() {
    this.setupNavigation();
    this.setupAnimations();
    this.setupIntersectionObserver();
    this.setupServiceCards();
    this.setupContactForm();
    this.setupAppleSlideshow(); // NEW: Apple-style slideshow
  }

  setupNavigation() {
    const nav = document.getElementById('nav');
    const navToggle = document.getElementById('navToggle');
    
    if (navToggle) {
      navToggle.addEventListener('click', () => {
        nav.classList.toggle('nav--open');
        navToggle.setAttribute('aria-expanded', 
          nav.classList.contains('nav--open')
        );
      });
    }

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
      if (!nav.contains(e.target) && nav.classList.contains('nav--open')) {
        nav.classList.remove('nav--open');
      }
    });

    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;
        
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
          window.scrollTo({
            top: targetElement.offsetTop - 80,
            behavior: 'smooth'
          });
          
          // Close mobile menu if open
          if (nav.classList.contains('nav--open')) {
            nav.classList.remove('nav--open');
          }
        }
      });
    });
  }

  setupAnimations() {
    // Apple-style hover effects
    const cards = document.querySelectorAll('.card');
    cards.forEach(card => {
      card.addEventListener('mouseenter', () => {
        card.style.transform = 'translateY(-4px)';
      });
      
      card.addEventListener('mouseleave', () => {
        card.style.transform = 'translateY(0)';
      });
    });

    // Button ripple effect
    const buttons = document.querySelectorAll('.btn--primary');
    buttons.forEach(button => {
      button.addEventListener('click', function(e) {
        const ripple = document.createElement('span');
        const rect = this.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = e.clientX - rect.left - size / 2;
        const y = e.clientY - rect.top - size / 2;
        
        ripple.style.width = ripple.style.height = size + 'px';
        ripple.style.left = x + 'px';
        ripple.style.top = y + 'px';
        ripple.classList.add('ripple');
        
        this.appendChild(ripple);
        
        setTimeout(() => {
          ripple.remove();
        }, 600);
      });
    });
  }

  setupIntersectionObserver() {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, observerOptions);

    // Observe elements for scroll animations
    document.querySelectorAll('.fade-in, .scale-in').forEach(el => {
      observer.observe(el);
    });
  }

  setupServiceCards() {
    const serviceCards = document.querySelectorAll('.card--service');
    
    serviceCards.forEach(card => {
      card.addEventListener('click', (e) => {
        if (!e.target.closest('a')) {
          card.querySelector('a').click();
        }
      });
      
      // Keyboard navigation
      card.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          card.click();
        }
      });
    });
  }

  setupContactForm() {
    const contactForm = document.getElementById('contactForm');
    if (!contactForm) return;

    contactForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      const submitBtn = contactForm.querySelector('button[type="submit"]');
      const originalText = submitBtn.textContent;
      
      // Show loading state
      submitBtn.textContent = 'Sending...';
      submitBtn.disabled = true;

      try {
        // Simulate API call (replace with actual API endpoint)
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        // Show success message
        this.showNotification('Message sent successfully!', 'success');
        contactForm.reset();
      } catch (error) {
        this.showNotification('Error sending message. Please try again.', 'error');
      } finally {
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
      }
    });
  }

  // NEW: Apple-style slideshow functionality
  setupAppleSlideshow() {
    const slideshowContainers = document.querySelectorAll('.showcase__image-container');
    
    slideshowContainers.forEach(container => {
      const images = container.querySelectorAll('.showcase__image');
      if (images.length <= 1) return;
      
      let currentIndex = 0;
      
      // Auto-rotate every 5 seconds
      setInterval(() => {
        images[currentIndex].classList.remove('active');
        currentIndex = (currentIndex + 1) % images.length;
        images[currentIndex].classList.add('active');
      }, 5000);
      
      // Manual controls if they exist
      const prevBtn = container.parentElement.querySelector('.slider-btn--prev');
      const nextBtn = container.parentElement.querySelector('.slider-btn--next');
      
      if (prevBtn) {
        prevBtn.addEventListener('click', () => {
          images[currentIndex].classList.remove('active');
          currentIndex = (currentIndex - 1 + images.length) % images.length;
          images[currentIndex].classList.add('active');
        });
      }
      
      if (nextBtn) {
        nextBtn.addEventListener('click', () => {
          images[currentIndex].classList.remove('active');
          currentIndex = (currentIndex + 1) % images.length;
          images[currentIndex].classList.add('active');
        });
      }
    });
  }

  showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification--${type}`;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    // Apple-style animation
    setTimeout(() => {
      notification.classList.add('notification--visible');
    }, 10);
    
    // Remove after 3 seconds
    setTimeout(() => {
      notification.classList.remove('notification--visible');
      setTimeout(() => {
        notification.remove();
      }, 300);
    }, 3000);
  }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  new SecureTech();
});

// Add Apple-style utility functions
const AppleUtils = {
  // Format phone number
  formatPhoneNumber(phone) {
    return phone.replace(/(\d{3})(\d{3})(\d{4})/, '$1 $2 $3');
  },

  // Debounce function for performance
  debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  },

// Products Page JavaScript
document.addEventListener('DOMContentLoaded', function() {
    // Category navigation smooth scroll
    const categoryLinks = document.querySelectorAll('.category-nav__link');
    const categorySections = document.querySelectorAll('.category-section');

    categoryLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);

            if (targetSection) {
                // Update active link
                categoryLinks.forEach(l => l.classList.remove('category-nav__link--active'));
                this.classList.add('category-nav__link--active');

                // Scroll to section
                window.scrollTo({
                    top: targetSection.offsetTop - 120,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Intersection Observer for active category highlighting
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.getAttribute('id');
                categoryLinks.forEach(link => {
                    link.classList.remove('category-nav__link--active');
                    if (link.getAttribute('href') === `#${id}`) {
                        link.classList.add('category-nav__link--active');
                    }
                });
            }
        });
    }, {
        threshold: 0.3,
        rootMargin: '-100px 0px -100px 0px'
    });

    categorySections.forEach(section => observer.observe(section));

    // Lightbox functionality
    const lightboxes = document.querySelectorAll('.lightbox');
    const closeButtons = document.querySelectorAll('.lightbox__close');

    // Close lightbox when clicking close button
    closeButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            const lightbox = this.closest('.lightbox');
            if (lightbox) {
                lightbox.style.display = 'none';
                history.replaceState(null, null, ' ');
            }
        });
    });

    // Close lightbox when clicking outside content
    lightboxes.forEach(lightbox => {
        lightbox.addEventListener('click', function(e) {
            if (e.target === this) {
                this.style.display = 'none';
                history.replaceState(null, null, ' ');
            }
        });
    });

    // Close lightbox with Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            lightboxes.forEach(lightbox => {
                if (lightbox.style.display === 'flex') {
                    lightbox.style.display = 'none';
                    history.replaceState(null, null, ' ');
                }
            });
        }
    });

    // Product card hover effects
    const productCards = document.querySelectorAll('.product-card');

    productCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-4px)';
        });

        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });

    // Add to cart functionality (placeholder)
    const addToCartButtons = document.querySelectorAll('.btn--add-to-cart');

    addToCartButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            const productName = this.closest('.lightbox__info').querySelector('h3').textContent;

            // Show notification
            showNotification(`Added ${productName} to cart`, 'success');
        });
    });

    // Notification function
    function showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification notification--${type}`;
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            background: ${type === 'success' ? '#30d158' : '#ff453a'};
            color: white;
            padding: 12px 24px;
            border-radius: 8px;
            z-index: 1000;
            animation: slideIn 0.3s ease;
        `;

        document.body.appendChild(notification);

        setTimeout(() => {
            notification.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }

    // Add CSS for notifications
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideIn {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }
        @keyframes slideOut {
            from { transform: translateX(0); opacity: 1; }
            to { transform: translateX(100%); opacity: 0; }
        }
    `;
    document.head.appendChild(style);
});

  // Throttle function for scroll events
  throttle(func, limit) {
    let inThrottle;
    return function() {
      const args = arguments;
      const context = this;
      if (!inThrottle) {
        func.apply(context, args);
        inThrottle = true;
        setTimeout(() => inThrottle = false, limit);
      }
    };
  }
};

// Export utilities to window
window.AppleUtils = AppleUtils;