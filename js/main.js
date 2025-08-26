/* main.js */
/* Main JavaScript functionality for Bahr Naturals website */

document.addEventListener('DOMContentLoaded', function() {
  'use strict';

  // ===== Mobile Navigation Toggle =====
  const navToggle = document.querySelector('.nav-toggle');
  const navMenu = document.querySelector('.nav-menu');
  
  if (navToggle && navMenu) {
    navToggle.addEventListener('click', function() {
      const isOpen = navMenu.classList.contains('nav-menu--open');
      
      // Toggle menu
      navMenu.classList.toggle('nav-menu--open');
      
      // Update ARIA expanded state
      navToggle.setAttribute('aria-expanded', !isOpen);
      
      // Toggle hamburger animation
      navToggle.classList.toggle('nav-toggle--active');
    });

    // Close menu when clicking outside
    document.addEventListener('click', function(e) {
      if (!navToggle.contains(e.target) && !navMenu.contains(e.target)) {
        navMenu.classList.remove('nav-menu--open');
        navToggle.setAttribute('aria-expanded', 'false');
        navToggle.classList.remove('nav-toggle--active');
      }
    });

    // Close menu on escape key
    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape') {
        navMenu.classList.remove('nav-menu--open');
        navToggle.setAttribute('aria-expanded', 'false');
        navToggle.classList.remove('nav-toggle--active');
      }
    });
  }

  // ===== Smooth Scrolling for Anchor Links =====
  const anchorLinks = document.querySelectorAll('a[href^="#"]');
  
  anchorLinks.forEach(function(link) {
    link.addEventListener('click', function(e) {
      e.preventDefault();
      
      const targetId = this.getAttribute('href');
      const targetSection = document.querySelector(targetId);
      
      if (targetSection) {
        targetSection.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
        
        // Update focus for accessibility
        targetSection.focus();
      }
    });
  });

  // ===== Form Enhancement =====
  const forms = document.querySelectorAll('form');
  
  forms.forEach(function(form) {
    // Add loading state to form submissions
    form.addEventListener('submit', function(e) {
      const submitButton = form.querySelector('button[type="submit"]');
      
      if (submitButton) {
        const originalText = submitButton.textContent;
        submitButton.textContent = 'Sending...';
        submitButton.disabled = true;
        
        // Reset button after 3 seconds (fallback)
        setTimeout(function() {
          submitButton.textContent = originalText;
          submitButton.disabled = false;
        }, 3000);
      }
    });

    // Form validation feedback
    const inputs = form.querySelectorAll('input, textarea');
    inputs.forEach(function(input) {
      input.addEventListener('blur', function() {
        validateInput(this);
      });
    });
  });

  // ===== Form Validation Helper =====
  function validateInput(input) {
    const value = input.value.trim();
    const isRequired = input.hasAttribute('required');
    let isValid = true;

    // Remove existing error styling
    input.classList.remove('form-input--error');
    
    // Check if required field is empty
    if (isRequired && !value) {
      isValid = false;
    }
    
    // Email validation
    if (input.type === 'email' && value) {
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailPattern.test(value)) {
        isValid = false;
      }
    }
    
    // Phone validation (basic)
    if (input.type === 'tel' && value) {
      const phonePattern = /^[\+]?[0-9\s\-\(\)]+$/;
      if (!phonePattern.test(value)) {
        isValid = false;
      }
    }
    
    // Apply error styling
    if (!isValid) {
      input.classList.add('form-input--error');
      input.setAttribute('aria-invalid', 'true');
    } else {
      input.setAttribute('aria-invalid', 'false');
    }
    
    return isValid;
  }

  // ===== Newsletter Form Success Message =====
  const urlParams = new URLSearchParams(window.location.search);
  if (urlParams.get('sent') === 'true') {
    showSuccessMessage('Thank you for subscribing to our heritage newsletter!');
  }

  // ===== Contact Form Success Message =====
  if (window.location.pathname.includes('contact.html') && urlParams.get('sent') === 'true') {
    showSuccessMessage('Thank you for your message! We\'ll be in touch soon.');
  }

  // ===== Success Message Helper =====
  function showSuccessMessage(message) {
    const existingMessage = document.querySelector('.success-notification');
    if (existingMessage) {
      existingMessage.remove();
    }

    const notification = document.createElement('div');
    notification.className = 'success-notification';
    notification.innerHTML = `
      <div class="notification-content">
        <p>${message}</p>
        <button class="notification-close" aria-label="Close notification">&times;</button>
      </div>
    `;
    
    document.body.appendChild(notification);
    
    // Auto-hide after 5 seconds
    setTimeout(function() {
      notification.remove();
    }, 5000);
    
    // Manual close button
    const closeButton = notification.querySelector('.notification-close');
    closeButton.addEventListener('click', function() {
      notification.remove();
    });
  }

  // ===== Product Card Hover Effects =====
  const productCards = document.querySelectorAll('.product-card');
  
  productCards.forEach(function(card) {
    card.addEventListener('mouseenter', function() {
      this.style.transform = 'translateY(-4px)';
    });
    
    card.addEventListener('mouseleave', function() {
      this.style.transform = 'translateY(0)';
    });
  });

  // ===== Lazy Loading Images Enhancement =====
  if ('IntersectionObserver' in window) {
    const lazyImages = document.querySelectorAll('img[loading="lazy"]');
    
    const imageObserver = new IntersectionObserver(function(entries) {
      entries.forEach(function(entry) {
        if (entry.isIntersecting) {
          const img = entry.target;
          img.classList.add('fade-in');
          imageObserver.unobserve(img);
        }
      });
    });
    
    lazyImages.forEach(function(img) {
      imageObserver.observe(img);
    });
  }

  // ===== Accessibility: Skip Link Focus =====
  const skipLink = document.querySelector('.skip-link');
  if (skipLink) {
    skipLink.addEventListener('click', function(e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        target.setAttribute('tabindex', '-1');
        target.focus();
      }
    });
  }

  // ===== Cultural Accent Animation =====
  const culturalAccents = document.querySelectorAll('.cultural-accent');
  
  if ('IntersectionObserver' in window) {
    const accentObserver = new IntersectionObserver(function(entries) {
      entries.forEach(function(entry) {
        if (entry.isIntersecting) {
          entry.target.style.opacity = 'var(--pattern-accent)';
          entry.target.style.transition = 'opacity 1s ease-in-out';
        }
      });
    });
    
    culturalAccents.forEach(function(accent) {
      accentObserver.observe(accent);
    });
  }

  // ===== Console Heritage Message =====
  console.log('%c🌊 Bahr Naturals', 'color: #C8A882; font-size: 16px; font-weight: bold;');
  console.log('%cFrom the Nile to Your Home', 'color: #2C5F7A; font-style: italic;');
  console.log('Made with ❤️ in Calgary, AB');

  // ===== Error Handling =====
  window.addEventListener('error', function(e) {
    console.error('Bahr Naturals - Error:', e.error);
  });

  // ===== Performance: Preload Critical Resources =====
  function preloadCriticalResources() {
    const criticalImages = [
      'images/hero-heritage-soaps.jpg',
      'images/bahr-naturals-logo.svg'
    ];
    
    criticalImages.forEach(function(src) {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.as = 'image';
      link.href = src;
      document.head.appendChild(link);
    });
  }
  
  preloadCriticalResources();

}); // End DOMContentLoaded
