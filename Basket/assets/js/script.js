const products = [
    { id: 1, name: 'Minimal fincan', category: 'home', categoryName: 'Ev üçün', price: 18.90, icon: '☕' },
    { id: 2, name: 'Kətan çanta', category: 'style', categoryName: 'Stil', price: 32.50, icon: '👜' },
    { id: 3, name: 'Masa lampası', category: 'home', categoryName: 'Ev üçün', price: 46.00, icon: '💡' },
    { id: 4, name: 'Retro kamera', category: 'tech', categoryName: 'Texnologiya', price: 89.90, icon: '📷' },
    { id: 5, name: 'Aroma şamı', category: 'home', categoryName: 'Ev üçün', price: 21.00, icon: '🕯️' },
    { id: 6, name: 'Gün eynəyi', category: 'style', categoryName: 'Stil', price: 54.90, icon: '🕶️' },
    { id: 7, name: 'Simsiz qulaqcıq', category: 'tech', categoryName: 'Texnologiya', price: 74.90, icon: '🎧' },
    { id: 8, name: 'Seramik vaza', category: 'home', categoryName: 'Ev üçün', price: 29.90, icon: '🏺' }
];

const productGrid = document.querySelector('#productGrid');
const searchInput = document.querySelector('#searchInput');
const cartCount = document.querySelector('#cartCount');
const drawerCount = document.querySelector('#drawerCount');
const cartItems = document.querySelector('#cartItems');
const cartTotal = document.querySelector('#cartTotal');
const cartEmpty = document.querySelector('#cartEmpty');
const checkoutButton = document.querySelector('#checkoutButton');
const cartDrawer = document.querySelector('#cartDrawer');
const overlay = document.querySelector('#overlay');
let selectedCategory = 'all';
let cart = JSON.parse(localStorage.getItem('nova-cart') || '{}');

function renderProducts() {
    const query = searchInput.value.toLocaleLowerCase('az-AZ').trim();
    const visibleProducts = products.filter((product) => {
        const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
        return matchesCategory && `${product.name} ${product.categoryName}`.toLocaleLowerCase('az-AZ').includes(query);
    });
    productGrid.innerHTML = visibleProducts.map((product) => `
        <article class="product-card">
            <div class="product-image"><span>${product.icon}</span></div>
            <button class="add-button" type="button" data-add="${product.id}" aria-label="${product.name} səbətə əlavə et">+</button>
            <div class="product-info">
                <div><h3>${product.name}</h3><p>${product.categoryName}</p></div>
                <strong class="price">${product.price.toFixed(2)} AZN</strong>
            </div>
        </article>
    `).join('');
    document.querySelector('#emptyState').hidden = visibleProducts.length > 0;
    document.querySelector('#productTotal').textContent = `${visibleProducts.length} məhsul`;
}

function saveCart() {
    localStorage.setItem('nova-cart', JSON.stringify(cart));
}

function renderCart() {
    const entries = Object.entries(cart).filter(([, quantity]) => quantity > 0);
    const totalItems = entries.reduce((sum, [, quantity]) => sum + quantity, 0);
    const totalPrice = entries.reduce((sum, [id, quantity]) => sum + products.find((product) => product.id === Number(id)).price * quantity, 0);
    cartCount.textContent = totalItems;
    drawerCount.textContent = `(${totalItems})`;
    cartTotal.textContent = `${totalPrice.toFixed(2)} AZN`;
    cartEmpty.hidden = entries.length > 0;
    checkoutButton.disabled = entries.length === 0;
    cartItems.innerHTML = entries.map(([id, quantity]) => {
        const product = products.find((item) => item.id === Number(id));
        return `<div class="cart-item">
            <div class="cart-item-image">${product.icon}</div>
            <div class="cart-item-info"><h3>${product.name}</h3><p>${(product.price * quantity).toFixed(2)} AZN</p>
                <div class="quantity"><button type="button" data-change="${product.id}" data-step="-1" aria-label="Azalt">−</button><span>${quantity}</span><button type="button" data-change="${product.id}" data-step="1" aria-label="Artır">+</button></div>
            </div>
            <button class="remove-item" type="button" data-remove="${product.id}" aria-label="${product.name} sil">×</button>
        </div>`;
    }).join('');
}

function setCartOpen(isOpen) {
    cartDrawer.classList.toggle('open', isOpen);
    cartDrawer.setAttribute('aria-hidden', String(!isOpen));
    overlay.hidden = !isOpen;
}

productGrid.addEventListener('click', (event) => {
    const button = event.target.closest('[data-add]');
    if (!button) return;
    const id = button.dataset.add;
    cart[id] = (cart[id] || 0) + 1;
    saveCart();
    renderCart();
});
cartItems.addEventListener('click', (event) => {
    const change = event.target.closest('[data-change]');
    const remove = event.target.closest('[data-remove]');
    if (change) {
        const id = change.dataset.change;
        cart[id] = (cart[id] || 0) + Number(change.dataset.step);
        if (cart[id] <= 0) delete cart[id];
    }
    if (remove) delete cart[remove.dataset.remove];
    saveCart();
    renderCart();
});
document.querySelectorAll('.category').forEach((button) => button.addEventListener('click', () => {
    document.querySelector('.category.active').classList.remove('active');
    button.classList.add('active');
    selectedCategory = button.dataset.category;
    renderProducts();
}));
searchInput.addEventListener('input', renderProducts);
document.querySelector('#cartButton').addEventListener('click', () => setCartOpen(true));
document.querySelector('#closeCart').addEventListener('click', () => setCartOpen(false));
overlay.addEventListener('click', () => setCartOpen(false));
document.querySelector('#checkoutButton').addEventListener('click', () => {
    if (Object.keys(cart).length) alert('Sifarişiniz qəbul edildi! Təşəkkür edirik.');
});
document.querySelector('#menuButton').addEventListener('click', () => document.querySelector('.main-nav').classList.toggle('mobile-open'));

renderProducts();
renderCart();