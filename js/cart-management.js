// cart-management.js
// Complete implementation for Bahr Naturals shopping cart

class BahrNaturalsCart {
    constructor() {
        this.items = [];
        this.init();
    }
    
    init() {
        this.loadCart();
        this.bindEvents();
        this.updateCartDisplay();
    }
    
    // Load cart from localStorage
    loadCart() {
        try {
            const cartData = localStorage.getItem('bahrNaturalsCart');
            if (cartData) {
                this.items = JSON.parse(cartData);
            }
        } catch (error) {
            console.error('Error loading cart from localStorage:', error);
            this.items = [];
        }
    }
    
    // Save cart to localStorage
    saveCart() {
        try {
            localStorage.setItem('bahrNaturalsCart', JSON.stringify(this.items));
        } catch (error) {
            console.error('Error saving cart to localStorage:', error);
        }
    }
    
    // Bind event handlers
    bindEvents() {
        // Add to cart buttons
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('add-to-cart')) {
                e.preventDefault();
                this.handleAddToCart(e.target);
            }
            
            if (e.target.classList.contains('remove-from-cart')) {
                e.preventDefault();
                this.handleRemoveFromCart(e.target);
            }
            
            if (e.target.classList.contains('update-quantity')) {
                this.handleQuantityUpdate(e.target);
            }
        });
        
        // Quantity input changes
        document.addEventListener('change', (e) => {
            if (e.target.classList.contains('quantity-input')) {
                this.handleQuantityChange(e.target);
            }
        });
        
        // Clear cart button
        const clearCartBtn = document.querySelector('.clear-cart');
        if (clearCartBtn) {
            clearCartBtn.addEventListener('click', () => {
                this.clearCart();
            });
        }
    }
    
    // Handle add to cart
    handleAddToCart(button) {
        const productData = {
            id: button.dataset.productId || this.generateProductId(button),
            name: button.dataset.productName || this.getProductName(button),
            price: parseFloat(button.dataset.productPrice || this.getProductPrice(button)),
            image: button.dataset.productImage || '',
            quantity: parseInt(button.dataset.quantity || '1')
        };
        
        if (!productData.id || !productData.name || isNaN(productData.price)) {
            console.error('Missing product data:', productData);
            this.showMessage('Error adding product to cart', 'error');
            return;
        }
        
        this.addItem(productData);
        this.showMessage(`${productData.name} added to cart!`, 'success');
        
        // Add loading state to button
        const originalText = button.textContent;
        button.classList.add('loading');
        button.textContent = 'Added!';
        
        setTimeout(() => {
            button.classList.remove('loading');
            button.textContent = originalText;
        }, 1500);
    }
    
    // Generate product ID if not provided
    generateProductId(button) {
        const productCard = button.closest('.product-card, .gift-set-card');
        if (productCard) {
            const nameElement = productCard.querySelector('.product-name, .set-name');
            if (nameElement) {
                return 'product-' + nameElement.textContent.toLowerCase().replace(/\s+/g, '-');
            }
        }
        return 'product-' + Date.now();
    }
    
    // Get product name if not provided
    getProductName(button) {
        const productCard = button.closest('.product-card, .gift-set-card');
        if (productCard) {
            const nameElement = productCard.querySelector('.product-name, .set-name');
            if (nameElement) {
                return nameElement.textContent;
            }
        }
        return 'Unknown Product';
    }
    
    // Get product price if not provided
    getProductPrice(button) {
        const productCard = button.closest('.product-card, .gift-set-card');
        if (productCard) {
            const priceElement = productCard.querySelector('.product-price, .sale-price');
            if (priceElement) {
                const priceText = priceElement.textContent.replace(/[^0-9.]/g, '');
                return parseFloat(priceText) || 0;
            }
        }
        return 0;
    }
    
    // Add item to cart
    addItem(product) {
        const existingItem = this.items.find(item => item.id === product.id);
        
        if (existingItem) {
            existingItem.quantity += product.quantity;
        } else {
            this.items.push({ ...product });
        }
        
        this.saveCart();
        this.updateCartDisplay();
    }
    
    // Remove item from cart
    removeItem(productId) {
        this.items = this.items.filter(item => item.id !== productId);
        this.saveCart();
        this.updateCartDisplay();
    }
    
    // Update item quantity
    updateQuantity(productId, quantity) {
        const item = this.items.find(item => item.id === productId);
        if (item) {
            if (quantity <= 0) {
                this.removeItem(productId);
            } else {
                item.quantity = quantity;
                this.saveCart();
                this.updateCartDisplay();
            }
        }
    }
    
    // Handle remove from cart
    handleRemoveFromCart(button) {
        const productId = button.dataset.productId;
        if (productId) {
            this.removeItem(productId);
            this.showMessage('Item removed from cart', 'info');
        }
    }
    
    // Handle quantity updates
    handleQuantityUpdate(button) {
        const productId = button.dataset.productId;
        const action = button.dataset.action;
        const item = this.items.find(item => item.id === productId);
        
        if (item) {
            if (action === 'increase') {
                this.updateQuantity(productId, item.quantity + 1);
            } else if (action === 'decrease') {
                this.updateQuantity(productId, Math.max(0, item.quantity - 1));
            }
        }
    }
    
    // Handle quantity input changes
    handleQuantityChange(input) {
        const productId = input.dataset.productId;
        const quantity = parseInt(input.value) || 0;
        this.updateQuantity(productId, quantity);
    }
    
    // Get cart total
    getTotal() {
        return this.items.reduce((total, item) => {
            return total + (item.price * item.quantity);
        }, 0);
    }
    
    // Get total item count
    getItemCount() {
        return this.items.reduce((count, item) => {
            return count + item.quantity;
        }, 0);
    }
    
    // Update cart display
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
            
            // Add animation
            if (count > 0) {
                element.style.display = 'inline-block';
                element.style.transform = 'scale(1.2)';
                setTimeout(() => {
                    element.style.transform = 'scale(1)';
                }, 150);
            } else {
                element.style.display = 'none';
            }
        });
    }
    
    // Update cart page if we're on it
    updateCartPage() {
        const cartContainer = document.querySelector('.cart-items-container');
        const cartSummary = document.querySelector('.cart-summary');
        const cartActions = document.querySelector('.cart-actions');
        const checkoutBtn = document.querySelector('.checkout-btn');
        
        if (cartContainer) {
            this.renderCartItems(cartContainer);
        }
        
        if (cartSummary) {
            this.renderCartSummary(cartSummary);
        }
        
        // Show/hide cart actions based on cart contents
        if (cartActions && checkoutBtn) {
            if (this.items.length > 0) {
                cartActions.style.display = 'flex';
                checkoutBtn.disabled = false;
            } else {
                cartActions.style.display = 'none';
                checkoutBtn.disabled = true;
            }
        }
    }
    
    // Render cart items
    renderCartItems(container) {
        if (this.items.length === 0) {
            container.innerHTML = `
                <div class="empty-cart">
                    <h3>Your cart is empty</h3>
                    <p>Start shopping to add items to your cart.</p>
                    <a href="shop.html" class="btn btn-primary">Shop Now</a>
                </div>
            `;
            return;
        }
        
        const itemsHTML = this.items.map(item => `
            <div class="cart-item" data-product-id="${item.id}">
                <div class="item-image">
                    <img src="${item.image || 'images/products/placeholder.jpg'}" 
                         alt="${item.name}" 
                         loading="lazy">
                </div>
                <div class="item-details">
                    <h4 class="item-name">${item.name}</h4>
                    <div class="item-price">$${item.price.toFixed(2)} CAD</div>
                </div>
                <div class="item-quantity">
                    <button class="quantity-btn update-quantity" 
                            data-product-id="${item.id}" 
                            data-action="decrease"
                            aria-label="Decrease quantity">-</button>
                    <input type="number" 
                           value="${item.quantity}" 
                           min="1" 
                           class="quantity-input" 
                           data-product-id="${item.id}"
                           aria-label="Quantity">
                    <button class="quantity-btn update-quantity" 
                            data-product-id="${item.id}" 
                            data-action="increase"
                            aria-label="Increase quantity">+</button>
                </div>
                <div class="item-total">
                    $${(item.price * item.quantity).toFixed(2)} CAD
                </div>
                <button class="remove-item remove-from-cart" 
                        data-product-id="${item.id}"
                        aria-label="Remove item">
                    ×
                </button>
            </div>
        `).join('');
        
        container.innerHTML = itemsHTML;
    }
    
    // Render cart summary
    renderCartSummary(container) {
        const subtotal = this.getTotal();
        const shipping = this.calculateShipping();
        const taxes = this.calculateTaxes(subtotal);
        const total = subtotal + shipping + taxes;
        
        const summaryHTML = `
            <h3>Order Summary</h3>
            <div class="summary-line">
                <span>Subtotal (${this.getItemCount()} items)</span>
                <span>$${subtotal.toFixed(2)} CAD</span>
            </div>
            <div class="summary-line">
                <span>Shipping</span>
                <span>${shipping > 0 ? '$' + shipping.toFixed(2) + ' CAD' : 'Free'}</span>
            </div>
            <div class="summary-line">
                <span>Taxes (HST)</span>
                <span>$${taxes.toFixed(2)} CAD</span>
            </div>
            <div class="summary-line total-line">
                <span><strong>Total</strong></span>
                <span><strong>$${total.toFixed(2)} CAD</strong></span>
            </div>
            <button class="btn btn-primary checkout-btn" onclick="cart.proceedToCheckout()">
                Proceed to Checkout
            </button>
            <div class="shipping-note">
                <small>Free shipping on orders over $50 CAD</small>
            </div>
        `;
        
        // Only update if the content has changed to prevent flickering
        if (container.innerHTML !== summaryHTML) {
            container.innerHTML = summaryHTML;
        }
    }
    
    // Calculate shipping
    calculateShipping() {
        const subtotal = this.getTotal();
        return subtotal >= 50 ? 0 : 8.99; // Free shipping over $50
    }
    
    // Calculate taxes (simplified Canadian HST)
    calculateTaxes(subtotal) {
        return subtotal * 0.13; // 13% HST
    }
    
    // Proceed to checkout
    proceedToCheckout() {
        if (this.items.length === 0) {
            this.showMessage('Your cart is empty', 'error');
            return;
        }
        
        // Store checkout data for checkout page
        window.checkoutData = {
            items: [...this.items],
            subtotal: this.getTotal(),
            shipping: this.calculateShipping(),
            taxes: this.calculateTaxes(this.getTotal()),
            total: this.getTotal() + this.calculateShipping() + this.calculateTaxes(this.getTotal())
        };
        
        // Redirect to checkout
        window.location.href = 'checkout.html';
    }
    
    // Clear cart
    clearCart() {
        if (confirm('Are you sure you want to clear your cart?')) {
            this.items = [];
            this.saveCart();
            this.updateCartDisplay();
            this.showMessage('Cart cleared', 'info');
        }
    }
    
    // Show message using the global message system
    showMessage(text, type = 'info') {
        if (window.BahrNaturals && window.BahrNaturals.showMessage) {
            window.BahrNaturals.showMessage(text, type);
        } else {
            // Fallback message display
            alert(`${type.toUpperCase()}: ${text}`);
        }
    }
}

// Initialize cart when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    window.cart = new BahrNaturalsCart();
});
