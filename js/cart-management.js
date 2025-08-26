// cart-management.js - Enhanced Version
class BahrNaturalsCart {
    constructor() {
        this.items = [];
        this.storageKey = 'bahrNaturalsCart';
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
            const cartData = localStorage.getItem(this.storageKey);
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
            localStorage.setItem(this.storageKey, JSON.stringify(this.items));
        } catch (error) {
            console.error('Error saving cart to localStorage:', error);
        }
    }
    
    // Add item to cart
    addItem(product) {
        const existingItem = this.items.find(item => item.id === product.id);
        
        if (existingItem) {
            existingItem.quantity += product.quantity || 1;
        } else {
            this.items.push({
                id: product.id,
                name: product.name,
                price: product.price,
                image: product.image || '',
                quantity: product.quantity || 1
            });
        }
        
        this.saveCart();
        this.updateCartDisplay();
        this.showMessage(`${product.name} added to cart!`, 'success');
    }
    
    // Remove item from cart
    removeItem(productId) {
        this.items = this.items.filter(item => item.id !== productId);
        this.saveCart();
        this.updateCartDisplay();
        this.showMessage('Item removed from cart', 'info');
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
            
            // Add animation when count changes
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
                    <p>Start shopping to add items to your cart.</p>
                    <a href="shop.html" class="btn btn-primary">Shop Now</a>
                </div>
            `;
            return;
        }
        
        // Render cart items
        const itemsHTML = this.items.map(item => `
            <div class="cart-item" data-product-id="${item.id}">
                <div class="item-image">
                    <img src="${item.image || 'images/placeholder.jpg'}" 
                         alt="${item.name}" 
                         loading="lazy">
                </div>
                <div class="item-details">
                    <h4 class="item-name">${item.name}</h4>
                    <div class="item-price">$${item.price.toFixed(2)} CAD</div>
                </div>
                <div class="item-quantity">
                    <button class="quantity-btn decrease-quantity" 
                            data-product-id="${item.id}"
                            aria-label="Decrease quantity">-</button>
                    <input type="number" 
                           value="${item.quantity}" 
                           min="1" 
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
                        aria-label="Remove item">
                    ×
                </button>
            </div>
        `).join('');
        
        cartContainer.innerHTML = itemsHTML;
        
        // Update cart summary
        if (cartSummary) {
            const subtotal = this.getTotal();
            const shipping = subtotal >= 50 ? 0 : 8.99;
            const tax = subtotal * 0.13; // 13% tax
            const total = subtotal + shipping + tax;
            
            cartSummary.innerHTML = `
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
                    <span>Tax (13%)</span>
                    <span>$${tax.toFixed(2)} CAD</span>
                </div>
                <div class="summary-line total-line">
                    <span><strong>Total</strong></span>
                    <span><strong>$${total.toFixed(2)} CAD</strong></span>
                </div>
                <button class="btn btn-primary checkout-btn">
                    Proceed to Checkout
                </button>
                <div class="shipping-note">
                    <small>Free shipping on orders over $50 CAD</small>
                </div>
            `;
        }
        
        // Bind events for the new elements
        this.bindCartEvents();
    }
    
    // Bind events to cart elements
    bindCartEvents() {
        // Quantity buttons
        document.querySelectorAll('.increase-quantity').forEach(button => {
            button.addEventListener('click', (e) => {
                const productId = e.target.dataset.productId;
                const item = this.items.find(item => item.id === productId);
                if (item) {
                    this.updateQuantity(productId, item.quantity + 1);
                }
            });
        });
        
        document.querySelectorAll('.decrease-quantity').forEach(button => {
            button.addEventListener('click', (e) => {
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
                const quantity = parseInt(e.target.value) || 1;
                this.updateQuantity(productId, quantity);
            });
        });
        
        // Remove buttons
        document.querySelectorAll('.remove-item').forEach(button => {
            button.addEventListener('click', (e) => {
                const productId = e.target.dataset.productId;
                this.removeItem(productId);
            });
        });
    }
    
    // Bind events to add-to-cart buttons
    bindEvents() {
        // Add to cart buttons
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('add-to-cart')) {
                e.preventDefault();
                this.handleAddToCart(e.target);
            }
        });
    }
    
    // Handle add to cart button click
    handleAddToCart(button) {
        const productCard = button.closest('.product-card, .gift-set-card');
        if (!productCard) return;
        
        const productId = button.dataset.productId || 
                         this.generateId(productCard.querySelector('.product-name, .set-name').textContent);
        
        const productData = {
            id: productId,
            name: productCard.querySelector('.product-name, .set-name').textContent,
            price: this.parsePrice(productCard.querySelector('.product-price, .sale-price').textContent),
            image: button.dataset.productImage || ''
        };
        
        this.addItem(productData);
    }
    
    // Generate a product ID from text
    generateId(text) {
        return text.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, '');
    }
    
    // Parse price from text
    parsePrice(priceText) {
        return parseFloat(priceText.replace(/[^\d.]/g, ''));
    }
    
    // Show message
    showMessage(text, type = 'info') {
        // Create message element
        const message = document.createElement('div');
        message.className = `global-message ${type}`;
        message.innerHTML = `
            <span>${text}</span>
            <button class="message-close">&times;</button>
        `;
        
        // Add to page
        document.body.appendChild(message);
        
        // Show message with animation
        setTimeout(() => {
            message.classList.add('show');
        }, 10);
        
        // Close button
        message.querySelector('.message-close').addEventListener('click', () => {
            message.classList.remove('show');
            setTimeout(() => {
                message.remove();
            }, 300);
        });
        
        // Auto-remove after 3 seconds
        setTimeout(() => {
            if (document.body.contains(message)) {
                message.classList.remove('show');
                setTimeout(() => {
                    message.remove();
                }, 300);
            }
        }, 3000);
    }
}

// Initialize cart when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    window.cart = new BahrNaturalsCart();
});
