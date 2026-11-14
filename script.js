// Catálogo de productos con rutas locales en carpeta img/
const products = [
    {
        id: 1,
        name: "Parrilla de Aluminio",
        price: 1180,
        description: "Parrilla portaequipaje liviana, resistente a la corrosión y aerodinámica.",
        image: "PARILLA DE ALUMNIO.jpg"
    },
    {
        id: 2,
        name: "Parrilla Hechiza",
        price: 900,
        description: "Estructura metálica reforzada a medida para trabajo pesado.",
        image: "PARRILLA HECHIZA.jpg"
    },
    {
        id: 3,
        name: "Forro de Asiento Universal",
        price: 460,
        description: "Juego completo de fundas adaptables a la mayoría de vehículos.",
        image: "FORRO DE ASIENTO UNIVERSAL.jpg"
    },
    {
        id: 4,
        name: "Forro Rush",
        price: 650,
        description: "Forros protectores de alta durabilidad con ajuste exacto tipo Rush.",
        image: "FORRO DE ASIENTO RUSH.jpg"
    },
    {
        id: 5,
        name: "Forro de Volante",
        price: 130,
        description: "Forro antideslizante ergonómico para mayor agarre y confort.",
        image: "FORRO DE VOLANTE.jpg"
    }
];

let cart = [];

function renderProducts() {
    const grid = document.getElementById('product-grid');
    grid.innerHTML = products.map(product => `
        <div class="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden flex flex-col justify-between">
            <div>
                <div class="relative h-52 bg-slate-800">
                    <img src="${product.image}" alt="${product.name}" class="w-full h-full object-cover">
                    <span class="absolute top-3 right-3 bg-slate-950/90 px-3 py-1 rounded-full text-rose-400 font-bold text-sm">
                        Bs. ${product.price.toFixed(2)}
                    </span>
                </div>
                <div class="p-6">
                    <h3 class="text-lg font-bold text-white">${product.name}</h3>
                    <p class="text-sm text-slate-400 mt-2">${product.description}</p>
                </div>
            </div>
            <div class="p-6 pt-0">
                <button onclick="addToCart(${product.id})" class="w-full bg-slate-800 hover:bg-rose-600 text-white font-semibold py-3 rounded-xl transition-colors">
                    Agregar al Carrito
                </button>
            </div>
        </div>
    `).join('');
}

function toggleCart() {
    const drawer = document.getElementById('cart-drawer');
    const overlay = document.getElementById('cart-overlay');
    const isOpen = drawer.classList.contains('translate-x-0');
    if (isOpen) {
        drawer.classList.remove('translate-x-0');
        drawer.classList.add('translate-x-full');
        overlay.classList.add('hidden');
    } else {
        drawer.classList.remove('translate-x-full');
        drawer.classList.add('translate-x-0');
        overlay.classList.remove('hidden');
    }
}

function addToCart(id) {
    const product = products.find(p => p.id === id);
    const existing = cart.find(item => item.id === id);
    if (existing) {
        existing.quantity++;
    } else {
        cart.push({ ...product, quantity: 1 });
    }
    updateCartUI();
    showToast("Producto agregado: " + product.name);
}

function updateQuantity(id, change) {
    const item = cart.find(i => i.id === id);
    if (item) {
        item.quantity += change;
        if (item.quantity <= 0) cart = cart.filter(i => i.id !== id);
    }
    updateCartUI();
}

function updateCartUI() {
    document.getElementById('cart-badge').textContent = cart.reduce((s, i) => s + i.quantity, 0);
    const container = document.getElementById('cart-items');
    const totalEl = document.getElementById('cart-total');

    if (cart.length === 0) {
        container.innerHTML = '<p class="text-center text-slate-400 py-10">Tu carrito está vacío</p>';
        totalEl.textContent = "Bs. 0.00";
        return;
    }

    let total = 0;
    container.innerHTML = cart.map(item => {
        total += item.price * item.quantity;
        return `
            <div class="flex items-center justify-between border-b border-slate-800 pb-3">
                <div>
                    <h4 class="text-sm font-bold">${item.name}</h4>
                    <span class="text-xs text-slate-400">Bs. ${item.price.toFixed(2)} c/u</span>
                </div>
                <div class="flex items-center gap-2">
                    <button onclick="updateQuantity(${item.id}, -1)" class="w-7 h-7 bg-slate-800 rounded-lg">-</button>
                    <span class="text-sm font-bold">${item.quantity}</span>
                    <button onclick="updateQuantity(${item.id}, 1)" class="w-7 h-7 bg-slate-800 rounded-lg">+</button>
                </div>
            </div>
        `;
    }).join('');
    totalEl.textContent = "Bs. " + total.toFixed(2);
}

function checkoutWhatsApp() {
    if (cart.length === 0) return showToast("El carrito está vacío");
    const name = document.getElementById('client-name').value.trim();
    if (!name) return showToast("Ingresa tu nombre");

    const orderCode = 'L&A-' + Math.floor(1000 + Math.random() * 9000);
    const total = cart.reduce((s, i) => s + (i.price * i.quantity), 0);

    let msg = `*ORDEN AUTO CAR L&A*\nCódigo: ${orderCode}\nCliente: ${name}\n\n*Productos:*\n`;
    cart.forEach((item, i) => {
        msg += `${i + 1}. ${item.name} x${item.quantity} = Bs. ${(item.price * item.quantity).toFixed(2)}\n`;
    });
    msg += `\n*Total: Bs. ${total.toFixed(2)}*\nAdjunto comprobante de pago QR.`;

    window.open(`https://wa.me/59173241225?text=${encodeURIComponent(msg)}`, '_blank');
}

function showToast(text) {
    const toast = document.getElementById('toast');
    document.getElementById('toast-message').textContent = text;
    toast.classList.remove('translate-y-20', 'opacity-0');
    setTimeout(() => toast.classList.add('translate-y-20', 'opacity-0'), 3000);
}

window.onload = renderProducts;