// script.js

// Function to get the cart from local storage
function getCart() {
    const cartData = localStorage.getItem('cart');
    return cartData ? JSON.parse(cartData) : [];
}

// Function to save the cart to local storage
function saveCart(cart) {
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCountHeader();
}

// Function to add an item to the cart
function addToCart(product) {
    const cart = getCart();
    const existingItem = cart.find(item => item.name === product.name);

    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({ ...product, quantity: 1 });
    }

    saveCart(cart);
    alert(`${product.name} added to cart!`); // Basic feedback
}

// Function to update the cart count in the header
function updateCartCountHeader() {
    const cart = getCart();
    const totalQuantity = cart.reduce((sum, item) => sum + item.quantity, 0);
    const cartCountHeader = document.getElementById('cart-count-header');
    if (cartCountHeader) {
        cartCountHeader.textContent = totalQuantity;
    }
}

// Function to display the cart items on the cart page
function displayCart() {
    const cartList = document.getElementById('cart-list');
    const totalPriceElement = document.getElementById('total-price');
    const cart = getCart();

    if (cartList && totalPriceElement) {
        cartList.innerHTML = ''; // Clear the current list
        let total = 0;

        if (cart.length === 0) {
            cartList.innerHTML = '<p>Your cart is empty.</p>';
            totalPriceElement.textContent = '0';
            return;
        }

        cart.forEach(item => {
            const listItem = document.createElement('li');
            listItem.innerHTML = `
                <div class="cart-item-details">
                    <img src="${item.image}" alt="${item.name}">
                    <div class="cart-item-info">
                        <h4 class="cart-item-name">${item.name}</h4>
                        <p class="cart-item-price">₹${item.price}</p>
                    </div>
                </div>
                <div class="cart-item-price">₹${item.price}</div>
                <div class="cart-item-quantity">
                    <button onclick="decreaseQuantity('${item.name}')">-</button>
                    <span>${item.quantity}</span>
                    <button onclick="increaseQuantity('${item.name}')">+</button>
                </div>
                <div class="cart-item-total">₹${(item.price * item.quantity).toFixed(2)}</div>
                <button class="cart-item-remove-btn" onclick="removeItem('${item.name}')">×</button>
            `;
            cartList.appendChild(listItem);
            total += item.price * item.quantity;
        });

        totalPriceElement.textContent = total.toFixed(2);
    }
}

// Function to increase the quantity of an item in the cart
function increaseQuantity(itemName) {
    const cart = getCart();
    const item = cart.find(item => item.name === itemName);
    if (item) {
        item.quantity += 1;
        saveCart(cart);
        displayCart();
    }
}

// Function to decrease the quantity of an item in the cart
function decreaseQuantity(itemName) {
    const cart = getCart();
    const item = cart.find(item => item.name === itemName);
    if (item) {
        item.quantity -= 1;
        if (item.quantity <= 0) {
            removeItem(itemName);
        } else {
            saveCart(cart);
            displayCart();
        }
    }
}

// Function to remove an item from the cart
function removeItem(itemName) {
    let cart = getCart();
    cart = cart.filter(item => item.name !== itemName);
    saveCart(cart);
    displayCart();
}

// Function to clear the entire cart
function clearCart() {
    localStorage.removeItem('cart');
    updateCartCountHeader();
    if (document.getElementById('cart-list')) {
        document.getElementById('cart-list').innerHTML = '<p>Your cart is empty.</p>';
    }
    if (document.getElementById('total-price')) {
        document.getElementById('total-price').textContent = '0';
    }
}

// Event listeners for "Add to Cart" buttons on the product page
document.addEventListener('DOMContentLoaded', () => {
    const addToCartButtons = document.querySelectorAll('.product .add-to-cart-btn');
    addToCartButtons.forEach(button => {
        button.addEventListener('click', function() {
            const product = {
                name: this.dataset.name,
                price: parseFloat(this.dataset.price),
                image: this.dataset.image // Assuming you have a data-image attribute
            };
            addToCart(product);
        });
    });

    // Initial call to update cart count on page load
    updateCartCountHeader();

    // If on the cart page, display the cart items
    if (document.getElementById('cart-list')) {
        displayCart();
    }
});