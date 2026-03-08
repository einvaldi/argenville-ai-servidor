// tienda-regional.js (Motor Boutique Regional)

let cart = JSON.parse(localStorage.getItem('argen_regional_cart')) || {};

// ÁRBOL DE CATEGORÍAS REGIONALES
const CATEGORIES = [
    { id: "todo", name: "🌟 Catálogo Exclusivo", icon: "fa-star", subs: [] },
    { id: "mates", name: "🧉 Platería & Mates", icon: "fa-mug-hot", subs: [
        { id: "mates_plata", name: "Mates Imperiales" },
        { id: "bombillas", name: "Bombillas Labradas" }
    ]},
    { id: "talabarteria", name: "🐎 Talabartería", icon: "fa-horse-head", subs: [
        { id: "calzado_cuero", name: "Botas & Alpargatas" },
        { id: "marroquineria", name: "Bolsos & Cinturones" }
    ]},
    { id: "cuchilleria", name: "🔪 Cuchillería Gaucha", icon: "fa-utensils", subs: [ 
        { id: "facones", name: "Facones de Acero" },
        { id: "verijeros", name: "Verijeros & Asado" }
    ]},
    { id: "textil", name: "🧣 Textil & Telar", icon: "fa-vest", subs: [
        { id: "ponchos", name: "Ponchos Tradicionales" },
        { id: "ropa_gaucha", name: "Indumentaria de Campo" }
    ]}
];

document.addEventListener("DOMContentLoaded", () => {
    iniciarTienda();
});

function iniciarTienda() {
    renderCategorias();
    renderPacks();
    renderProds('todo');
    updateCartUI();
}

function renderCategorias() {
    const catList = document.getElementById("categoryList");
    if (!catList) return;
    
    let html = '';
    CATEGORIES.forEach(c => {
        html += `
        <button class="cat-btn" onclick="renderProds('${c.id}')">
            <span><i class="fa-solid ${c.icon}" style="margin-right:8px;"></i> ${c.name}</span>
        </button>`;
        
        if (c.subs && c.subs.length > 0) {
            html += `<div class="sub-cat-list open" id="sub-${c.id}">`;
            c.subs.forEach(sub => {
                html += `<button class="sub-btn" onclick="renderProds('${c.id}', '${sub.id}')">↳ ${sub.name}</button>`;
            });
            html += `</div>`;
        }
    });
    catList.innerHTML = html;
}

function filterProducts(cat) { renderProds(cat === 'all' ? 'todo' : cat); }

function renderPacks() {
    const packsGrid = document.getElementById("packsGrid");
    if (!packsGrid) return;
    const packs = window.PRODUCTOS ? window.PRODUCTOS.filter(p => p.category.toLowerCase() === 'packs') : [];
    if(packs.length === 0) { packsGrid.innerHTML = ""; return; }

    packsGrid.innerHTML = packs.map(p => `
        <div class="card-pack">
            <div class="pack-badge">REGALO EMPRESARIAL</div>
            <div class="pack-img"><img src="${p.image}" onclick="openModal('${p.image}')"></div>
            <div class="pack-body">
                <div class="pack-title">${p.name}</div>
                <div class="pack-desc">${p.desc || ''}</div>
                <div class="pack-price">$${p.price.toFixed(2)}</div>
                <button class="btn-buy-pack" onclick="agregarAlCarritoConTalle('${p.id}', '${p.name.replace(/'/g, "\\'")}', ${p.price})">AGREGAR AL PEDIDO</button>
            </div>
        </div>
    `).join("");
}

function renderProds(categoria, subcategoria = null) {
    const grid = document.getElementById("productsGrid");
    if (!grid || !window.PRODUCTOS) return;

    let filtrados = window.PRODUCTOS.filter(p => p.category.toLowerCase() !== 'packs');
    
    if (categoria !== 'todo') { filtrados = filtrados.filter(p => p.category.toLowerCase() === categoria.toLowerCase()); }
    if (subcategoria) { filtrados = filtrados.filter(p => p.subcategory && p.subcategory.toLowerCase() === subcategoria.toLowerCase()); }

    const resCount = document.getElementById("resultCount");
    if(resCount) resCount.innerText = `${filtrados.length} piezas únicas`;

    grid.innerHTML = filtrados.map(p => {
        let opcionesTalle = '';
        const dataAAnalizar = (p.name + " " + p.category + " " + p.subcategory).toLowerCase();
        const badgeHTML = p.chip ? `<div class="pack-badge" style="top:10px; left:10px; font-size:0.75rem; padding: 4px 10px;">${p.chip}</div>` : '';

        // MOTOR INTELIGENTE REGIONAL
        // 1. Descartar talles para artículos duros y ponchos
        if (dataAAnalizar.includes('mate') || dataAAnalizar.includes('bombilla') || dataAAnalizar.includes('cuchillo') || dataAAnalizar.includes('facon') || dataAAnalizar.includes('verijero') || dataAAnalizar.includes('poncho') || dataAAnalizar.includes('bolso')) {
            opcionesTalle = ``; 
        }
        // 2. Ropa de Campo (Bombachas, Pantalones) -> Talles numéricos
        else if (dataAAnalizar.includes('bombacha') || dataAAnalizar.includes('pantalon')) {
            opcionesTalle = `
                <select id="talle-${p.id}" class="size-selector">
                    <option value="" disabled>Talle de Cintura</option>
                    <option value="40">Talle 40</option>
                    <option value="42">Talle 42</option>
                    <option value="44" selected>Talle 44</option>
                    <option value="46">Talle 46</option>
                    <option value="48">Talle 48</option>
                    <option value="50">Talle 50</option>
                </select>
            `;
        } 
        // 3. Camisas Gauchas -> Talles Letras
        else if (dataAAnalizar.includes('camisa') || dataAAnalizar.includes('chaleco')) {
            opcionesTalle = `
                <select id="talle-${p.id}" class="size-selector">
                    <option value="" disabled>Talle de Prenda</option>
                    <option value="S">Talle S</option>
                    <option value="M">Talle M</option>
                    <option value="L">Talle L</option>
                    <option value="XL" selected>Talle XL</option>
                    <option value="XXL">Talle XXL</option>
                </select>
            `;
        } 
        // 4. Calzado (Botas, Alpargatas)
        else if (dataAAnalizar.includes('bota') || dataAAnalizar.includes('alpargata')) {
            opcionesTalle = `
                <select id="talle-${p.id}" class="size-selector">
                    <option value="" disabled selected>Número de Calzado</option>
                    <option value="39">AR 39</option>
                    <option value="40">AR 40</option>
                    <option value="41">AR 41</option>
                    <option value="42">AR 42</option>
                    <option value="43">AR 43</option>
                    <option value="44">AR 44</option>
                    <option value="45">AR 45</option>
                </select>
            `;
        }

        return `
            <div class="card-prod">
                <div class="prod-img">
                    ${badgeHTML}
                    <img src="${p.image}" onclick="openModal('${p.image}')" onerror="this.src='https://placehold.co/300x300/3E2723/EFEBE9?text=Argenville'">
                </div>
                <div class="prod-title">${p.name}</div>
                <div class="prod-price">$${p.price.toFixed(2)}</div>
                ${opcionesTalle}
                <button class="btn-buy" onclick="agregarAlCarritoConTalle('${p.id}', '${p.name.replace(/'/g, "\\'")}', ${p.price})">Agregar</button>
            </div>
        `;
    }).join("");
}

function agregarAlCarritoConTalle(id, name, price) {
    const selector = document.getElementById(`talle-${id}`);
    let talleElegido = "";

    if (selector) {
        talleElegido = selector.value;
        if (!talleElegido) {
            alert("¡Amigo, seleccioná tu talle o número antes de agregarlo al carro!");
            return;
        }
    }

    const idCarrito = talleElegido ? `${id}-${talleElegido}` : id;
    const nombreParaCarrito = talleElegido ? `${name} (Talle: ${talleElegido})` : name;

    if(!cart[idCarrito]) { cart[idCarrito] = {qty: 0, name: nombreParaCarrito, price: price, baseId: id}; }
    cart[idCarrito].qty++;
    
    localStorage.setItem('argen_regional_cart', JSON.stringify(cart));
    updateCartUI();
    openCart();
}

function removeQty(idCarrito) {
    if(cart[idCarrito]) {
        cart[idCarrito].qty--;
        if(cart[idCarrito].qty <= 0) delete cart[idCarrito];
        localStorage.setItem('argen_regional_cart', JSON.stringify(cart));
        updateCartUI();
    }
}
function addQty(idCarrito) {
    if(cart[idCarrito]) { cart[idCarrito].qty++; localStorage.setItem('argen_regional_cart', JSON.stringify(cart)); updateCartUI(); }
}
function deleteItem(idCarrito) { delete cart[idCarrito]; localStorage.setItem('argen_regional_cart', JSON.stringify(cart)); updateCartUI(); }
function clearCart() { cart = {}; localStorage.setItem('argen_regional_cart', JSON.stringify(cart)); updateCartUI(); }

function openCart() { document.getElementById("cartDrawer").classList.add("open"); }
function closeCart() { document.getElementById("cartDrawer").classList.remove("open"); }

function updateCartUI() {
    let total = 0, count = 0, weight = 0, html = "";
    for(let id in cart) {
        total += cart[id].price * cart[id].qty;
        count += cart[id].qty;
        weight += 0.8 * cart[id].qty; // Regionales suelen ser más pesados (cuchillos, mates, botas)
        html += `
            <div class="cart-item">
                <div class="cart-info">
                    <h4>${cart[id].name}</h4>
                    <div class="cart-price">$${cart[id].price.toFixed(2)}</div>
                </div>
                <div class="cart-ctrl">
                    <button class="qty-btn" onclick="removeQty('${id}')">-</button>
                    <span class="cart-qty">${cart[id].qty}</span>
                    <button class="qty-btn" onclick="addQty('${id}')">+</button>
                    <button class="btn-trash" onclick="deleteItem('${id}')"><i class="fa-solid fa-trash"></i></button>
                </div>
            </div>`;
    }
    
    const cartBody = document.getElementById("cartBody");
    if(cartBody) { cartBody.innerHTML = html || "<div class='cart-empty'>Tu baúl está vacío</div>"; }
    
    const shipping = weight * 8;
    if(document.getElementById("subtotal")) document.getElementById("subtotal").innerText = `$${total.toFixed(2)}`;
    if(document.getElementById("weight")) document.getElementById("weight").innerText = `${weight.toFixed(2)} Kg`;
    if(document.getElementById("shipping")) document.getElementById("shipping").innerText = `$${shipping.toFixed(2)}`;
    if(document.getElementById("finalTotal")) document.getElementById("finalTotal").innerText = `$${(total + shipping).toFixed(2)}`;
    if(document.getElementById("cartCountHeader")) document.getElementById("cartCountHeader").innerText = count;
}

function abrirChatJuan() { document.getElementById('juanMaster').style.display = 'none'; document.getElementById('chatPanel').classList.add('active'); }
function cerrarChatJuan() { document.getElementById('chatPanel').classList.remove('active'); document.getElementById('btnReopenJuan').style.display = 'block'; }
function cerrarJuan() { document.getElementById('juanMaster').style.display = 'none'; document.getElementById('btnReopenJuan').style.display = 'block'; }
function reabrirJuan() { document.getElementById('btnReopenJuan').style.display = 'none'; document.getElementById('juanMaster').style.display = 'flex'; }