// Products Page JavaScript
document.addEventListener('DOMContentLoaded', function() {
    // Category filtering system
    const filterButtons = document.querySelectorAll('.filter-btn');
    const categorySections = document.querySelectorAll('.category-section');
    const productCards = document.querySelectorAll('.product-card');
    const categoryLinks = document.querySelectorAll('.category-nav__link');

    // Initialize all categories as visible
    let currentCategory = 'all';
    
    // Filter products function
    function filterProducts(category) {
        currentCategory = category;
        
        // Update active filter button
        filterButtons.forEach(btn => {
            btn.classList.remove('active');
            if (btn.dataset.category === category) {
                btn.classList.add('active');
            }
        });
        
        // Show/hide category sections
        categorySections.forEach(section => {
            const sectionCategory = section.dataset.category;
            
            if (category === 'all' || sectionCategory === category) {
                // Show section with animation
                section.style.display = 'block';
                setTimeout(() => {
                    section.style.opacity = '1';
                    section.style.transform = 'translateY(0)';
                }, 50);
                
                // Also show all product cards in this section
                const cardsInSection = section.querySelectorAll('.product-card');
                cardsInSection.forEach(card => {
                    card.style.display = 'block';
                    setTimeout(() => {
                        card.style.opacity = '1';
                        card.style.transform = 'translateY(0)';
                    }, 100);
                });
            } else {
                // Hide section with animation
                section.style.opacity = '0';
                section.style.transform = 'translateY(20px)';
                setTimeout(() => {
                    section.style.display = 'none';
                }, 300);
            }
        });
        
        // Update URL hash for bookmarking
        if (category !== 'all') {
            window.location.hash = category;
        } else {
            history.replaceState(null, null, ' ');
        }
        
        // Update category nav active state
        updateCategoryNav(category);
    }
    
    // Update category navigation based on active filter
    function updateCategoryNav(category) {
        categoryLinks.forEach(link => {
            link.classList.remove('category-nav__link--active');
            const linkCategory = link.getAttribute('href').replace('#', '');
            if (linkCategory === category) {
                link.classList.add('category-nav__link--active');
            } else if (category === 'all' && linkCategory === 'cctv') {
                // Default to CCTV when showing all
                link.classList.add('category-nav__link--active');
            }
        });
    }
    
    // Add click event to filter buttons
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            const category = this.dataset.category;
            filterProducts(category);
            
            // Scroll to top of products
            window.scrollTo({
                top: document.querySelector('.products-main').offsetTop - 140,
                behavior: 'smooth'
            });
        });
    });
    
    // Category navigation smooth scroll
    categoryLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetCategory = this.getAttribute('href').replace('#', '');
            
            // Set the filter to this category
            filterProducts(targetCategory);
            
            // Find and scroll to the category section
            const targetSection = document.querySelector(`[data-category="${targetCategory}"]`);
            if (targetSection) {
                window.scrollTo({
                    top: targetSection.offsetTop - 140,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Check URL hash on page load
    function checkInitialCategory() {
        const hash = window.location.hash.replace('#', '');
        const validCategories = ['cctv', 'networking', 'biometrics', 'fence', 'gates', 'accessories'];
        
        if (validCategories.includes(hash)) {
            filterProducts(hash);
            
            // Scroll to category after a brief delay
            setTimeout(() => {
                const targetSection = document.querySelector(`[data-category="${hash}"]`);
                if (targetSection) {
                    window.scrollTo({
                        top: targetSection.offsetTop - 140,
                        behavior: 'smooth'
                    });
                }
            }, 300);
        } else {
            // Default to all products
            filterProducts('all');
        }
    }
    
    // Initialize with URL hash or default
    checkInitialCategory();
    
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
    productCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-4px)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });
    
    // Intersection Observer for active category highlighting (for scrolling)
    const observer = new IntersectionObserver((entries) => {
        // Only update if we're in "all" mode
        if (currentCategory !== 'all') return;
        
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const sectionCategory = entry.target.dataset.category;
                updateCategoryNav(sectionCategory);
            }
        });
    }, {
        threshold: 0.3,
        rootMargin: '-100px 0px -100px 0px'
    });
    
    // Only observe when showing all categories
    if (currentCategory === 'all') {
        categorySections.forEach(section => observer.observe(section));
    }
    
    // Add smooth transitions for product cards
    productCards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        card.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
        
        setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }, 100 + (index % 6) * 50);
    });
    
    // Notification function for future use (like adding to cart)
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