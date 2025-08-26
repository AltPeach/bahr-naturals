// Main JavaScript for Bahr Naturals
// Handles navigation, animations, and core functionality

document.addEventListener('DOMContentLoaded', function() {
    // Initialize all components
    initializeNavigation();
    initializeScrollAnimations();
    initializeFormHandling();
    initializeCulturalElements();
    initializeAccessibility();
    updateCartDisplay();
    
    console.log('Bahr Naturals website initialized');
});

// Navigation Functionality
function initializeNavigation() {
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('.nav-menu');
    const header = document.querySelector('.header');
    
    // Mobile menu toggle
    if (navToggle && navMenu) {
        navToggle.addEventListener('click', function() {
            const isExpanded = navToggle.getAttribute('aria-expanded') === 'true';
            navToggle.setAttribute('aria-expanded', !isExpanded);
            navMenu.classList.toggle('active');
            
            // Animate hamburger menu
            navToggle.classList.toggle('active');
        });
        
        // Close mobile menu when clicking outside
        document.addEventListener('click', function(e) {
            if (!navToggle.contains(e.target) && !navMenu.contains(e.target)) {
                navMenu.classList.remove('active');
                navToggle.classList.remove('active');
                navToggle.setAttribute('aria-expanded', 'false');
            }
        });
        
        // Close mobile menu when pressing escape
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && navMenu.classList.contains('active')) {
                navMenu.classList.remove('active');
                navToggle.classList.remove('active');
                navToggle.setAttribute('aria-expanded', 'false');
            }
        });
    }
    
    // Header scroll behavior
    let lastScrollY = window.scrollY;
    window.addEventListener('scroll', function() {
        const currentScrollY = window.scrollY;
        
        if (header) {
            if (currentScrollY > 100) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        }
        
        lastScrollY = currentScrollY;
    });
    
    // Smooth scroll for internal links
    const internalLinks = document.querySelectorAll('a[href^="#"]');
    internalLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// Scroll-triggered animations
function initializeScrollAnimations() {
    // Create intersection observer for fade-in animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    // Observe elements for animation
    const animateElements = document.querySelectorAll(
        '.product-card, .testimonial-card, .heritage-content, .timeline-item, .value-card'
    );
    
    animateElements.forEach(element => {
        element.classList.add('animate-on-scroll');
        observer.observe(element);
    });
    
    // River flow animation
    const riverLines = document.querySelectorAll('.river-flow-line');
    riverLines.forEach(line => {
        line.addEventListener('animationend', function() {
            this.style.animationPlayState = 'paused';
            setTimeout(() => {
                this.style.animationPlayState = 'running';
            }, 1000);
        });
    });
}

// Form handling
function initializeFormHandling() {
    // Newsletter form
    const newsletterForm = document.getElementById('newsletter-form');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', handleNewsletterSubmission);
    }
    
    // Contact form
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', handleContactSubmission);
    }
    
    // Form validation
    const inputs = document.querySelectorAll('input[required], textarea[required], select[required]');
    inputs.forEach(input => {
        input.addEventListener('blur', validateField);
        input.addEventListener('input', clearFieldError);
    });
}

// Newsletter form submission
function handleNewsletterSubmission(e) {
    e.preventDefault();
    
    const form = e.target;
    const email = form.querySelector('#email').value;
    const submitBtn = form.querySelector('button[type="submit"]');
    
    if (!validateEmail(email)) {
        showFormMessage('Please enter a valid email address.', 'error');
        return;
    }
    
    // Show loading state
    submitBtn.classList.add('loading');
    submitBtn.disabled = true;
    
    // Simulate API call (replace with actual endpoint)
    setTimeout(() => {
        submitBtn.classList.remove('loading');
        submitBtn.disabled = false;
        
        // Show success message
        showFormMessage('Thank you for joining our heritage circle!', 'success');
        form.reset();
    }, 1500);
}

// Contact form submission
function handleContactSubmission(e) {
    e.preventDefault();
    
    const form = e.target;
    const formData = new FormData(form);
    const submitBtn = form.querySelector('button[type="submit"]');
    const messageDiv = form.querySelector('#form-message');
    
    // Validate form
    if (!validateContactForm(form)) {
        return;
    }
    
    // Show loading state
    submitBtn.classList.add('loading');
    submitBtn.disabled = true;
    
    // Simulate API call (replace with actual endpoint)
    setTimeout(() => {
        submitBtn.classList.remove('loading');
        submitBtn.disabled = false;
        
        // Show success message
        if (messageDiv) {
            messageDiv.innerHTML = `
                <div class="form-success">
                    <strong>Thank you for reaching out!</strong><br>
                    We'll respond to your message within 24 hours.
                </div>
            `;
            messageDiv.classList.add('show');
        }
        
        form.reset();
        
        // Hide message after 5 seconds
        setTimeout(() => {
            messageDiv.classList.remove('show');
        }, 5000);
    }, 1500);
}

// Form validation functions
function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function validateContactForm(form) {
    const requiredFields = form.querySelectorAll('[required]');
    let isValid = true;
    
    requiredFields.forEach(field => {
        if (!field.value.trim()) {
            showFieldError(field, 'This field is required.');
            isValid = false;
        } else if (field.type === 'email' && !validateEmail(field.value)) {
            showFieldError(field, 'Please enter a valid email address.');
            isValid = false;
        }
    });
    
    return isValid;
}

function validateField(e) {
    const field = e.target;
    const value = field.value.trim();
    
    if (field.hasAttribute('required') && !value) {
        showFieldError(field, 'This field is required.');
    } else if (field.type === 'email' && value && !validateEmail(value)) {
        showFieldError(field, 'Please enter a valid email address.');
    } else {
        clearFieldError(field);
    }
}

function showFieldError(field, message) {
    clearFieldError(field);
    
    field.classList.add('error');
    const errorDiv = document.createElement('div');
    errorDiv.className = 'field-error';
    errorDiv.textContent = message;
    
    field.parentNode.appendChild(errorDiv);
}

function clearFieldError(field) {
    field.classList.remove('error');
    const errorDiv = field.parentNode.querySelector('.field-error');
    if (errorDiv) {
        errorDiv.remove();
    }
}

function showFormMessage(message, type = 'info') {
    // Create or update global message element
    let messageDiv = document.getElementById('global-message');
    
    if (!messageDiv) {
        messageDiv = document.createElement('div');
        messageDiv.id = 'global-message';
        messageDiv.className = 'global-message';
        document.body.appendChild(messageDiv);
    }
    
    messageDiv.className = `global-message ${type} show`;
    messageDiv.textContent = message;
    
    // Auto-hide after 4 seconds
    setTimeout(() => {
        messageDiv.classList.remove('show');
    }, 4000);
}

// Cultural elements and animations
function initializeCulturalElements() {
    // Add cultural pattern animations
    const culturalPatterns = document.querySelectorAll('.cultural-pattern-bg');
    culturalPatterns.forEach(pattern => {
        // Create subtle movement animation
        let angle = 0;
        setInterval(() => {
            angle += 0.5;
            pattern.style.transform = `rotate(${angle}deg)`;
        }, 100);
    });
    
    // Heritage blessing animations
    const blessings = document.querySelectorAll('.blessing-text');
    blessings.forEach(blessing => {
        blessing.addEventListener('mouseenter', function() {
            this.style.transform = 'scale(1.05)';
            this.style.color = 'var(--color-primary)';
        });
        
        blessing.addEventListener('mouseleave', function() {
            this.style.transform = 'scale(1)';
            this.style.color = 'var(--color-accent)';
        });
    });
}

// Accessibility enhancements
function initializeAccessibility() {
    // Skip to main content link
    const skipLink = document.createElement('a');
    skipLink.href = '#main';
    skipLink.className = 'skip-link';
    skipLink.textContent = 'Skip to main content';
    document.body.prepend(skipLink);
    
    // Focus management for modals and dropdowns
    const focusableElements = 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';
    
    // Trap focus in mobile menu when open
    const navMenu = document.querySelector('.nav-menu');
    if (navMenu) {
        navMenu.addEventListener('keydown', function(e) {
            if (e.key === 'Tab' && this.classList.contains('active')) {
                const focusableContent = this.querySelectorAll(focusableElements);
                const firstFocusable = focusableContent[0];
                const lastFocusable = focusableContent[focusableContent.length - 1];
                
                if (e.shiftKey) {
                    if (document.activeElement === firstFocusable) {
                        lastFocusable.focus();
                        e.preventDefault();
                    }
                } else {
                    if (document.activeElement === lastFocusable) {
                        firstFocusable.focus();
                        e.preventDefault();
                    }
                }
            }
        });
    }
    
    // Announce dynamic content changes to screen readers
    const announcer = document.createElement('div');
    announcer.setAttribute('aria-live', 'polite');
    announcer.setAttribute('aria-atomic', 'true');
    announcer.className = 'sr-only';
    announcer.id = 'announcer';
    document.body.appendChild(announcer);
    
    window.announceToScreenReader = function(message) {
        announcer.textContent = message;
    };
    
    // Reduce motion for users who prefer it
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        document.documentElement.style.scrollBehavior = 'auto';
    }
}

// Cart display update
function updateCartDisplay() {
    const cartCount = document.querySelector('.cart-count');
    if (cartCount) {
        const count = getCartItemCount();
        cartCount.textContent = count;
        cartCount.style.display = count > 0 ? 'block' : 'none';
    }
}

// Helper function to get cart count (will be implemented in cart-management.js)
function getCartItemCount() {
    const cart = JSON.parse(localStorage.getItem('bahrNaturalsCart') || '[]');
    return cart.reduce((total, item) => total + item.quantity, 0);
}

// Utility functions
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

function throttle(func, limit) {
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

// Export functions for use in other scripts
window.BahrNaturals = {
    showFormMessage,
    updateCartDisplay,
    announceToScreenReader: window.announceToScreenReader,
    debounce,
    throttle
};
