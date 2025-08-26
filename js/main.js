// Main JavaScript for Bahr Naturals Website
// Core functionality for navigation, animations, and user interactions

document.addEventListener('DOMContentLoaded', function() {
    
    // Navigation Menu Toggle
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('.nav-menu');
    
    if (navToggle && navMenu) {
        navToggle.addEventListener('click', function() {
            const isOpen = navMenu.classList.contains('nav-menu--open');
            
            if (isOpen) {
                navMenu.classList.remove('nav-menu--open');
                navToggle.setAttribute('aria-expanded', 'false');
            } else {
                navMenu.classList.add('nav-menu--open');
                navToggle.setAttribute('aria-expanded', 'true');
            }
        });
    }
    
    // Close mobile menu when clicking outside
    document.addEventListener('click', function(event) {
        if (navMenu && !navToggle.contains(event.target) && !navMenu.contains(event.target)) {
            navMenu.classList.remove('nav-menu--open');
            if (navToggle) navToggle.setAttribute('aria-expanded', 'false');
        }
    });
    
    // Smooth Scrolling for Anchor Links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
    
    // Scroll Animation Observer
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
            }
        });
    }, observerOptions);
    
    // Observe elements for animation
    document.querySelectorAll('.animate-on-scroll, .product-card, .testimonial-card, .heritage-content').forEach(el => {
        observer.observe(el);
    });
    
    // Header Scroll Effect
    const header = document.querySelector('.header');
    let lastScrollTop = 0;
    
    window.addEventListener('scroll', function() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        if (header) {
            if (scrollTop > 100) {
                header.classList.add('header--scrolled');
            } else {
                header.classList.remove('header--scrolled');
            }
        }
        
        lastScrollTop = scrollTop;
    });
    
    // Newsletter Form Handling
    const newsletterForm = document.getElementById('newsletter-form');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const formData = new FormData(this);
            const email = formData.get('email');
            
            if (validateEmail(email)) {
                // Show success message
                showMessage('Thank you for subscribing to our heritage circle!', 'success');
                this.reset();
                
                // Here you would typically send the data to your backend
                // For now, we'll just simulate success
                console.log('Newsletter signup:', email);
            } else {
                showMessage('Please enter a valid email address.', 'error');
            }
        });
    }
    
    // Contact Form Handling (if present)
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const formData = new FormData(this);
            const name = formData.get('name');
            const email = formData.get('email');
            const message = formData.get('message');
            
            // Basic validation
            if (!name || !email || !message) {
                showMessage('Please fill in all required fields.', 'error');
                return;
            }
            
            if (!validateEmail(email)) {
                showMessage('Please enter a valid email address.', 'error');
                return;
            }
            
            // Show loading state
            const submitBtn = this.querySelector('button[type="submit"]');
            if (submitBtn) {
                submitBtn.classList.add('loading');
                submitBtn.textContent = 'Sending...';
            }
            
            // Simulate sending (replace with actual form handling)
            setTimeout(() => {
                showMessage('Thank you for your message! We\'ll get back to you soon.', 'success');
                this.reset();
                if (submitBtn) {
                    submitBtn.classList.remove('loading');
                    submitBtn.textContent = 'Send Message';
                }
            }, 2000);
        });
    }
    
    // Global Message System
    function showMessage(text, type = 'info') {
        // Remove existing messages
        const existingMessage = document.querySelector('.global-message');
        if (existingMessage) {
            existingMessage.remove();
        }
        
        // Create message element
        const message = document.createElement('div');
        message.className = `global-message ${type}`;
        message.innerHTML = `
            <span>${text}</span>
            <button class="message-close" aria-label="Close message">&times;</button>
        `;
        
        // Add to page
        document.body.appendChild(message);
        
        // Show message
        setTimeout(() => {
            message.classList.add('show');
        }, 100);
        
        // Close button functionality
        const closeBtn = message.querySelector('.message-close');
        closeBtn.addEventListener('click', () => {
            hideMessage(message);
        });
        
        // Auto-hide after 5 seconds
        setTimeout(() => {
            if (document.body.contains(message)) {
                hideMessage(message);
            }
        }, 5000);
    }
    
    function hideMessage(messageElement) {
        messageElement.classList.remove('show');
        setTimeout(() => {
            if (messageElement && messageElement.parentNode) {
                messageElement.parentNode.removeChild(messageElement);
            }
        }, 300);
    }
    
    // Email Validation
    function validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }
    
    // Product Image Gallery (for product pages)
    document.querySelectorAll('.product-gallery').forEach(gallery => {
        const mainImage = gallery.querySelector('.product-main-image');
        const thumbnails = gallery.querySelectorAll('.product-thumbnail');
        
        thumbnails.forEach(thumb => {
            thumb.addEventListener('click', function() {
                // Remove active class from all thumbnails
                thumbnails.forEach(t => t.classList.remove('active'));
                
                // Add active class to clicked thumbnail
                this.classList.add('active');
                
                // Update main image
                if (mainImage) {
                    mainImage.src = this.src;
                    mainImage.alt = this.alt;
                }
            });
        });
    });
    
    // Lazy Loading Images (fallback for older browsers)
    const lazyImages = document.querySelectorAll('img[loading="lazy"]');
    
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver(function(entries, observer) {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    if (img.dataset.src) {
                        img.src = img.dataset.src;
                        img.removeAttribute('data-src');
                    }
                    imageObserver.unobserve(img);
                }
            });
        });
        
        lazyImages.forEach(img => {
            imageObserver.observe(img);
        });
    }
    
    // Accessible Focus Management
    document.addEventListener('keydown', function(e) {
        // Skip link functionality
        if (e.key === 'Tab' && !e.shiftKey) {
            const skipLink = document.querySelector('.skip-link:focus');
            if (skipLink) {
                const target = document.querySelector(skipLink.getAttribute('href'));
                if (target) {
                    target.focus();
                }
            }
        }
        
        // Escape key to close mobile menu
        if (e.key === 'Escape') {
            if (navMenu && navMenu.classList.contains('nav-menu--open')) {
                navMenu.classList.remove('nav-menu--open');
                if (navToggle) {
                    navToggle.setAttribute('aria-expanded', 'false');
                    navToggle.focus();
                }
            }
        }
    });
    
    // Console welcome message
    console.log('%cWelcome to Bahr Naturals!', 'color: #4A7A8C; font-size: 18px; font-weight: bold;');
    console.log('From the Nile to your home - handcrafted with heritage. 🧼✨');
});

// Utility Functions
window.BahrNaturals = {
    // Public API for other scripts
    showMessage: function(text, type = 'info') {
        const event = new CustomEvent('showMessage', {
            detail: { text, type }
        });
        document.dispatchEvent(event);
    },
    
    // Update cart count
    updateCartCount: function(count) {
        const cartCountElement = document.querySelector('.cart-count');
        if (cartCountElement) {
            cartCountElement.textContent = count;
            
            // Add animation
            cartCountElement.style.transform = 'scale(1.3)';
            setTimeout(() => {
                cartCountElement.style.transform = 'scale(1)';
            }, 150);
        }
    },
    
    // Scroll to element
    scrollToElement: function(selector) {
        const element = document.querySelector(selector);
        if (element) {
            element.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    }
};

// Handle messages from other scripts
document.addEventListener('showMessage', function(e) {
    const { text, type } = e.detail;
    showMessage(text, type);
});
