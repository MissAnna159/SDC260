// Fresh Caption - Meme T-Shirt Store
// Products data (at least 10)
const products = [
    { id: 1, name: "Snack Police", price: 9.99, category: "Food", image: "snack-police.avif", description: "Enforcing snack laws one bite at a time." },
    { id: 2, name: "Normal Once", price: 9.99, category: "Internet", image: "normal-once.jpg", description: "I was normal once. It was awful." },
    { id: 3, name: "Act Silly", price: 9.99, category: "Pets", image: "act-silly.avif", description: "Professional silly actor since forever." },
    { id: 4, name: "Own Joke", price: 9.99, category: "Work", image: "own-joke.webp", description: "I own this joke now. You're welcome." },
    { id: 5, name: "Kidding Me", price: 9.99, category: "Internet", image: "kidding-me.webp", description: "Are you kidding me right now?" },
    { id: 6, name: "Monday Mood", price: 9.99, category: "Work", image: "monday-mood.jpg", description: "Send help. It's Monday." },
    { id: 7, name: "Coffee First", price: 9.99, category: "Food", image: "coffee-first.jpg", description: "Do not talk to me before coffee." },
    { id: 8, name: "Gen Z Stare", price: 10.99, category: "Internet", image: "GenZ.avif", description: "GenZ Stare." },
    { id: 9, name: "Ctrl Alt Delete", price: 10.99, category: "Internet", image: "Delete.jpg", description: "When life gives you errors, restart." },
    { id: 10, name: "67", price: 10.99, category: "Internet", image: "67.jpg", description: "67." },
    { id: 11, name: "Error 404", price: 10.99, category: "Internet", image: "Error404.jpg", description: "Motivation not found." },
    { id: 12, name: "Sleep is Optional", price: 10.99, category: "Work", image: "sleep.png", description: "Sleep is Optional." }
];

// Valid coupon codes
const coupons = {
    "MEME10": { type: "percent", value: 10, description: "10% off entire order" },
    "SNACK20": { type: "percent-category", value: 20, category: "Food", description: "20% off Food category items" },
    "SAVE15": { type: "percent", value: 15, description: "15% off entire order" },
    "JOKE5": { type: "percent", value: 5, description: "5% off entire order" }
};

// Cart stored in localStorage
let cart = JSON.parse(localStorage.getItem("freshCaptionCart")) || [];

function saveCart() {
    localStorage.setItem("freshCaptionCart", JSON.stringify(cart));
}

function addToCart(productId, quantity = 1) {
    const product = products.find(p => p.id === productId);
    if (!product) return;
    const existing = cart.find(item => item.id === productId);
    if (existing) {
        existing.quantity += quantity;
    } else {
        cart.push({ ...product, quantity });
    }
    saveCart();
    alert(`${product.name} added to cart!`);
}

function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    saveCart();
    renderCart();
}

function updateQuantity(productId, newQty) {
    const item = cart.find(item => item.id === productId);
    if (item) {
        item.quantity = Math.max(1, parseInt(newQty) || 1);
        saveCart();
        renderCart();
    }
}

function getCartTotal() {
    return cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
}

// Product display using JavaScript loop
function renderProducts(containerId = "product-grid") {
    const container = document.getElementById(containerId);
    if (!container) return;
    container.innerHTML = "";
    // JavaScript looping mechanism
    for (let i = 0; i < products.length; i++) {
        const p = products[i];
        const card = document.createElement("article");
        card.className = "product-card";
        card.innerHTML = `
            <img src="${p.image}" alt="${p.name}">
            <span class="category">${p.category}</span>
            <h3>${p.name}</h3>
            <p class="price">$${p.price.toFixed(2)}</p>
            <p>${p.description}</p>
            <button onclick="addToCart(${p.id})">Add to Cart</button>
        `;
        container.appendChild(card);
    }
}

// Cart display
function renderCart() {
    const container = document.getElementById("cart-items");
    const summary = document.getElementById("cart-summary");
    if (!container) return;
    container.innerHTML = "";
    if (cart.length === 0) {
        container.innerHTML = "<p>Your cart is empty. <a href='ShopPage.html'>Shop now</a></p>";
        if (summary) summary.innerHTML = "";
        return;
    }
    for (let i = 0; i < cart.length; i++) {
        const item = cart[i];
        const div = document.createElement("div");
        div.className = "cart-item";
        div.innerHTML = `
            <div>
                <strong>${item.name}</strong> (${item.category})<br>
                $${item.price.toFixed(2)} x 
                <input type="number" min="1" value="${item.quantity}" style="width:60px" onchange="updateQuantity(${item.id}, this.value)">
            </div>
            <div>
                $${(item.price * item.quantity).toFixed(2)}
                <button onclick="removeFromCart(${item.id})">Remove</button>
            </div>
        `;
        container.appendChild(div);
    }
    const subtotal = getCartTotal();
    const shipping = subtotal >= 50 ? 0 : 5.00;
    const total = subtotal + shipping;
    if (summary) {
        summary.innerHTML = `
            <p>Subtotal: $${subtotal.toFixed(2)}</p>
            <p>Shipping: $${shipping.toFixed(2)} ${subtotal >= 50 ? "(Free over $50!)" : ""}</p>
            <p><strong>Total: $${total.toFixed(2)}</strong></p>
            <a href="CheckoutPage.html"><button>Proceed to Checkout</button></a>
        `;
    }
}

// ========== VALIDATION FUNCTIONS ==========

function validateRequired(value) {
    return value && value.trim().length > 0;
}

function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

function validatePhone(phone) {
    const cleaned = phone.replace(/\D/g, "");
    return cleaned.length >= 10;
}

function validateCardNumber(num) {
    const cleaned = num.replace(/\s/g, "");
    return /^\d{13,19}$/.test(cleaned);
}

function validateExpiry(exp) {
    const match = exp.match(/^(\d{2})\/(\d{2})$/);
    if (!match) return false;
    const month = parseInt(match[1], 10);
    const year = parseInt(match[2], 10) + 2000;
    if (month < 1 || month > 12) return false;
    const now = new Date();
    const expDate = new Date(year, month, 0);
    return expDate >= now;
}

function validateCVV(cvv) {
    return /^\d{3,4}$/.test(cvv);
}

function validateZip(zip) {
    return /^\d{5}(-\d{4})?$/.test(zip);
}

function showError(fieldId, message) {
    const field = document.getElementById(fieldId);
    if (!field) return;
    field.classList.add("invalid");
    let errorEl = field.nextElementSibling;
    if (!errorEl || !errorEl.classList.contains("error")) {
        errorEl = document.createElement("div");
        errorEl.className = "error";
        field.parentNode.insertBefore(errorEl, field.nextSibling);
    }
    errorEl.textContent = message;
}

function clearError(fieldId) {
    const field = document.getElementById(fieldId);
    if (!field) return;
    field.classList.remove("invalid");
    const errorEl = field.nextElementSibling;
    if (errorEl && errorEl.classList.contains("error")) {
        errorEl.textContent = "";
    }
}

function validateContactForm() {
    let valid = true;
    const name = document.getElementById("contact-name").value;
    const email = document.getElementById("contact-email").value;
    const message = document.getElementById("contact-message").value;

    clearError("contact-name");
    clearError("contact-email");
    clearError("contact-message");

    if (!validateRequired(name)) {
        showError("contact-name", "Full name is required.");
        valid = false;
    }
    if (!validateRequired(email)) {
        showError("contact-email", "Email is required.");
        valid = false;
    } else if (!validateEmail(email)) {
        showError("contact-email", "Please enter a valid email address.");
        valid = false;
    }
    if (!validateRequired(message)) {
        showError("contact-message", "Message is required.");
        valid = false;
    }
    return valid;
}

function validateShippingForm() {
    let valid = true;
    const fields = [
        { id: "ship-name", validator: validateRequired, msg: "Full name is required." },
        { id: "ship-street", validator: validateRequired, msg: "Street address is required." },
        { id: "ship-city", validator: validateRequired, msg: "City is required." },
        { id: "ship-state", validator: validateRequired, msg: "State is required." },
        { id: "ship-zip", validator: validateZip, msg: "Valid ZIP code is required (e.g. 12345)." },
        { id: "ship-phone", validator: validatePhone, msg: "Valid phone number is required." }
    ];
    fields.forEach(f => {
        clearError(f.id);
        const val = document.getElementById(f.id).value;
        if (!f.validator(val)) {
            showError(f.id, f.msg);
            valid = false;
        }
    });
    return valid;
}

function validatePurchaseForm() {
    let valid = true;
    const fields = [
        { id: "card-name", validator: validateRequired, msg: "Cardholder name is required." },
        { id: "card-number", validator: validateCardNumber, msg: "Valid credit card number is required (13-19 digits)." },
        { id: "card-exp", validator: validateExpiry, msg: "Valid expiration date (MM/YY) is required." },
        { id: "card-cvv", validator: validateCVV, msg: "Valid security code (3-4 digits) is required." }
    ];
    fields.forEach(f => {
        clearError(f.id);
        const val = document.getElementById(f.id).value;
        if (!f.validator(val)) {
            showError(f.id, f.msg);
            valid = false;
        }
    });
    return valid;
}

// ========== DISCOUNT FUNCTION ==========

let appliedCoupon = null;

function applyDiscount() {
    const codeInput = document.getElementById("coupon-code");
    const code = codeInput ? codeInput.value.trim().toUpperCase() : "";
    const resultEl = document.getElementById("discount-result");
    if (!code) {
        if (resultEl) resultEl.textContent = "Please enter a coupon code.";
        return;
    }
    const coupon = coupons[code];
    if (!coupon) {
        appliedCoupon = null;
        if (resultEl) resultEl.innerHTML = "<span class='error'>Invalid coupon code. Try MEME10, SNACK20, or SAVE15.</span>";
        updateCheckoutTotal();
        return;
    }
    appliedCoupon = { code, ...coupon };
    if (resultEl) resultEl.innerHTML = `<span class="success">Coupon applied: ${coupon.description}</span>`;
    updateCheckoutTotal();
}

function calculateDiscount(subtotal) {
    if (!appliedCoupon) return 0;
    if (appliedCoupon.type === "percent") {
        return subtotal * (appliedCoupon.value / 100);
    }
    if (appliedCoupon.type === "percent-category") {
        const categoryTotal = cart
            .filter(item => item.category === appliedCoupon.category)
            .reduce((sum, item) => sum + item.price * item.quantity, 0);
        return categoryTotal * (appliedCoupon.value / 100);
    }
    return 0;
}

function updateCheckoutTotal() {
    const subtotal = getCartTotal();
    const discount = calculateDiscount(subtotal);
    const afterDiscount = subtotal - discount;
    const shipping = afterDiscount >= 50 ? 0 : 5.00;
    const total = afterDiscount + shipping;
    const summary = document.getElementById("order-summary");
    if (summary) {
        summary.innerHTML = `
            <p>Subtotal: $${subtotal.toFixed(2)}</p>
            ${discount > 0 ? `<p class="discount-applied">Discount (${appliedCoupon.code}): -$${discount.toFixed(2)}</p>` : ""}
            <p>Shipping: $${shipping.toFixed(2)}</p>
            <p><strong>Total: $${total.toFixed(2)}</strong></p>
        `;
    }
}

function placeOrder(event) {
    event.preventDefault();
    const shipValid = validateShippingForm();
    const purchaseValid = validatePurchaseForm();
    if (shipValid && purchaseValid) {
        // Clear cart after "order"
        localStorage.removeItem("freshCaptionCart");
        cart = [];
        window.location.href = "OrderConfirmation.html";
    } else {
        alert("Please fix the errors in the form before placing your order.");
    }
}

function submitContact(event) {
    event.preventDefault();
    if (validateContactForm()) {
        alert("Thank you for your message! We'll get back to you soon.");
        document.getElementById("contact-form").reset();
    }
}

// Initialize on page load
document.addEventListener("DOMContentLoaded", function() {
    if (document.getElementById("product-grid")) {
        renderProducts();
    }
    if (document.getElementById("cart-items")) {
        renderCart();
    }
    if (document.getElementById("order-summary")) {
        updateCheckoutTotal();
    }
});
