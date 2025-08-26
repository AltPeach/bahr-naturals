/* Form Handler for Bahr Naturals */
/* Handles contact forms, newsletter signups, and form validation */

document.addEventListener('DOMContentLoaded', function() {
    'use strict';

    // Form Handler Class
    class BahrNaturalsFormHandler {
        constructor() {
            this.init();
            this.forms = new Map();
            this.validationRules = new Map();
            this.setupValidationRules();
        }

        init() {
            this.bindEventListeners();
            this.setupFormValidation();
            this.initializeNewsletterForms();
            this.initializeContactForms();
        }

        // Setup validation rules for different field types
        setupValidationRules() {
            this.validationRules.set('email', {
                pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                message: 'Please enter a valid email address'
            });

            this.validationRules.set('phone', {
                pattern: /^[\+]?[(]?\d{0,3}[)]?[-\s\.]?[\(]?\d{3}[\)]?[-\s\.]?\d{3}[-\s\.]?\d{4,6}$/,
                message: 'Please enter a valid phone number'
            });

            this.validationRules.set('name', {
                pattern: /^[a-zA-Z\s]{2,50}$/,
                message: 'Name must be 2-50 characters and contain only letters'
            });

            this.validationRules.set('postalCode', {
                pattern: /^[A-Za-z]\d[A-Za-z][ -]?\d[A-Za-z]\d$/,
                message: 'Please enter a valid Canadian postal code'
            });
        }

        // Bind event listeners
        bindEventListeners() {
            // Form submission events
            document.addEventListener('submit', (e) => {
                if (e.target.matches('.contact-form, .newsletter-form, .checkout-form')) {
                    this.handleFormSubmission(e);
                }
            });

            // Real-time validation events
            document.addEventListener('blur', (e) => {
                if (e.target.matches('input, textarea, select')) {
                    this.validateField(e.target);
                }
            });

            document.addEventListener('input', (e) => {
                if (e.target.matches('input[type="email"], input[type="tel"]')) {
                    this.clearFieldError(e.target);
                }
            });
        }

        // Handle form submissions
        handleFormSubmission(event) {
            event.preventDefault();
            const form = event.target;
            const formType = this.getFormType(form);

            // Validate form before submission
            if (!this.validateForm(form)) {
                this.showMessage('Please correct the errors below', 'error');
                return;
            }

            // Show loading state
            this.setFormLoading(form, true);

            // Process form based on type
            switch (formType) {
                case 'newsletter':
                    this.handleNewsletterSubmission(form);
                    break;
                case 'contact':
                    this.handleContactSubmission(form);
                    break;
                case 'checkout':
                    this.handleCheckoutSubmission(form);
                    break;
                default:
                    this.handleGenericSubmission(form);
            }
        }

        // Newsletter form submission
        async handleNewsletterSubmission(form) {
            const formData = new FormData(form);
            const email = formData.get('email');

            try {
                // Submit to Formspree or your backend
                const response = await fetch(form.action || 'https://formspree.io/f/YOUR_NEWSLETTER_FORM_ID', {
                    method: 'POST',
                    body: formData,
                    headers: {
                        'Accept': 'application/json'
                    }
                });

                if (response.ok) {
                    this.showMessage('Welcome to our heritage circle! Check your email for a confirmation.', 'success');
                    form.reset();
                    
                    // Track newsletter signup
                    this.trackEvent('newsletter_signup', {
                        email: email,
                        source: 'website'
                    });
                } else {
                    throw new Error('Network response was not ok');
                }
            } catch (error) {
                console.error('Newsletter signup error:', error);
                this.showMessage('Sorry, there was an error signing you up. Please try again.', 'error');
            } finally {
                this.setFormLoading(form, false);
            }
        }

        // Contact form submission
        async handleContactSubmission(form) {
            const formData = new FormData(form);

            try {
                const response = await fetch(form.action || 'https://formspree.io/f/YOUR_CONTACT_FORM_ID', {
                    method: 'POST',
                    body: formData,
                    headers: {
                        'Accept': 'application/json'
                    }
                });

                if (response.ok) {
                    this.showMessage('Thank you for your message! We\'ll get back to you within 24 hours.', 'success');
                    form.reset();
                    
                    // Track contact form submission
                    this.trackEvent('contact_form_submit', {
                        subject: formData.get('subject'),
                        source: 'website'
                    });
                } else {
                    throw new Error('Network response was not ok');
                }
            } catch (error) {
                console.error('Contact form error:', error);
                this.showMessage('Sorry, there was an error sending your message. Please try again or email us directly.', 'error');
            } finally {
                this.setFormLoading(form, false);
            }
        }

        // Generic form submission
        async handleGenericSubmission(form) {
            const formData = new FormData(form);

            try {
                const response = await fetch(form.action, {
                    method: 'POST',
                    body: formData,
                    headers: {
                        'Accept': 'application/json'
                    }
                });

                if (response.ok) {
                    this.showMessage('Form submitted successfully!', 'success');
                    form.reset();
                } else {
                    throw new Error('Network response was not ok');
                }
            } catch (error) {
                console.error('Form submission error:', error);
                this.showMessage('Sorry, there was an error submitting the form. Please try again.', 'error');
            } finally {
                this.setFormLoading(form, false);
            }
        }

        // Form validation
        validateForm(form) {
            let isValid = true;
            const inputs = form.querySelectorAll('input, textarea, select');

            inputs.forEach(input => {
                if (!this.validateField(input)) {
                    isValid = false;
                }
            });

            return isValid;
        }

        // Validate individual field
        validateField(field) {
            const value = field.value.trim();
            const fieldType = this.getFieldType(field);
            let isValid = true;
            let errorMessage = '';

            // Check required fields
            if (field.hasAttribute('required') && !value) {
                isValid = false;
                errorMessage = 'This field is required';
            }
            // Check validation rules
            else if (value && this.validationRules.has(fieldType)) {
                const rule = this.validationRules.get(fieldType);
                if (!rule.pattern.test(value)) {
                    isValid = false;
                    errorMessage = rule.message;
                }
            }
            // Check custom validations
            else if (field.type === 'email' && value && !this.isValidEmail(value)) {
                isValid = false;
                errorMessage = 'Please enter a valid email address';
            }

            // Update field appearance
            if (isValid) {
                this.clearFieldError(field);
            } else {
                this.showFieldError(field, errorMessage);
            }

            return isValid;
        }

        // Show field error
        showFieldError(field, message) {
            field.classList.add('error');
            
            // Remove existing error message
            const existingError = field.parentNode.querySelector('.field-error');
            if (existingError) {
                existingError.remove();
            }

            // Add error message
            const errorElement = document.createElement('div');
            errorElement.className = 'field-error';
            errorElement.textContent = message;
            errorElement.setAttribute('role', 'alert');
            
            field.parentNode.appendChild(errorElement);
            field.setAttribute('aria-describedby', 'error-' + field.name);
            errorElement.id = 'error-' + field.name;
        }

        // Clear field error
        clearFieldError(field) {
            field.classList.remove('error');
            const errorElement = field.parentNode.querySelector('.field-error');
            if (errorElement) {
                errorElement.remove();
            }
            field.removeAttribute('aria-describedby');
        }

        // Form loading state
        setFormLoading(form, loading) {
            const submitButton = form.querySelector('button[type="submit"], input[type="submit"]');
            
            if (loading) {
                form.classList.add('form-loading');
                if (submitButton) {
                    submitButton.disabled = true;
                    submitButton.classList.add('loading');
                    submitButton.dataset.originalText = submitButton.textContent;
                    submitButton.textContent = 'Sending...';
                }
            } else {
                form.classList.remove('form-loading');
                if (submitButton) {
                    submitButton.disabled = false;
                    submitButton.classList.remove('loading');
                    submitButton.textContent = submitButton.dataset.originalText || 'Submit';
                }
            }
        }

        // Initialize newsletter forms
        initializeNewsletterForms() {
            const newsletterForms = document.querySelectorAll('.newsletter-form');
            newsletterForms.forEach(form => {
                // Add honeypot for spam protection
                this.addHoneypot(form);
                
                // Setup form data
                const formId = form.id || 'newsletter-form-' + Date.now();
                this.forms.set(formId, {
                    type: 'newsletter',
                    element: form,
                    submissionCount: 0
                });
            });
        }

        // Initialize contact forms
        initializeContactForms() {
            const contactForms = document.querySelectorAll('.contact-form');
            contactForms.forEach(form => {
                // Add honeypot for spam protection
                this.addHoneypot(form);
                
                // Setup form data
                const formId = form.id || 'contact-form-' + Date.now();
                this.forms.set(formId, {
                    type: 'contact',
                    element: form,
                    submissionCount: 0
                });
            });
        }

        // Setup form validation
        setupFormValidation() {
            // Add visual feedback for form states
            const forms = document.querySelectorAll('form');
            forms.forEach(form => {
                form.setAttribute('novalidate', ''); // Disable browser validation
                
                // Add submission tracking
                form.addEventListener('submit', () => {
                    const formId = form.id || form.className;
                    if (this.forms.has(formId)) {
                        const formData = this.forms.get(formId);
                        formData.submissionCount++;
                    }
                });
            });
        }

        // Add honeypot field for spam protection
        addHoneypot(form) {
            const honeypot = document.createElement('input');
            honeypot.type = 'text';
            honeypot.name = 'website';
            honeypot.style.display = 'none';
            honeypot.tabIndex = -1;
            honeypot.autocomplete = 'off';
            honeypot.setAttribute('aria-hidden', 'true');
            
            form.appendChild(honeypot);
        }

        // Utility functions
        getFormType(form) {
            if (form.classList.contains('newsletter-form')) return 'newsletter';
            if (form.classList.contains('contact-form')) return 'contact';
            if (form.classList.contains('checkout-form')) return 'checkout';
            return 'generic';
        }

        getFieldType(field) {
            // Check data attribute first
            if (field.dataset.validate) {
                return field.dataset.validate;
            }
            
            // Check name attribute
            const name = field.name.toLowerCase();
            if (name.includes('email')) return 'email';
            if (name.includes('phone') || name.includes('tel')) return 'phone';
            if (name.includes('name')) return 'name';
            if (name.includes('postal') || name.includes('zip')) return 'postalCode';
            
            // Check input type
            return field.type;
        }

        isValidEmail(email) {
            return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
        }

        // Show global message
        showMessage(text, type = 'info') {
            // Use existing global message system
            if (window.BahrNaturals && window.BahrNaturals.showMessage) {
                window.BahrNaturals.showMessage(text, type);
            } else if (window.showMessage) {
                window.showMessage(text, type);
            } else {
                // Fallback message system
                console.log(`${type.toUpperCase()}: ${text}`);
                alert(text);
            }
        }

        // Event tracking (for analytics)
        trackEvent(eventName, parameters = {}) {
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

        // Public API
        validateSingleField(fieldElement) {
            return this.validateField(fieldElement);
        }

        submitForm(formElement) {
            const event = new Event('submit', { bubbles: true, cancelable: true });
            formElement.dispatchEvent(event);
        }
    }

    // Initialize form handler
    const formHandler = new BahrNaturalsFormHandler();

    // Export to global scope for external access
    window.BahrNaturalsFormHandler = formHandler;

    // Additional form enhancements
    
    // Auto-format phone numbers
    document.addEventListener('input', function(e) {
        if (e.target.type === 'tel' || e.target.name.includes('phone')) {
            e.target.value = formatPhoneNumber(e.target.value);
        }
    });

    // Auto-format postal codes (Canadian)
    document.addEventListener('input', function(e) {
        if (e.target.name.includes('postal') || e.target.name.includes('zip')) {
            e.target.value = formatPostalCode(e.target.value);
        }
    });

    // Format phone number
    function formatPhoneNumber(value) {
        const cleaned = value.replace(/\D/g, '');
        const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
        if (match) {
            return `(${match[1]}) ${match[2]}-${match[3]}`;
        }
        return value;
    }

    // Format postal code
    function formatPostalCode(value) {
        const cleaned = value.replace(/[^A-Za-z0-9]/g, '').toUpperCase();
        const match = cleaned.match(/^([A-Z]\d[A-Z])(\d[A-Z]\d)$/);
        if (match) {
            return `${match[1]} ${match[2]}`;
        }
        return value.toUpperCase();
    }

    // Form accessibility enhancements
    function enhanceFormAccessibility() {
        // Add ARIA labels to form fields
        const forms = document.querySelectorAll('form');
        forms.forEach(form => {
            const inputs = form.querySelectorAll('input, textarea, select');
            inputs.forEach(input => {
                if (!input.getAttribute('aria-label') && !input.getAttribute('aria-labelledby')) {
                    const label = form.querySelector(`label[for="${input.id}"]`);
                    if (label) {
                        input.setAttribute('aria-labelledby', label.id || `label-${input.id}`);
                        if (!label.id) {
                            label.id = `label-${input.id}`;
                        }
                    }
                }
            });
        });
    }

    // Initialize accessibility enhancements
    enhanceFormAccessibility();

    // Form security enhancements
    function addFormSecurity() {
        // Add CSRF token to forms (if available)
        const csrfToken = document.querySelector('meta[name="csrf-token"]');
        if (csrfToken) {
            const forms = document.querySelectorAll('form');
            forms.forEach(form => {
                const tokenInput = document.createElement('input');
                tokenInput.type = 'hidden';
                tokenInput.name = '_token';
                tokenInput.value = csrfToken.content;
                form.appendChild(tokenInput);
            });
        }

        // Rate limiting for form submissions
        const submissionTimes = new Map();
        document.addEventListener('submit', function(e) {
            const formId = e.target.id || e.target.action;
            const now = Date.now();
            const lastSubmission = submissionTimes.get(formId);
            
            if (lastSubmission && now - lastSubmission < 3000) { // 3 second limit
                e.preventDefault();
                formHandler.showMessage('Please wait a moment before submitting again.', 'info');
                return;
            }
            
            submissionTimes.set(formId, now);
        });
    }

    // Initialize security enhancements
    addFormSecurity();

    console.log('Bahr Naturals Form Handler initialized successfully');
});
