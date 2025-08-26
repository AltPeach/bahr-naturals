/* payment-integration.js */
/* PayPal Smart Payment Buttons Integration for Bahr Naturals */

document.addEventListener('DOMContentLoaded', function() {
  'use strict';

  // ===== Product Data for Bahr Naturals Heritage Collection =====
  const products = {
    'shea-lavender': {
      name: 'Shea Lavender Heritage Soap',
      price: '12.99',
      weight: 0.15, // kg for shipping calculation
      sku: 'BN-SL-001',
      description: 'Traditional shea butter meets Canadian lavender'
    },
    'nile-mint': {
      name: 'Nile Mint Traditional Soap',
      price: '14.99',
      weight: 0.15,
      sku: 'BN-NM-002',
      description: 'Refreshing mint infused with ancient cleansing botanicals'
    },
    'heritage-honey': {
      name: 'Heritage Honey Cleansing Soap',
      price: '16.99',
      weight: 0.15,
      sku: 'BN-HH-003',
      description: 'Luxurious honey and traditional botanicals'
    }
  };

  // ===== Initialize PayPal Buttons =====
  function initializePayPalButtons() {
    // Check if PayPal SDK is loaded
    if (typeof paypal === 'undefined') {
      console.error('PayPal SDK not loaded. Please check your internet connection.');
      showPaymentError('Payment system unavailable. Please try again later.');
      return;
    }

    // Initialize button for each product
    Object.keys(products).forEach(function(productKey) {
      const buttonContainer = document.getElementById('paypal-button-' + productKey);
      
      if (buttonContainer) {
        initializeProductButton(productKey, buttonContainer);
      }
    });
  }

  // ===== Initialize Individual Product Button =====
  function initializeProductButton(productKey, container) {
    const product = products[productKey];
    
    if (!product) {
      console.error('Product not found:', productKey);
      return;
    }

    paypal.Buttons({
      // ===== Button Style Configuration =====
      style: {
        color: 'gold',        // Heritage gold theme
        shape: 'rect',
        label: 'pay',
        layout: 'horizontal',
        tagline: false,
        height: 45
      },

      // ===== Create Order =====
      createOrder: function(data, actions) {
        return actions.order.create({
          purchase_units: [{
            description: product.description,
            amount: {
              currency_code: 'CAD',
              value: product.price,
              breakdown: {
                item_total: {
                  currency_code: 'CAD',
                  value: product.price
                }
              }
            },
            items: [{
              name: product.name,
              description: product.description,
              unit_amount: {
                currency_code: 'CAD',
                value: product.price
              },
              quantity: '1',
              category: 'PHYSICAL_GOODS',
              sku: product.sku
            }],
            custom_id: product.sku,
            soft_descriptor: 'BAHR NATURALS'
          }],
          
          // ===== Shipping Configuration =====
          shipping_type: 'SHIPPING',
          shipping_options: [
            {
              id: 'standard_shipping',
              label: 'Standard Shipping (5-7 business days)',
              type: 'SHIPPING',
              selected: true,
              amount: {
                currency_code: 'CAD',
                value: calculateShipping(product.weight, 'standard')
              }
            },
            {
              id: 'express_shipping',
              label: 'Express Shipping (2-3 business days)',
              type: 'SHIPPING',
              selected: false,
              amount: {
                currency_code: 'CAD',
                value: calculateShipping(product.weight, 'express')
              }
            }
          ],

          // ===== Application Context =====
          application_context: {
            brand_name: 'Bahr Naturals',
            locale: 'en-CA',
            landing_page: 'BILLING',
            shipping_preference: 'GET_FROM_FILE',
            user_action: 'PAY_NOW',
            return_url: 'https://altpeach.github.io/bahr-naturals/thank-you.html',
            cancel_url: 'https://altpeach.github.io/bahr-naturals/shop.html'
          }
        });
      },

      // ===== On Payment Approval =====
      onApprove: function(data, actions) {
        // Show loading state
        showPaymentProcessing(container);

        return actions.order.capture().then(function(details) {
          console.log('Payment completed:', details);

          // Send order confirmation via Formspree (optional)
          sendOrderConfirmation(details, product);

          // Redirect to thank you page with order ID
          const orderQuery = encodeURIComponent(data.orderID);
          const productQuery = encodeURIComponent(productKey);
          window.location.href = `thank-you.html?order=${orderQuery}&product=${productQuery}`;
        });
      },

      // ===== Error Handling =====
      onError: function(err) {
        console.error('PayPal payment error:', err);
        showPaymentError('Payment failed. Please try again or contact us for assistance.');
        
        // Track error for debugging
        if (typeof gtag !== 'undefined') {
          gtag('event', 'exception', {
            description: 'PayPal payment error: ' + err.message,
            fatal: false
          });
        }
      },

      // ===== Payment Cancelled =====
      onCancel: function(data) {
        console.log('Payment cancelled:', data);
        showPaymentMessage('Payment was cancelled. Your order has not been processed.', 'info');
      },

      // ===== Button Click Tracking =====
      onClick: function(data, actions) {
        // Track button clicks for analytics
        if (typeof gtag !== 'undefined') {
          gtag('event', 'begin_checkout', {
            currency: 'CAD',
            value: parseFloat(product.price),
            items: [{
              item_id: product.sku,
              item_name: product.name,
              category: 'Heritage Soap',
              quantity: 1,
              price: parseFloat(product.price)
            }]
          });
        }

        // Validate any conditions before payment (optional)
        return actions.resolve();
      }

    }).render(container).catch(function(err) {
      console.error('PayPal button render error:', err);
      showPaymentError('Unable to load payment options. Please refresh the page.');
    });
  }

  // ===== Calculate Shipping Costs =====
  function calculateShipping(weight, speed) {
    const baseRates = {
      'standard': 8.99,
      'express': 15.99
    };
    
    const weightRate = weight * 2.50; // $2.50 per 100g
    const total = baseRates[speed] + weightRate;
    
    return total.toFixed(2);
  }

  // ===== Send Order Confirmation Email =====
  async function sendOrderConfirmation(orderDetails, product) {
    const confirmationData = {
      _subject: `Order Confirmation - Bahr Naturals - ${orderDetails.id}`,
      order_id: orderDetails.id,
      product_name: product.name,
      product_sku: product.sku,
      amount: orderDetails.purchase_units[0].amount.value,
      currency: 'CAD',
      customer_email: orderDetails.payer.email_address,
      customer_name: `${orderDetails.payer.name.given_name} ${orderDetails.payer.name.surname}`,
      shipping_address: JSON.stringify(orderDetails.purchase_units[0].shipping),
      timestamp: new Date().toISOString(),
      _next: 'https://altpeach.github.io/bahr-naturals/thank-you.html'
    };

    try {
      await fetch('https://formspree.io/f/YOUR_ORDER_CONFIRMATION_FORM_ID', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(confirmationData)
      });
    } catch (error) {
      console.error('Failed to send order confirmation:', error);
      // Non-critical error - don't interrupt user flow
    }
  }

  // ===== UI Helper Functions =====
  function showPaymentProcessing(container) {
    const processingDiv = document.createElement('div');
    processingDiv.className = 'payment-processing';
    processingDiv.innerHTML = `
      <div class="processing-content">
        <div class="spinner"></div>
        <p>Processing your payment...</p>
      </div>
    `;
    
    container.appendChild(processingDiv);
  }

  function showPaymentError(message) {
    showPaymentMessage(message, 'error');
  }

  function showPaymentMessage(message, type = 'info') {
    // Remove existing messages
    const existingMessages = document.querySelectorAll('.payment-message');
    existingMessages.forEach(msg => msg.remove());

    const messageDiv = document.createElement('div');
    messageDiv.className = `payment-message payment-message--${type}`;
    messageDiv.innerHTML = `
      <div class="message-content">
        <p>${message}</p>
        <button class="message-close" aria-label="Close message">&times;</button>
      </div>
    `;

    document.body.appendChild(messageDiv);

    // Auto-hide after 8 seconds
    setTimeout(() => {
      messageDiv.remove();
    }, 8000);

    // Manual close
    const closeButton = messageDiv.querySelector('.message-close');
    closeButton.addEventListener('click', () => {
      messageDiv.remove();
    });
  }

  // ===== Initialize on Page Load =====
  // Wait for PayPal SDK to be ready
  if (typeof paypal !== 'undefined') {
    initializePayPalButtons();
  } else {
    // Fallback: wait for PayPal SDK to load
    let checkCount = 0;
    const checkPayPal = setInterval(() => {
      checkCount++;
      if (typeof paypal !== 'undefined') {
        clearInterval(checkPayPal);
        initializePayPalButtons();
      } else if (checkCount > 50) { // 5 second timeout
        clearInterval(checkPayPal);
        console.error('PayPal SDK failed to load');
        showPaymentError('Payment system is currently unavailable. Please try again later.');
      }
    }, 100);
  }

  // ===== Accessibility Enhancement =====
  // Ensure PayPal buttons are keyboard accessible
  setTimeout(() => {
    const paypalFrames = document.querySelectorAll('iframe[name*="paypal"]');
    paypalFrames.forEach(frame => {
      frame.setAttribute('title', 'PayPal payment button');
    });
  }, 2000);

  // ===== Debug Helper (Development Only) =====
  if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    window.BahrNaturalsPayment = {
      products: products,
      calculateShipping: calculateShipping,
      testPayment: function(productKey) {
        console.log('Testing payment for:', products[productKey]);
      }
    };
  }

}); // End DOMContentLoaded

