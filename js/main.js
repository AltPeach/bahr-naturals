// Enhanced Main JavaScript for Bahr Naturals Website
// Improved functionality for navigation, animations, and user interactions

document.addEventListener('DOMContentLoaded', function() {
    'use strict';
    
    // ===== CONFIGURATION =====
    const config = {
        scrollOffset: 80, // Offset for fixed header when scrolling to anchors
        scrollThreshold: 100, // When to add scrolled class to header
        animationDuration: 300, // Default animation duration
        messageDuration: 5000, // How long messages stay visible
        lazyLoadThreshold: 0.1 // IntersectionObserver threshold for lazy loading
    };
    
    // ===== STATE MANAGEMENT =====
    const state = {
        cartItems: [],
        isMenuOpen: false,
        lastScrollPosition: 0,
        reducedMotion: window.matchMedia('(prefers-reduced-motion: reduce)').matches
    };
    
    // ===== DOM ELEMENTS =====
    const elements = {
        navToggle: document.querySelector('.nav-toggle'),
        navMenu: document.querySelector('.nav-menu'),
        header: document.querySelector('.header'),
        skipLink: document.querySelector('.skip-link'),
        newsletterForm: document.getElementById('newsletter-form'),
        contactForm: document.getElementById('contact-form'),
        cartCountElements: document.querySelectorAll('.cart-count')
    };
    
    // ===== INITIALIZATION =====
    function init() {
        bindEvents();
        setupSmoothScrolling();
        setupLazyLoading();
        setupAnimations();
        loadCartState();
        updateCartDisplay();
        
        // Add reduced motion class if needed
        if (state.reducedMotion) {
            document.documentElement.classList.add('reduced-motion');
        }
        
        console.log('%cBahr Naturals Enhanced', 'color: #4A7A8C; font-size: 18px; font-weight: bold;');
        console.log('From the Nile to your home - handcrafted with heritage. 🧼✨');
    }
    
    // ===== EVENT BINDING =====
    function bindEvents() {
        // Navigation toggle
        if (elements.navToggle && elements.navMenu) {
            elements.navToggle.addEventListener('click', toggleNavigation);
        }
        
        // Close mobile menu when clicking outside
        document.addEventListener('click', handleOutsideClick);
        
        // Header scroll effect
        window.addEventListener('scroll', throttle(handleScroll, 100));
        
        // Newsletter form
        if (elements.newsletterForm) {
            elements.newsletterForm.addEventListener('submit', handleNewsletterSubmit);
        }
        
        // Contact form
        if (elements.contactForm) {
            elements.contactForm.addEventListener('submit', handleContactSubmit);
        }
        
        // Escape key to close mobile menu
        document.addEventListener('keydown', handleKeydown);
        
        // Skip link functionality
        if (elements.skipLink) {
            elements.skipLink.addEventListener('click', handleSkipLink);
        }
        
        // Listen for cart updates from other scripts
        document.addEventListener('cartUpdated', updateCartDisplay);
    }
    
    // ===== NAVIGATION =====
    function toggleNavigation() {
        state.isMenuOpen = !state.isMenuOpen;
        
        if (state.isMenuOpen) {
            elements.navMenu.classList.add('nav-menu--open');
            elements.navToggle.setAttribute('aria-expanded', 'true');
            // Prevent body scrolling when menu is open on mobile
            document.body.style.overflow = 'hidden';
        } else {
            elements.navMenu.classList.remove('nav-menu--open');
            elements.navToggle.setAttribute('aria-expanded', 'false');
            document.body.style.overflow = '';
        }
    }
    
    function handleOutsideClick(event) {
        if (state.isMenuOpen && 
            !elements.navToggle.contains(event.target) && 
            !elements.navMenu.contains(event.target)) {
            toggleNavigation();
        }
    }
    
    function handleKeydown(event) {
        // Escape key closes mobile menu
        if (event.key === 'Escape' && state.isMenuOpen) {
            toggleNavigation();
        }
        
        // Skip link functionality with Tab key
        if (event.key === 'Tab' && !event.shiftKey) {
            const skipLink = document.querySelector('.skip-link:focus');
            if (skipLink) {
                const target = document.querySelector(skipLink.getAttribute('href'));
                if (target) {
                    target.setAttribute('tabindex', '-1');
                    target.focus();
                    setTimeout(() => target.removeAttribute('tabindex'), 1000);
                }
            }
        }
    }
    
    function handleSkipLink(event) {
        event.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.setAttribute('tabindex', '-1');
            target.focus();
            setTimeout(() => target.removeAttribute('tabindex'), 1000);
        }
    }
    
    // ===== SMOOTH SCROLLING =====
    function setupSmoothScrolling() {
        // Use native smooth scroll if reduced motion not preferred
        if (!state.reducedMotion) {
            document.documentElement.style.scrollBehavior = 'smooth';
        }
        
        // Enhanced anchor link handling with offset for fixed header
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            // Skip # alone and mailto links
            if (anchor.getAttribute('href') === '#' || 
                anchor.getAttribute('href').startsWith('mailto:')) {
                return;
            }
            
            anchor.addEventListener('click', function(e) {
                e.preventDefault();
                const targetId = this.getAttribute('href');
                const target = document.querySelector(targetId);
                
                if (target) {
                    // Calculate position with header offset
                    const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - config.scrollOffset;
                    
                    if (state.reducedMotion) {
                        window.scrollTo(0, targetPosition);
                    } else {
                        window.scrollTo({
                            top: targetPosition,
                            behavior: 'smooth'
                        });
                    }
                    
                    // Update URL without scrolling (replaceState instead of pushState to avoid adding to history)
                    window.history.replaceState(null, null, targetId);
                    
                    // Focus the target for accessibility
                    target.setAttribute('tabindex', '-1');
                    target.focus();
                    setTimeout(() => target.removeAttribute('tabindex'), 1000);
                }
            });
        });
    }
    
    function handleScroll() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        // Header scroll effect
        if (elements.header) {
            if (scrollTop > config.scrollThreshold) {
                elements.header.classList.add('header--scrolled');
            } else {
                elements.header.classList.remove('header--scrolled');
            }
        }
        
        // Hide header on scroll down, show on scroll up (mobile only)
        if (window.innerWidth < 768) {
            if (scrollTop > state.lastScrollPosition && scrollTop > 200) {
                elements.header.style.transform = 'translateY(-100%)';
            } else {
                elements.header.style.transform = 'translateY(0)';
            }
        }
        
        state.lastScrollPosition = scrollTop;
    }
    
    // ===== FORM HANDLING =====
    async function handleNewsletterSubmit(e) {
        e.preventDefault();
        
        const formData = new FormData(this);
        const email = formData.get('email').trim();
        
        if (!validateEmail(email)) {
            showMessage('Please enter a valid email address.', 'error');
            return;
        }
        
        // Show loading state
        const submitBtn = this.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        setLoadingState(submitBtn, true, 'Subscribing...');
        
        try {
            // Simulate API call - replace with actual Formspree integration
            await simulateApiCall();
            
            showMessage('Thank you for subscribing to our heritage circle!', 'success');
            this.reset();
            
            // Track newsletter signup
            trackEvent('newsletter_signup', { email: email });
            
        } catch (error) {
            console.error('Newsletter signup error:', error);
            showMessage('Sorry, there was an error. Please try again.', 'error');
        } finally {
            setLoadingState(submitBtn, false, originalText);
        }
    }
    
    async function handleContactSubmit(e) {
        e.preventDefault();
        
        const formData = new FormData(this);
        const name = formData.get('name').trim();
        const email = formData.get('email').trim();
        const message = formData.get('message').trim();
        
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
        const originalText = submitBtn.textContent;
        setLoadingState(submitBtn, true, 'Sending...');
        
        try {
            // Simulate API call - replace with actual Formspree integration
            await simulateApiCall();
            
            showMessage('Thank you for your message! We\'ll get back to you soon.', 'success');
            this.reset();
            
            // Track contact form submission
            trackEvent('contact_form_submit', { subject: formData.get('subject') });
            
        } catch (error) {
            console.error('Contact form error:', error);
            showMessage('Sorry, there was an error sending your message. Please try again.', 'error');
        } finally {
            setLoadingState(submitBtn, false, originalText);
        }
    }
    
    function setLoadingState(button, isLoading, text) {
        if (isLoading) {
            button.disabled = true;
            button.classList.add('loading');
            button.textContent = text;
        } else {
            button.disabled = false;
            button.classList.remove('loading');
            button.textContent = text;
        }
    }
    
    // ===== LAZY LOADING =====
    function setupLazyLoading() {
        const lazyImages = document.querySelectorAll('img[loading="lazy"], [data-src]');
        
        if (!('IntersectionObserver' in window)) {
            // Fallback for browsers without IntersectionObserver
            lazyImages.forEach(img => {
                if (img.dataset.src) {
                    img.src = img.dataset.src;
                }
            });
            return;
        }
        
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    
                    if (img.dataset.src) {
                        img.src = img.dataset.src;
                        img.removeAttribute('data-src');
                    }
                    
                    if (img.dataset.srcset) {
                        img.srcset = img.dataset.srcset;
                        img.removeAttribute('data-srcset');
                    }
                    
                    img.classList.add('loaded');
                    observer.unobserve(img);
                }
            });
        }, {
            rootMargin: '0px 0px 200px 0px', // Start loading slightly before in viewport
            threshold: config.lazyLoadThreshold
        });
        
        lazyImages.forEach(img => {
            imageObserver.observe(img);
        });
    }
    
    // ===== ANIMATIONS =====
    function setupAnimations() {
        if (state.reducedMotion) return;
        
        const animatedElements = document.querySelectorAll('.animate-on-scroll, .product-card, .testimonial-card, .heritage-content');
        
        if (!('IntersectionObserver' in window)) {
            // Fallback for browsers without IntersectionObserver
            animatedElements.forEach(el => {
                el.classList.add('animate-in');
            });
            return;
        }
        
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-in');
                    // Unobserve after animation to improve performance
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);
        
        animatedElements.forEach(el => {
            observer.observe(el);
        });
    }
    
    // ===== CART MANAGEMENT =====
    function loadCartState() {
        // Try to load cart from localStorage
        try {
            const savedCart = localStorage.getItem('bahrNaturalsCart');
            if (savedCart) {
                state.cartItems = JSON.parse(savedCart);
            }
        } catch (error) {
            console.error('Error loading cart from localStorage:', error);
            state.cartItems = [];
        }
    }
    
    function saveCartState() {
        try {
            localStorage.setItem('bahrNaturalsCart', JSON.stringify(state.cartItems));
        } catch (error) {
            console.error('Error saving cart to localStorage:', error);
        }
    }
    
    function updateCartDisplay() {
        const itemCount = state.cartItems.reduce((total, item) => total + item.quantity, 0);
        
        elements.cartCountElements.forEach(element => {
            element.textContent = itemCount;
            
            // Add animation when count changes
            if (itemCount > 0) {
                element.classList.add('cart-updated');
                setTimeout(() => {
                    element.classList.remove('cart-updated');
                }, 500);
            }
        });
        
        // Dispatch event for other components to listen to
        document.dispatchEvent(new CustomEvent('cartUpdated', {
            detail: { itemCount, items: state.cartItems }
        }));
    }
    
    // ===== UTILITY FUNCTIONS =====
    function validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }
    
    function showMessage(text, type = 'info') {
        // Remove existing messages
        const existingMessages = document.querySelectorAll('.global-message');
        existingMessages.forEach(msg => {
            msg.classList.remove('show');
            setTimeout(() => msg.remove(), 300);
        });
        
        // Create message element
        const message = document.createElement('div');
        message.className = `global-message ${type}`;
        message.setAttribute('role', 'status');
        message.setAttribute('aria-live', 'polite');
        message.innerHTML = `
            <span>${text}</span>
            <button class="message-close" aria-label="Close message">&times;</button>
        `;
        
        // Add to page
        document.body.appendChild(message);
        
        // Trigger reflow for animation
        void message.offsetWidth;
        
        // Show message
        message.classList.add('show');
        
        // Close button functionality
        const closeBtn = message.querySelector('.message-close');
        closeBtn.addEventListener('click', () => {
            message.classList.remove('show');
            setTimeout(() => message.remove(), 300);
        });
        
        // Auto-hide after duration
        setTimeout(() => {
            if (document.body.contains(message)) {
                message.classList.remove('show');
                setTimeout(() => message.remove(), 300);
            }
        }, config.messageDuration);
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
    
    function simulateApiCall() {
        return new Promise((resolve, reject) => {
            // Simulate network delay
            setTimeout(() => {
                // Randomly fail 10% of the time for realism
                if (Math.random() < 0.1) {
                    reject(new Error('API request failed'));
                } else {
                    resolve();
                }
            }, 1500);
        });
    }
    
    function trackEvent(eventName, parameters = {}) {
        // Google Analytics 4
        if (typeof gtag !== 'undefined') {
            gtag('event', eventName, parameters);
        }
        
        // Facebook Pixel
        if (typeof fbq !== 'undefined') {
            fbq('track', eventName, parameters);
        }
        
        // Custom analytics
        console.log('Event tracked:', eventName, parameters);
    }
    
    // ===== PUBLIC API =====
    window.BahrNaturals = {
        showMessage: showMessage,
        updateCart: function(items) {
            state.cartItems = items;
            saveCartState();
            updateCartDisplay();
        },
        getCart: function() {
            return [...state.cartItems]; // Return a copy
        },
        addToCart: function(product) {
            const existingItem = state.cartItems.find(item => item.id === product.id);
            
            if (existingItem) {
                existingItem.quantity += product.quantity || 1;
            } else {
                state.cartItems.push({
                    ...product,
                    quantity: product.quantity || 1
                });
            }
            
            saveCartState();
            updateCartDisplay();
            showMessage(`${product.name} added to cart!`, 'success');
        },
        scrollToElement: function(selector) {
            const element = document.querySelector(selector);
            if (element) {
                const targetPosition = element.getBoundingClientRect().top + window.pageYOffset - config.scrollOffset;
                
                if (state.reducedMotion) {
                    window.scrollTo(0, targetPosition);
                } else {
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                }
            }
        }
    };
    
    // Handle messages from other scripts
    document.addEventListener('showMessage', function(e) {
        const { text, type } = e.detail;
        showMessage(text, type);
    });
    
    // Initialize the application
    init();
});
