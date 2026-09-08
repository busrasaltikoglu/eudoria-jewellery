// Sepet Verisi
let cart = [];

// DOM Elemanları
const cartToggle = document.getElementById('cart-toggle');
const cartDrawer = document.getElementById('cart-drawer');
const cartOverlay = document.getElementById('cart-overlay');
const closeCart = document.getElementById('close-cart');
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

if (cartToggle) {
    cartToggle.addEventListener('click', (e) => {
        e.preventDefault();
        openCartPanel();
    });
}

if (closeCart) closeCart.addEventListener('click', closeCartPanel);
if (cartOverlay) cartOverlay.addEventListener('click', closeCartPanel);

// Sayfadaki TÜM "Sepete Ekle" butonlarını (ana sayfa, tüm kategoriler ve modal dahil) tek tek yakala
document.addEventListener('DOMContentLoaded', () => {
    const allButtons = document.querySelectorAll('.add-to-cart-btn, #modal-add-btn');

    allButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            // Tıklamanın arkadaki karta gidip modal açmasını engelle
            e.stopPropagation();

            let name, price, img;

            // Eğer tıklanan buton modal içindeyse bilgileri modaldan al
            const modal = document.getElementById('urun-modal');
            if (modal && modal.contains(btn)) {
                name = document.getElementById('modal-title')?.innerText;
                const rawPrice = document.getElementById('modal-price')?.innerText || '0';
                price = parseFloat(rawPrice.replace(' TL', '').trim());
                img = document.getElementById('modal-img')?.src;
                
                // Modalı kapat
                modal.style.display = 'none';
            } else {
                // Normal ürün kartındaki butonsa data-* özelliklerinden al
                name = btn.getAttribute('data-name');
                price = parseFloat(btn.getAttribute('data-price'));
                img = btn.getAttribute('data-img');
            }

            if (!name || isNaN(price)) return;

            // Ürün sepette var mı kontrol et, varsa adet artır
            const existingItem = cart.find(item => item.name === name);
            if (existingItem) {
                existingItem.quantity += 1;
            } else {
                cart.push({ name, price, img: img || '', quantity: 1 });
            }

            updateCartUI();
            openCartPanel();
        });
    });
});

// Sepetten Ürün Çıkarma
function removeItem(name) {
    cart = cart.filter(item => item.name !== name);
    updateCartUI();
}

// Arayüzü Güncelleme
function updateCartUI() {
    if (!cartCountSpan || !cartItemsContainer || !cartTotalPriceSpan) return;

    const totalCount = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCountSpan.textContent = `(${totalCount})`;

    if (cart.length === 0) {
        cartItemsContainer.innerHTML = '<p class="empty-cart-msg">Sepetiniz henüz boş.</p>';
        cartTotalPriceSpan.textContent = '0 TL';
        return;
    }

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
}// Sayfa Sekmeleri ve Ürün Tıklama (Modal Açma) Yönetimi
document.addEventListener('DOMContentLoaded', () => {
    // 1. Sekmeler arası geçiş (ANA SAYFA, KOLYELER, YÜZÜKLER vb.)
    const navLinks = document.querySelectorAll('nav a, .menu a, header a'); // Sitenin menü bağlantı seçicisine göre
    const sections = document.querySelectorAll('.section, .page, main > div'); // Sayfa bölümleri

    // Eğer sitende sekme gizle/göster mantığı bu şekilde kurulduysa:
    // (Eğer sekmeler farklı HTML dosyalarıysa bu kısım zaten kendi çalışır, tek sayfa (SPA) ise çalışır)

    // 2. Ürün kartına tıklandığında detay modalını açma
    const productCards = document.querySelectorAll('.product-card, .urun-karti'); // Ürün kartı sınıfın neyse
    const modal = document.getElementById('urun-modal');

    if (productCards && modal) {
        productCards.forEach(card => {
            card.addEventListener('click', (e) => {
                // Eğer tıklanan şey "Sepete Ekle" butonu değilse modalı aç
                if (e.target.closest('.add-to-cart-btn') || e.target.closest('#modal-add-btn')) return;

                // Buraya kartın içindeki bilgileri alıp modala basan kodların gelebilir
                // Örn: modal.style.display = 'block';
            });
        });
    }
});
