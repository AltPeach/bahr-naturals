<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Bahr Naturals - Cart Fix Demo</title>
    <style>
        :root {
            --color-primary: #5D8A7E;
            --color-accent: #D7B89C;
            --color-background-light: #FDFBF8;
            --color-text-primary: #444444;
            --color-text-secondary: #6B7280;
            --color-white: #FFFFFF;
            --color-light-gray: #F8F9FA;
            --color-medium-gray: #E9ECEF;
            --color-success: #4CAF50;
            
            --font-heading: 'Plus Jakarta Sans', sans-serif;
            --font-body: 'Inter', sans-serif;
            --font-accent: 'Itim', cursive;
            
            --spacing-xs: 0.25rem;
            --spacing-sm: 0.5rem;
            --spacing-md: 1rem;
            --spacing-lg: 1.5rem;
            --spacing-xl: 2rem;
            --spacing-xxl: 3rem;
            
            --radius-sm: 4px;
            --radius-md: 8px;
            --radius-lg: 12px;
            --radius-xl: 16px;
            
            --shadow-light: 0 2px 12px rgba(0, 0, 0, 0.08);
            --shadow-medium: 0 4px 20px rgba(0, 0, 0, 0.12);
        }
        
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: var(--font-body);
            font-size: 16px;
            line-height: 1.6;
            color: var(--color-text-primary);
            background-color: var(--color-background-light);
            padding: var(--spacing-md);
        }
        
        .container {
            max-width: 1200px;
            margin: 0 auto;
            padding: var(--spacing-md);
        }
        
        .header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: var(--spacing-md) 0;
            border-bottom: 1px solid var(--color-medium-gray);
            margin-bottom: var(--spacing-xl);
        }
        
        .logo {
            font-family: var(--font-heading);
            font-size: 1.75rem;
            font-weight: 700;
            color: var(--color-primary);
            text-decoration: none;
        }
        
        .nav {
            display: flex;
            gap: var(--spacing-xl);
        }
        
        .nav-link {
            text-decoration: none;
            color: var(--color-text-primary);
            font-weight: 500;
            padding: var(--spacing-sm) var(--spacing-md);
            border-radius: var(--radius-md);
            transition: all 0.3s ease;
        }
        
        .nav-link:hover,
        .nav-link.active {
            color: var(--color-primary);
            background: rgba(93, 138, 126, 0.05);
        }
        
        .cart-link {
            display: flex;
            align-items: center;
            text-decoration: none;
            color: var(--color-primary);
            padding: var(--spacing-sm);
            position: relative;
        }
        
        .cart-icon {
            font-size: 1.25rem;
            margin-right: var(--spacing-sm);
        }
        
        .cart-count {
            background: var(--color-accent);
            color: white;
            border-radius: 50%;
            padding: var(--spacing-xs) var(--spacing-sm);
            font-size: 0.75rem;
            font-weight: 600;
            min-width: 1.5rem;
            text-align: center;
            display: none;
        }
        
        .cart-count.has-items {
            display: inline-block;
        }
        
        .btn {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            padding: var(--spacing-md) var(--spacing-xl);
            border: none;
            border-radius: var(--radius-md);
            text-decoration: none;
            font-weight: 600;
            font-size: 1rem;
            cursor: pointer;
            transition: all 0.3s ease;
            text-align: center;
            gap: var(--spacing-sm);
        }
        
        .btn-primary {
            background: var(--color-primary);
            color: white;
            box-shadow: var(--shadow-light);
        }
        
        .btn-primary:hover {
            background: #4C7267;
            transform: translateY(-2px);
            box-shadow: var(--shadow-medium);
        }
        
        .btn-secondary {
            background: transparent;
            color: var(--color-primary);
            border: 2px solid var(--color-primary);
        }
        
        .btn-secondary:hover {
            background: var(--color-primary);
            color: white;
            transform: translateY(-2px);
        }
        
        .section {
            margin-bottom: var(--spacing-xxl);
        }
        
        .section-title {
            font-family: var(--font-heading);
            font-size: 1.5rem;
            color: var(--color-primary);
            margin-bottom: var(--spacing-lg);
        }
        
        .products-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
            gap: var(--spacing-xl);
            margin-bottom: var(--spacing-xl);
        }
        
        .product-card {
            background: var(--color-white);
            border-radius: var(--radius-lg);
            padding: var(--spacing-lg);
            box-shadow: var(--shadow-light);
            transition: all 0.3s ease;
        }
        
        .product-card:hover {
            transform: translateY(-5px);
            box-shadow: var(--shadow-medium);
        }
        
        .product-image {
            width: 100%;
            height: 200px;
            background: linear-gradient(135deg, var(--color-primary) 0%, var(--color-accent) 100%);
            border-radius: var(--radius-md);
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-family: var(--font-heading);
            margin-bottom: var(--spacing-md);
        }
        
        .product-name {
            font-family: var(--font-heading);
            font-size: 1.25rem;
            color: var(--color-primary);
            margin-bottom: var(--spacing-sm);
        }
        
        .product-price {
            font-size: 1.125rem;
            font-weight: 700;
            color: var(--color-accent);
            margin-bottom: var(--spacing-md);
        }
        
        .product-actions {
            display: flex;
            gap: var(--spacing-sm);
            align-items: center;
        }
        
        .quantity-input {
            width: 60px;
            padding: var(--spacing-sm);
            border: 1px solid var(--color-medium-gray);
            border-radius: var(--radius-sm);
            text-align: center;
        }
        
        .cart-items {
            background: var(--color-white);
            border-radius: var(--radius-lg);
            padding: var(--spacing-xl);
            box-shadow: var(--shadow-light);
            margin-bottom: var(--spacing-xl);
        }
        
        .cart-item {
            display: grid;
            grid-template-columns: 80px 1fr auto auto auto;
            gap: var(--spacing-md);
            align-items: center;
            padding: var(--spacing-lg) 0;
            border-bottom: 1px solid var(--color-medium-gray);
        }
        
        .cart-item:last-child {
            border-bottom: none;
        }
        
        .item-image {
            width: 80px;
            height: 80px;
            background: linear-gradient(135deg, var(--color-primary) 0%, var(--color-accent) 100%);
            border-radius: var(--radius-md);
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-size: 0.875rem;
        }
        
        .item-name {
            font-family: var(--font-heading);
            font-size: 1.125rem;
            color: var(--color-primary);
        }
        
        .item-price {
            color: var(--color-text-secondary);
            font-weight: 500;
        }
        
        .item-quantity {
            display: flex;
            align-items: center;
            gap: var(--spacing-sm);
        }
        
        .quantity-btn {
            width: 32px;
            height: 32px;
            border: 1px solid var(--color-medium-gray);
            background: var(--color-white);
            border-radius: var(--radius-sm);
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            font-weight: 700;
        }
        
        .quantity-btn:hover {
            border-color: var(--color-accent);
            background: var(--color-accent);
            color: var(--color-white);
        }
        
        .item-total {
            font-weight: 700;
            color: var(--color-primary);
            font-size: 1.125rem;
        }
        
        .remove-item {
            background: none;
            border: none;
            font-size: 1.2rem;
            cursor: pointer;
            padding: var(--spacing-sm);
            border-radius: var(--radius-sm);
            color: var(--color-text-secondary);
        }
        
        .remove-item:hover {
            background: rgba(255, 107, 107, 0.1);
            color: #ff6b6b;
        }
        
        .cart-summary {
            background: var(--color-white);
            border-radius: var(--radius-lg);
            padding: var(--spacing-xl);
            box-shadow: var(--shadow-light);
        }
        
        .summary-line {
            display: flex;
            justify-content: space-between;
            margin-bottom: var(--spacing-md);
            padding-bottom: var(--spacing-md);
            border-bottom: 1px solid var(--color-medium-gray);
        }
        
        .total-line {
            border-top: 2px solid var(--color-medium-gray);
            padding-top: var(--spacing-md);
            font-size: 1.125rem;
            font-weight: 700;
        }
        
        .checkout-btn {
            width: 100%;
            margin-top: var(--spacing-lg);
            padding: var(--spacing-md);
            font-size: 1.125rem;
            font-weight: 600;
        }
        
        .empty-cart {
            text-align: center;
            padding: var(--spacing-xxl) var(--spacing-xl);
        }
        
        .empty-cart h3 {
            color: var(--color-primary);
            margin-bottom: var(--spacing-md);
            font-size: 1.75rem;
            font-family: var(--font-heading);
        }
        
        .empty-cart p {
            color: var(--color-text-secondary);
            margin-bottom: var(--spacing-lg);
        }
        
        .global-message {
            position: fixed;
            top: 20px;
            right: 20px;
            padding: var(--spacing-md) var(--spacing-lg);
            border-radius: var(--radius-md);
            color: white;
            font-weight: 500;
            z-index: 10000;
            display: flex;
            align-items: center;
            gap: var(--spacing-md);
            transform: translateX(100%);
            transition: transform 0.3s ease;
            box-shadow: var(--shadow-medium);
        }
        
        .global-message.show {
            transform: translateX(0);
        }
        
        .global-message.success {
            background: var(--color-success);
        }
        
        .global-message.info {
            background: var(--color-primary);
        }
        
        .global-message.error {
            background: #ff6b6b;
        }
        
        .message-close {
            background: none;
            border: none;
            color: white;
            font-size: 1.2rem;
            cursor: pointer;
            padding: 0;
        }
        
        @media (max-width: 768px) {
            .cart-item {
                grid-template-columns: 60px 1fr;
                gap: var(--spacing-md);
            }
            
            .item-quantity,
            .item-total {
                grid-column: 1 / -1;
                justify-self: start;
                margin-top: var(--spacing-md);
            }
            
            .remove-item {
                grid-column: 1 / -1;
                justify-self: end;
                margin-top: -2rem;
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <!-- Header -->
        <header class="header">
            <a href="index.html" class="logo">Bahr Naturals</a>
            <nav class="nav">
                <a href="index.html" class="nav-link">Home</a>
                <a href="shop.html" class="nav-link active">Shop</a>
                <a href="about.html" class="nav-link">Our Story</a>
                <a href="cart.html" class="cart-link">
                    <span class="cart-icon">🛒</span>
                    <span class="cart-count" id="cart-count">0</span>
                </a>
            </nav>
        </header>

        <main>
            <!-- Shop Page Content -->
            <section class="section">
                <h2 class="section-title">Our Handcrafted Soaps</h2>
                <div class="products-grid">
                    <!-- Product 1 -->
                    <div class="product-card">
                        <div class="product-image">Nile Essence</div>
                        <h3 class="product-name">Nile Essence</h3>
                        <div class="product-price">$18.00 CAD</div>
                        <div class="product-actions">
                            <input type="number" class="quantity-input" value="1" min="1" max="10" data-product-id="nile-essence">
                            <button class="btn btn-primary add-to-cart" data-product-id="nile-essence" data-product-name="Nile Essence" data-product-price="18.00">Add to Cart</button>
                        </div>
                    </div>

                    <!-- Product 2 -->
                    <div class="product-card">
                        <div class="product-image">Heritage Honey</div>
                        <h3 class="product-name">Heritage Honey</h3>
                        <div class="product-price">$16.00 CAD</div>
                        <div class="product-actions">
                            <input type="number" class="quantity-input" value="1" min="1" max="10" data-product-id="heritage-honey">
                            <button class="btn btn-primary add-to-cart" data-product-id="heritage-honey" data-product-name="Heritage Honey" data-product-price="16.00">Add to Cart</button>
                        </div>
                    </div>

                    <!-- Product 3 -->
                    <div class="product-card">
                        <div class="product-image">Cultural Clay</div>
                        <h3 class="product-name">Cultural Clay</h3>
                        <div class="product-price">$20.00 CAD</div>
                        <div class="product-actions">
                            <input type="number" class="quantity-input" value="1" min="1" max="10" data-product-id="cultural-clay">
                            <button class="btn btn-primary add-to-cart" data-product-id="cultural-clay" data-product-name="Cultural Clay" data-product-price="20.00">Add to Cart</button>
                        </div>
                    </div>
                </div>
            </section>

            <!-- Cart Preview -->
            <section class="section">
                <h2 class="section-title">Your Cart Preview</h2>
                <div class="cart-items" id="cart-preview">
                    <div class="empty-cart">
                        <h3>Your cart is empty</h3>
                        <p>Add some products to see them here</p>
                    </div>
                </div>
            </section>
        </main>
    </div>

    <script>
        // Enhanced Cart Management Class
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
                this.updateCartPreview();
            }
            
            // Update cart count in header
            updateCartCount() {
                const cartCountElements = document.querySelectorAll('.cart-count');
                const count = this.getItemCount();
                
                cartCountElements.forEach(element => {
                    element.textContent = count;
                    
                    // Add animation when count changes
                    if (count > 0) {
                        element.classList.add('has-items');
                        element.classList.add('cart-updated');
                        setTimeout(() => {
                            element.classList.remove('cart-updated');
                        }, 500);
                    } else {
                        element.classList.remove('has-items');
                    }
                });
            }
            
            // Update cart preview
            updateCartPreview() {
                const cartPreview = document.getElementById('cart-preview');
                if (!cartPreview) return;
                
                if (this.items.length === 0) {
                    cartPreview.innerHTML = `
                        <div class="empty-cart">
                            <h3>Your cart is empty</h3>
                            <p>Add some products to see them here</p>
                        </div>
                    `;
                    return;
                }
                
                // Render cart items
                const itemsHTML = this.items.map(item => `
                    <div class="cart-item" data-product-id="${item.id}">
                        <div class="item-image">${item.name.substring(0, 2)}</div>
                        <div class="item-details">
                            <h4 class="item-name">${item.name}</h4>
                            <div class="item-price">$${item.price.toFixed(2)} CAD</div>
                        </div>
                        <div class="item-quantity">
                            <button class="quantity-btn decrease-quantity" data-product-id="${item.id}">-</button>
                            <input type="number" value="${item.quantity}" min="1" class="quantity-input" data-product-id="${item.id}">
                            <button class="quantity-btn increase-quantity" data-product-id="${item.id}">+</button>
                        </div>
                        <div class="item-total">
                            $${(item.price * item.quantity).toFixed(2)} CAD
                        </div>
                        <button class="remove-item" data-product-id="${item.id}">×</button>
                    </div>
                `).join('');
                
                cartPreview.innerHTML = itemsHTML;
                
                // Add event listeners to the new elements
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
                const productId = button.dataset.productId;
                const productName = button.dataset.productName;
                const productPrice = parseFloat(button.dataset.productPrice);
                
                // Get quantity from the input field next to the button
                const quantityInput = button.parentElement.querySelector('.quantity-input');
                const quantity = quantityInput ? parseInt(quantityInput.value) || 1 : 1;
                
                const productData = {
                    id: productId,
                    name: productName,
                    price: productPrice,
                    quantity: quantity
                };
                
                this.addItem(productData);
                
                // Reset quantity input to 1 after adding to cart
                if (quantityInput) {
                    quantityInput.value = 1;
                }
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
    </script>
</body>
</html>
