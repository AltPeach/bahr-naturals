// Cart Management for Bahr Naturals
// Handles adding/removing items, cart persistence, and checkout preparation

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
    
    // Load cart from memory (since localStorage is not available)
    loadCart() {
        // In a real implementation, this would load from localStorage
        // For now, we'll use a session-based cart
        if (window.cartData) {
            this.items = window.cartData;
        }
    }
    
    // Save cart to memory
    saveCart() {
        window.cartData = this.items;
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
    }
    
    // Handle add to cart
    handleAddToCart(button) {
        const productData = {
            id: button.dataset.productId,
            name: button.dataset.productName,
            price: parseFloat(button.dataset.productPrice),
            image: button.dataset.productImage || '',
            quantity: parseInt(button.dataset.quantity || '1')
        };
        
        if (!productData.id || !productData.name || !productData.price) {
            console.error('Missing product data:', productData);
            this.showMessage('Error adding product to cart', 'error');
            return;
        }
        
        this.addItem(productData);
        this.showMessage(`${productData.name} added to cart!`, 'success');
        
        // Add loading state to button
        button.classList.add('loading');
        button.textContent = 'Added!';
        
        setTimeout(() => {
            button.classList.remove('loading');
            button.textContent = 'Add to Cart';
        }, 1500);
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
                element.style.transform = 'scale(1.2)';
                setTimeout(() => {
                    element.style.transform = 'scale(1)';
                }, 150);
            }
        });
    }
    
    // Update cart page if we're on it
    updateCartPage() {
        const cartContainer = document.querySelector('.cart-items-container');
        const cartSummary = document.querySelector('.cart-summary');
        
        if (cartContainer) {
            this.renderCartItems(cartContainer);
        }
        
        if (cartSummary) {
            this.renderCartSummary(cartSummary);
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
                           min="0" 
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
                    🗑️
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
        
        container.innerHTML = `
            <div class="cart-summary-content">
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
            </div>
        `;
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
        this.items = [];
        this.saveCart();
        this.updateCartDisplay();
    }
    
    // Show message using the global message system
    showMessage(text, type = 'info') {
        if (window.BahrNaturals && window.BahrNaturals.showMessage) {
            window.Ba
