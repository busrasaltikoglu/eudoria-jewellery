// Sepet Verisi
let cart = [];

// DOM Elemanları
const cartToggle = document.getElementById('cart-toggle');
const cartDrawer = document.getElementById('cart-drawer');
const cartOverlay = document.getElementById('cart-overlay');
const closeCart = document.getElementById('close-cart');
const addToCartBtns = document.querySelectorAll('.add-to-cart-btn');
const cartItemsContainer = document.getElementById('cart-items');
const cartCountSpan = document.querySelector('.cart-count');
const cartTotalPriceSpan = document.getElementById('cart-total-price');

// Sepet Panelini Aç/Kapat
function openCartPanel() {
    cartDrawer.classList.add('open');
    cartOverlay.classList.add('active');
}

function closeCartPanel() {
    cartDrawer.classList.remove('open');
    cartOverlay.classList.remove('active');
}

cartToggle.addEventListener('click', (e) => {
    e.preventDefault();
    openCartPanel();
});

closeCart.addEventListener('click', closeCartPanel);
cartOverlay.addEventListener('click', closeCartPanel);

// Sepete Ürün Ekleme
addToCartBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        const name = btn.getAttribute('data-name');
        const price = parseFloat(btn.getAttribute('data-price'));
        const img = btn.getAttribute('data-img');

        // Ürün zaten var mı kontrol et
        const existingItem = cart.find(item => item.name === name);
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            cart.push({ name, price, img, quantity: 1 });
        }

        updateCartUI();
        openCartPanel();
    });
});

// Sepetten Ürün Çıkarma
function removeItem(name) {
    cart = cart.filter(item => item.name !== name);
    updateCartUI();
}

// Arayüzü Güncelleme
function updateCartUI() {
    // Toplam Adet
    const totalCount = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCountSpan.textContent = `(${totalCount})`;

    // Sepet Boş mu?
    if (cart.length === 0) {
        cartItemsContainer.innerHTML = '<p class="empty-cart-msg">Sepetiniz henüz boş.</p>';
        cartTotalPriceSpan.textContent = '0 TL';
        return;
    }

    // Ürün Listesini Çiz
    cartItemsContainer.innerHTML = '';
    let totalPrice = 0;

    cart.forEach(item => {
        totalPrice += item.price * item.quantity;
        const itemElement = document.createElement('div');
        itemElement.classList.add('cart-item');
        itemElement.innerHTML = `
            <img src="${item.img}" alt="${item.name}">
            <div class="cart-item-details">
                <p class="cart-item-title">${item.name}</p>
                <p class="cart-item-price">${item.quantity} x ${item.price} TL</p>
            </div>
            <button class="remove-item" onclick="removeItem('${item.name}')">&times;</button>
        `;
        cartItemsContainer.appendChild(itemElement);
    });

    cartTotalPriceSpan.textContent = `${totalPrice} TL`;
}