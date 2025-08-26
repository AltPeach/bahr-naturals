// cart-management.js - Enhanced Version with Complete E-commerce Functionality
class BahrNaturalsCart {
    constructor() {
        this.items = [];
        this.storageKey = 'bahrNaturalsCart';
        this.taxRate = 0.13; // 13% HST for Canada
        this.freeShippingThreshold = 50;
        this.standardShippingRate = 8.99;
        this.init();
    }
    
    init() {
        this.loadCart();
        this.bindEvents();
        this.updateCartDisplay();
        this.initializeGlobalBahrNaturals();
    }
    
    // Initialize global BahrNaturals object for shared functionality
    initializeGlobalBahrNaturals() {
        if (!window.BahrNaturals) {
            window.BahrNaturals = {
                showMessage: this.showMessage.bind(this)
            };
        }
    }
    
    // Load cart from localStorage
    loadCart() {
        try {
            const cartData = localStorage.getItem(this.storageKey);
            if (cartData) {
                this.items = JSON.parse(cartData);
                // Validate and clean loaded data
                this.items = this.items.filter(item => 
                    item.id && item.name && typeof item.price === 'number' && item.quantity > 0
                );
            }
        } catch (error) {
            console.error('Error loading cart from localStorage:', error);
            this.items = [];
        }
    }
    
    // Save cart to localStorage
    saveCart() {
        try {
            localStorage.setItem(this.storageKey, JSON.stringify(this.items));
        } catch (error) {
            console.error('Error saving cart to localStorage:', error);
            this.showMessage('Unable to save cart changes', 'error');
        }
    }
    
    // Add item to cart
    addItem(product) {
        if (!this.validateProduct(product)) {
            this.showMessage('Invalid product data', 'error');
            return false;
        }
        
        const existingItem = this.items.find(item => item.id === product.id);
        
        if (existingItem) {
            existingItem.quantity += product.quantity || 1;
        } else {
            this.items.push({
                id: product.id,
                name: product.name,
                price: parseFloat(product.price),
                image: product.image || '',
                quantity: product.quantity || 1
            });
        }
        
        this.saveCart();
        this.updateCartDisplay();
        this.showMessage(`${product.name} added to cart!`, 'success');
        return true;
    }
    
    // Remove item from cart
    removeItem(productId) {
        const itemIndex = this.items.findIndex(item => item.id === productId);
        if (itemIndex > -1) {
            const removedItem = this.items[itemIndex];
            this.items.splice(itemIndex, 1);
            this.saveCart();
            this.updateCartDisplay();
            this.showMessage(`${removedItem.name} removed from cart`, 'info');
            return true;
        }
        return false;
    }
    
    // Update item quantity
    updateQuantity(productId, quantity) {
        const item = this.items.find(item => item.id === productId);
        if (!item) return false;
        
        if (quantity <= 0) {
            return this.removeItem(productId);
        } else {
            item.quantity = parseInt(quantity);
            this.saveCart();
            this.updateCartDisplay();
            return true;
        }
    }
    
    // Clear entire cart
    clearCart() {
        if (this.items.length === 0) {
            this.showMessage('Cart is already empty', 'info');
            return;
        }
        
        this.items = [];
        this.saveCart();
        this.updateCartDisplay();
        this.showMessage('Cart cleared', 'info');
    }
    
    // Get cart subtotal
    getSubtotal() {
        return this.items.reduce((total, item) => {
            return total + (item.price * item.quantity);
        }, 0);
    }
    
    // Get shipping cost
    getShippingCost() {
        const subtotal = this.getSubtotal();
        return subtotal >= this.freeShippingThreshold ? 0 : this.standardShippingRate;
    }
    
    // Get tax amount
    getTax() {
        return this.getSubtotal() * this.taxRate;
    }
    
    // Get cart total (subtotal + shipping + tax)
    getTotal() {
        return this.getSubtotal() + this.getShippingCost() + this.getTax();
    }
    
    // Get total item count
    getItemCount() {
        return this.items.reduce((count, item) => {
            return count + item.quantity;
        }, 0);
    }
    
    // Validate product data
    validateProduct(product) {
        return product && 
               product.id && 
               product.name && 
               typeof product.price === 'number' && 
               product.price > 0;
    }
    
    // Update cart display across all pages
    updateCartDisplay() {
        this.updateCartCount();
        this.updateCartPage();
    }
    
    // Update cart count in header
    updateCartCount() {
        const cartCountElements = document.querySelectorAll('.cart-count');
        const count = this.getItemCount();
        
        cartCountElements.forEach(element => {
            element.textContent = count;
            
            if (count > 0) {
                element.style.display = 'inline-block';
                element.classList.add('cart-updated');
                setTimeout(() => {
                    element.classList.remove('cart-updated');
                }, 500);
            } else {
                element.style.display = 'none';
            }
        });
    }
    
    // Update cart page if we're on it
    updateCartPage() {
        if (window.location.pathname.includes('cart.html')) {
            this.renderCartPage();
        }
    }
    
    // Render cart page
    renderCartPage() {
        const cartContainer = document.querySelector('.cart-items-container');
        const cartSummary = document.querySelector('.cart-summary');
        
        if (!cartContainer) return;
        
        if (this.items.length === 0) {
            cartContainer.innerHTML = `
                <div class="empty-cart">
                    <h3>Your cart is empty</h3>
                    <p>Discover our handcrafted natural soaps and start your heritage journey.</p>
                    <a href="shop.html" class="btn btn-primary">Shop Our Collection</a>
                </div>
            `;
            
            if (cartSummary) {
                this.updateCartSummary(cartSummary);
            }
            return;
        }
        
        // Render cart items
        const itemsHTML = this.items.map(item => `
            <div class="cart-item" data-product-id="${item.id}">
                <div class="item-image">
                    <img src="${item.image || 'data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><rect width=%22100%22 height=%22100%22 fill=%22%23f0f0f0%22/><text x=%2250%22 y=%2250%22 text-anchor=%22middle%22 dy=%22.35em%22 font-size=%2214%22 fill=%22%23666%22>No Image</text></svg>'}" 
                         alt="${this.escapeHtml(item.name)}" 
                         loading="lazy"
                         onerror="this.src='data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><rect width=%22100%22 height=%22100%22 fill=%22%23f0f0f0%22/><text x=%2250%22 y=%2250%22 text-anchor=%22middle%22 dy=%22.35em%22 font-size=%2214%22 fill=%22%23666%22>No Image</text></svg>'">
                </div>
                <div class="item-details">
                    <h4 class="item-name">${this.escapeHtml(item.name)}</h4>
                    <div class="item-price">$${item.price.toFixed(2)} CAD</div>
                </div>
                <div class="item-quantity">
                    <button class="quantity-btn decrease-quantity" 
                            data-product-id="${item.id}"
                            aria-label="Decrease quantity">-</button>
                    <input type="number" 
                           value="${item.quantity}" 
                           min="1" 
                           max="99"
                           class="quantity-input" 
                           data-product-id="${item.id}"
                           aria-label="Quantity">
                    <button class="quantity-btn increase-quantity" 
                            data-product-id="${item.id}"
                            aria-label="Increase quantity">+</button>
                </div>
                <div class="item-total">
                    $${(item.price * item.quantity).toFixed(2)} CAD
                </div>
                <button class="remove-item" 
                        data-product-id="${item.id}"
                        aria-label="Remove ${this.escapeHtml(item.name)}">
                    ×
                </button>
            </div>
        `).join('');
        
        cartContainer.innerHTML = itemsHTML;
        
        // Update cart summary
        if (cartSummary) {
            this.updateCartSummary(cartSummary);
        }
        
        // Bind events for the new elements
        this.bindCartEvents();
    }
    
    // Update cart summary section
    updateCartSummary(cartSummary) {
        const subtotal = this.getSubtotal();
        const shipping = this.getShippingCost();
        const tax = this.getTax();
        const total = this.getTotal();
        const itemCount = this.getItemCount();
        
        cartSummary.innerHTML = `
            <h3>Order Summary</h3>
            <div class="summary-line">
                <span>Subtotal (${itemCount} item${itemCount !== 1 ? 's' : ''})</span>
                <span>$${subtotal.toFixed(2)} CAD</span>
            </div>
            <div class="summary-line">
                <span>Shipping</span>
                <span>${shipping > 0 ? '$' + shipping.toFixed(2) + ' CAD' : 'Free'}</span>
            </div>
            <div class="summary-line">
                <span>Tax (HST 13%)</span>
                <span>$${tax.toFixed(2)} CAD</span>
            </div>
            <div class="summary-line total-line">
                <span><strong>Total</strong></span>
                <span><strong>$${total.toFixed(2)} CAD</strong></span>
            </div>
            <button class="btn btn-primary checkout-btn" ${itemCount === 0 ? 'disabled' : ''}>
                Proceed to Checkout
            </button>
            <div class="shipping-note">
                <small>Free shipping on orders over $${this.freeShippingThreshold} CAD</small>
            </div>
            
            <!-- Shipping Calculator -->
            <div class="shipping-calculator">
                <h4>Calculate Shipping</h4>
                <div class="postal-code-input">
                    <input type="text" 
                           id="postal-code" 
                           placeholder="Enter postal code" 
                           maxlength="7"
                           pattern="[A-Za-z]\\d[A-Za-z][ -]?\\d[A-Za-z]\\d">
                    <button class="estimate-btn" onclick="updateShippingEstimate(document.getElementById('postal-code').value)">
                        Estimate
                    </button>
                </div>
                <div class="shipping-estimate"></div>
            </div>
        `;
    }
    
    // Bind events to cart elements
    bindCartEvents() {
        // Quantity buttons
        document.querySelectorAll('.increase-quantity').forEach(button => {
            button.addEventListener('click', (e) => {
                e.preventDefault();
                const productId = e.target.dataset.productId;
                const item = this.items.find(item => item.id === productId);
                if (item && item.quantity < 99) {
                    this.updateQuantity(productId, item.quantity + 1);
                }
            });
        });
        
        document.querySelectorAll('.decrease-quantity').forEach(button => {
            button.addEventListener('click', (e) => {
                e.preventDefault();
                const productId = e.target.dataset.productId;
                const item = this.items.find(item => item.id === productId);
                if (item) {
                    this.updateQuantity(productId, item.quantity - 1);
                }
            });
        });
        
        // Quantity inputs
        document.querySelectorAll('.quantity-input').forEach(input => {
            input.addEventListener('change', (e) => {
                const productId = e.target.dataset.productId;
                let quantity = parseInt(e.target.value) || 1;
                
                // Enforce min/max limits
                if (quantity < 1) quantity = 1;
                if (quantity > 99) quantity = 99;
                
                e.target.value = quantity; // Update input to show corrected value
                this.updateQuantity(productId, quantity);
            });
            
            // Prevent invalid input
            input.addEventListener('keypress', (e) => {
                if (!/[0-9]/.test(e.key) && !['Backspace', 'Delete', 'Tab', 'Enter'].includes(e.key)) {
                    e.preventDefault();
                }
            });
        });
        
        // Remove buttons
        document.querySelectorAll('.remove-item').forEach(button => {
            button.addEventListener('click', (e) => {
                e.preventDefault();
                const productId = e.target.dataset.productId;
                this.removeItem(productId);
            });
        });
        
        // Checkout button
        const checkoutBtn = document.querySelector('.checkout-btn');
        if (checkoutBtn) {
            checkoutBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.proceedToCheckout();
            });
        }
    }
    
    // Bind events to add-to-cart buttons across the site
    bindEvents() {
        // Add to cart buttons
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('add-to-cart') || 
                (e.target.closest('.btn') && e.target.closest('.btn').textContent.includes('Add to Cart'))) {
                e.preventDefault();
                this.handleAddToCart(e.target.closest('.btn') || e.target);
            }
        });
        
        // Handle cart link clicks to ensure cart count is visible
        document.addEventListener('click', (e) => {
            if (e.target.closest('.cart-link')) {
                // Small delay to ensure cart page loads before updating display
                setTimeout(() => this.updateCartDisplay(), 100);
            }
        });
    }
    
    // Handle add to cart button click
    handleAddToCart(button) {
        const productCard = button.closest('.product-card, .gift-set-card, '.product');
        if (!productCard) {
            console.warn('Add to cart button not within a valid product card');
            return;
        }
        
        // Try multiple selectors for product data
        const productName = this.getProductName(productCard);
        const productPrice = this.getProductPrice(productCard);
        const productImage = this.getProductImage(button, productCard);
        
        if (!productName || !productPrice) {
            console.warn('Unable to extract product data:', { productName, productPrice });
            this.showMessage('Unable to add product to cart', 'error');
            return;
        }
        
        const productId = button.dataset.productId || 
                         this.generateId(productName);
        
        const productData = {
            id: productId,
            name: productName,
            price: productPrice,
            image: productImage,
            quantity: 1
        };
        
        this.addItem(productData);
    }
    
    // Extract product name from various possible selectors
    getProductName(productCard) {
        const nameSelectors = [
            '.product-name',
            '.set-name', 
            '.item-name',
            'h3',
            'h4',
            '[data-product-name]'
        ];
        
        for (const selector of nameSelectors) {
            const element = productCard.querySelector(selector);
            if (element) {
                return element.textContent.trim() || element.dataset.productName;
            }
        }
        return null;
    }
    
    // Extract product price from various possible selectors
    getProductPrice(productCard) {
        const priceSelectors = [
            '.product-price',
            '.sale-price',
            '.price',
            '.item-price',
            '[data-product-price]'
        ];
        
        for (const selector of priceSelectors) {
            const element = productCard.querySelector(selector);
            if (element) {
                const priceText = element.textContent || element.dataset.productPrice;
                const price = this.parsePrice(priceText);
                if (price > 0) return price;
            }
        }
        return null;
    }
    
    // Extract product image
    getProductImage(button, productCard) {
        // Try button data attribute first
        if (button.dataset.productImage) {
            return button.dataset.productImage;
        }
        
        // Try to find image in product card
        const imageSelectors = [
            '.product-image img',
            '.item-image img',
            'img'
        ];
        
        for (const selector of imageSelectors) {
            const img = productCard.querySelector(selector);
            if (img && img.src && !img.src.includes('data:image')) {
                return img.src;
            }
        }
        
        return '';
    }
    
    // Generate a product ID from text
    generateId(text) {
        return text.toLowerCase()
                  .replace(/\s+/g, '-')
                  .replace(/[^\w-]+/g, '')
                  .substring(0, 50); // Limit length
    }
    
    // Parse price from text
    parsePrice(priceText) {
        if (!priceText) return 0;
        
        // Remove currency symbols and non-numeric characters except decimal point
        const cleanPrice = priceText.toString().replace(/[^\d.]/g, '');
        const price = parseFloat(cleanPrice);
        
        return isNaN(price) ? 0 : price;
    }
    
    // Escape HTML to prevent XSS
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
    
    // Proceed to checkout
    proceedToCheckout() {
        if (this.items.length === 0) {
            this.showMessage('Your cart is empty', 'error');
            return;
        }
        
        if (this.getTotal() <= 0) {
            this.showMessage('Cart total must be greater than $0', 'error');
            return;
        }
        
        this.showMessage('Redirecting to secure checkout...', 'info');
        
        // In a real implementation, you would:
        // 1. Validate cart contents
        // 2. Create checkout session
        // 3. Redirect to payment processor
        
        setTimeout(() => {
            // Replace with your actual checkout URL
            const checkoutUrl = 'checkout.html';
            
            if (document.querySelector('a[href="' + checkoutUrl + '"]')) {
                window.location.href = checkoutUrl;
            } else {
                // Fallback for development/testing
                alert(`Checkout functionality ready!\n\nCart Summary:\nItems: ${this.getItemCount()}\nSubtotal: $${this.getSubtotal().toFixed(2)}\nTotal: $${this.getTotal().toFixed(2)}\n\nIn production, this would redirect to your payment processor.`);
            }
        }, 1500);
    }
    
    // Show message to user
    showMessage(text, type = 'info') {
        // Remove existing messages
        const existingMessages = document.querySelectorAll('.global-message');
        existingMessages.forEach(msg => msg.remove());
        
        // Create message element
        const message = document.createElement('div');
        message.className = `global-message ${type}`;
        message.innerHTML = `
            <span>${this.escapeHtml(text)}</span>
            <button class="message-close" aria-label="Close message">&times;</button>
        `;
        
        // Add to page
        document.body.appendChild(message);
        
        // Show message with animation
        setTimeout(() => {
            message.classList.add('show');
        }, 10);
        
        // Close button functionality
        const closeBtn = message.querySelector('.message-close');
        if (closeBtn) {
            closeBtn.addEventListener('click', () => {
                message.classList.remove('show');
                setTimeout(() => {
                    if (message.parentNode) {
                        message.remove();
                    }
                }, 300);
            });
        }
        
        // Auto-remove after 4 seconds
        setTimeout(() => {
            if (document.body.contains(message)) {
                message.classList.remove('show');
                setTimeout(() => {
                    if (message.parentNode) {
                        message.remove();
                    }
                }, 300);
            }
        }, 4000);
    }
    
    // Get cart data for external use (e.g., analytics, checkout)
    getCartData() {
        return {
            items: [...this.items],
            subtotal: this.getSubtotal(),
            shipping: this.getShippingCost(),
            tax: this.getTax(),
            total: this.getTotal(),
            itemCount: this.getItemCount()
        };
    }
    
    // Import cart data (useful for syncing with server)
    importCartData(cartData) {
        if (cartData && Array.isArray(cartData.items)) {
            this.items = cartData.items.filter(item => this.validateProduct(item));
            this.saveCart();
            this.updateCartDisplay();
            return true;
        }
        return false;
    }
}

// Initialize cart when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    window.cart = new BahrNaturalsCart();
    
    // Make cart globally accessible for debugging
    if (typeof window !== 'undefined') {
        window.BahrNaturalsCart = BahrNaturalsCart;
    }
});

// Export for module environments
if (typeof module !== 'undefined' && module.exports) {
    module.exports = BahrNaturalsCart;
}
