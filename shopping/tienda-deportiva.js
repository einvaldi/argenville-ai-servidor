// tienda-deportiva.js (Motor Premium - Arquitectura de Franquicia)

let cart = JSON.parse(localStorage.getItem('argen_sports_cart')) || {};

// 1. ÁRBOL DE CATEGORÍAS OFICIALES
const CATEGORIES = [
    { id: "todo", name: "⚡ Últimos Lanzamientos", icon: "fa-bolt", subs: [] },
    { id: "f1", name: "🏎️ Fórmula 1 & Motor", icon: "fa-flag-checkered", subs: [
        { id: "f1_superior", name: "Remeras & Chombas" },
        { id: "f1_inferior", name: "Pantalones & Shorts" },
        { id: "f1_gorras", name: "Gorras Oficiales" },
        { id: "f1_accesorios", name: "Accesorios & Mochilas" }
    ]},
    { id: "futbol", name: "⚽ Fútbol & Mundial", icon: "fa-futbol", subs: [
        { id: "fut_camisetas", name: "Camisetas Oficiales" },
        { id: "fut_botines", name: "Botines" }
    ]},
    { id: "padel_tenis", name: "🎾 Pádel & Tenis", icon: "fa-table-tennis-paddle-ball", subs: [ 
        { id: "pt_paletas", name: "Paletas & Raquetas" },
        { id: "pt_calzado", name: "Calzado Court" }
    ]},
    { id: "running", name: "🏃 Running & Training", icon: "fa-shoe-prints", subs: [
        { id: "run_calzado", name: "Zapatillas" },
        { id: "run_ropa", name: "Indumentaria Técnica" }
    ]},
    { id: "rugby", name: "🏉 Rugby", icon: "fa-football", subs: [
        { id: "rug_camisetas", name: "Camisetas" }
    ]}
];

document.addEventListener("DOMContentLoaded", () => {
    iniciarTienda();
});

function iniciarTienda() {
    renderCategorias();
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

// Filtro responsive del select (móvil)
function filterProducts(cat) {
    renderProds(cat === 'all' ? 'todo' : cat);
}

function renderProds(categoria, subcategoria = null) {
    const grid = document.getElementById("productsGrid");
    if (!grid || !window.PRODUCTOS) return;

    // Filtramos los packs si los hubiera para mostrarlos aparte (ahora está todo integrado)
    let filtrados = window.PRODUCTOS.filter(p => p.category.toLowerCase() !== 'packs');
    
    if (categoria !== 'todo') {
        filtrados = filtrados.filter(p => p.category.toLowerCase() === categoria.toLowerCase());
    }
    if (subcategoria) {
        filtrados = filtrados.filter(p => p.subcategory && p.subcategory.toLowerCase() === subcategoria.toLowerCase());
    }

    const resCount = document.getElementById("resultCount");
    if(resCount) resCount.innerText = `${filtrados.length} productos`;

    grid.innerHTML = filtrados.map(p => {
        let opcionesTalle = '';
        const dataAAnalizar = (p.name + " " + p.category + " " + p.subcategory).toLowerCase();
        const badgeHTML = p.chip ? `<div class="pack-badge" style="top:10px; left:10px; font-size:0.75rem; padding: 4px 10px;">${p.chip}</div>` : '';

        // MOTOR INTELIGENTE DE TALLES (Cubre F1, Pádel, Running, etc.)
        
        // 1. Descartar talles para artículos duros
        if (dataAAnalizar.includes('gorra') || dataAAnalizar.includes('mochila') || dataAAnalizar.includes('paleta') || dataAAnalizar.includes('raqueta') || dataAAnalizar.includes('pelota')) {
            opcionesTalle = ``; // No imprime select
        }
        // 2. Ropa Superior (Talle XL por defecto)
        else if (dataAAnalizar.includes('camiseta') || dataAAnalizar.includes('chomba') || dataAAnalizar.includes('remera') || dataAAnalizar.includes('campera')) {
            opcionesTalle = `
                <select id="talle-${p.id}" class="size-selector">
                    <option value="" disabled>Elegí tu talle</option>
                    <option value="S">Talle S</option>
                    <option value="M">Talle M</option>
                    <option value="L">Talle L</option>
                    <option value="XL" selected>Talle XL</option>
                    <option value="XXL">Talle XXL</option>
                </select>
            `;
        } 
        // 3. Ropa Inferior (Talle 44 por defecto)
        else if (dataAAnalizar.includes('short') || dataAAnalizar.includes('pantalon') || dataAAnalizar.includes('jogger')) {
            opcionesTalle = `
                <select id="talle-${p.id}" class="size-selector">
                    <option value="" disabled>Elegí tu talle</option>
                    <option value="40">Talle 40</option>
                    <option value="42">Talle 42</option>
                    <option value="44" selected>Talle 44</option>
                    <option value="46">Talle 46</option>
                    <option value="48">Talle 48</option>
                </select>
            `;
        } 
        // 4. Calzado (Talle EU)
        else if (dataAAnalizar.includes('botin') || dataAAnalizar.includes('zapatilla') || dataAAnalizar.includes('calzado')) {
            opcionesTalle = `
                <select id="talle-${p.id}" class="size-selector">
                    <option value="" disabled selected>Número (EU)</option>
                    <option value="EU 39">EU 39</option>
                    <option value="EU 40">EU 40</option>
                    <option value="EU 41">EU 41</option>
                    <option value="EU 42">EU 42</option>
                    <option value="EU 43">EU 43</option>
                    <option value="EU 44">EU 44</option>
                </select>
            `;
        }

        return `
            <div class="card-prod">
                <div class="prod-img">
                    ${badgeHTML}
                    <img src="${p.image}" onclick="openModal('${p.image}')" onerror="this.src='https://placehold.co/300x300?text=Producto'">
                </div>
                <div class="prod-title">${p.name}</div>
                <div class="prod-price">$${p.price.toFixed(2)}</div>
                ${opcionesTalle}
                <button class="btn-buy" onclick="agregarAlCarritoConTalle('${p.id}', '${p.name.replace(/'/g, "\\'")}', ${p.price})">Comprar</button>
            </div>
        `;
    }).join("");
}

function agregarAlCarritoConTalle(id, name, price) {
    const selector = document.getElementById(`talle-${id}`);
    let talleElegido = "";

    // Solo valida si el producto imprimió un selector de talle
    if (selector) {
        talleElegido = selector.value;
        if (!talleElegido) {
            alert("¡Por favor, seleccioná tu talle o número antes de agregar al pedido!");
            return;
        }
    }

    const idCarrito = talleElegido ? `${id}-${talleElegido}` : id;
    const nombreParaCarrito = talleElegido ? `${name} (Talle: ${talleElegido})` : name;

    if(!cart[idCarrito]) {
        cart[idCarrito] = {qty: 0, name: nombreParaCarrito, price: price, baseId: id};
    }
    cart[idCarrito].qty++;
    
    localStorage.setItem('argen_sports_cart', JSON.stringify(cart));
    updateCartUI();
    openCart();
}

function removeQty(idCarrito) {
    if(cart[idCarrito]) {
        cart[idCarrito].qty--;
        if(cart[idCarrito].qty <= 0) delete cart[idCarrito];
        localStorage.setItem('argen_sports_cart', JSON.stringify(cart));
        updateCartUI();
    }
}

function addQty(idCarrito) {
    if(cart[idCarrito]) {
        cart[idCarrito].qty++;
        localStorage.setItem('argen_sports_cart', JSON.stringify(cart));
        updateCartUI();
    }
}

function deleteItem(idCarrito) {
    delete cart[idCarrito];
    localStorage.setItem('argen_sports_cart', JSON.stringify(cart));
    updateCartUI();
}

function clearCart() {
    cart = {};
    localStorage.setItem('argen_sports_cart', JSON.stringify(cart));
    updateCartUI();
}

function openCart() { document.getElementById("cartDrawer").classList.add("open"); }
function closeCart() { document.getElementById("cartDrawer").classList.remove("open"); }

function updateCartUI() {
    let total = 0, count = 0, weight = 0, html = "";
    for(let id in cart) {
        total += cart[id].price * cart[id].qty;
        count += cart[id].qty;
        weight += 0.5 * cart[id].qty; 
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
    if(cartBody) { cartBody.innerHTML = html || "<div class='cart-empty'>Tu carrito está vacío</div>"; }
    
    const shipping = weight * 8;
    if(document.getElementById("subtotal")) document.getElementById("subtotal").innerText = `$${total.toFixed(2)}`;
    if(document.getElementById("weight")) document.getElementById("weight").innerText = `${weight.toFixed(2)} Kg`;
    if(document.getElementById("shipping")) document.getElementById("shipping").innerText = `$${shipping.toFixed(2)}`;
    if(document.getElementById("finalTotal")) document.getElementById("finalTotal").innerText = `$${(total + shipping).toFixed(2)}`;
    if(document.getElementById("cartCountHeader")) document.getElementById("cartCountHeader").innerText = count;
}

// LÓGICA JUAN PATRIOTA
function abrirChatJuan() { document.getElementById('juanMaster').style.display = 'none'; document.getElementById('chatPanel').classList.add('active'); }
function cerrarChatJuan() { document.getElementById('chatPanel').classList.remove('active'); document.getElementById('btnReopenJuan').style.display = 'block'; }
function cerrarJuan() { document.getElementById('juanMaster').style.display = 'none'; document.getElementById('btnReopenJuan').style.display = 'block'; }
function reabrirJuan() { document.getElementById('btnReopenJuan').style.display = 'none'; document.getElementById('juanMaster').style.display = 'flex'; }