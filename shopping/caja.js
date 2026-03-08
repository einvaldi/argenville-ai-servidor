// ================================================
// CONFIGURACIÓN DE GOOGLE PAY (MODO PRUEBA)
// ================================================
const baseRequest = {
  apiVersion: 2,
  apiVersionMinor: 0
};

// En un entorno real, esto cambiaría por tu procesador de pagos (ej. Stripe, MercadoPago)
// Para prueba, usamos 'example' que no cobra de verdad.
const tokenizationSpecification = {
  type: 'PAYMENT_GATEWAY',
  parameters: {
    'gateway': 'example',
    'gatewayMerchantId': 'exampleGatewayMerchantId'
  }
};

const allowedCardNetworks = ["AMEX", "DISCOVER", "INTERAC", "JCB", "MASTERCARD", "VISA"];
const allowedCardAuthMethods = ["PAN_ONLY", "CRYPTOGRAM_3DS"];

const baseCardPaymentMethod = {
  type: 'CARD',
  parameters: {
    allowedAuthMethods: allowedCardAuthMethods,
    allowedCardNetworks: allowedCardNetworks
  }
};

const cardPaymentMethod = Object.assign(
  {},
  baseCardPaymentMethod,
  {
    tokenizationSpecification: tokenizationSpecification
  }
);

let paymentsClient = null;
let finalAmountForGPay = "0.00"; // Variable global para guardar el total

// ================================================
// LÓGICA DEL CARRITO (Reutilizada de las tiendas)
// ================================================
const COSTO_POR_KG = 8;

function getCart() {
    return JSON.parse(localStorage.getItem('argenville_global_cart')) || {};
}

function loadCheckout() {
    const cart = getCart();
    const itemsList = document.getElementById("checkoutItemsList");
    const totalsBox = document.getElementById("totalsBox");
    const paymentSection = document.getElementById("paymentSection");

    if (Object.keys(cart).length === 0) {
        itemsList.innerHTML = `
            <div class="empty-cart-msg">
                <i class="fa-solid fa-cart-arrow-down" style="font-size: 3rem; margin-bottom: 20px;"></i><br>
                Tu carrito está vacío.<br>
                <a href="tienda-deportiva.html" class="btn-back">Volver a la tienda</a>
            </div>
        `;
        totalsBox.style.display = "none";
        paymentSection.style.display = "none";
        return;
    }

    // Si hay productos, mostramos las secciones
    totalsBox.style.display = "block";
    paymentSection.style.display = "block";

    let htmlStr = "";
    let subtotal = 0;
    let pesoTotal = 0;

    for (let id in cart) {
        let it = cart[id];
        let itemTotal = it.price * it.qty;
        subtotal += itemTotal;
        pesoTotal += (0.250 * it.qty); // Estimado 250g por ítem

        htmlStr += `
        <div class="checkout-item">
            <div class="item-name">
                ${it.name} <br> <span>x${it.qty} unidad(es)</span>
            </div>
            <div class="item-price">$${itemTotal.toFixed(2)}</div>
        </div>`;
    }

    itemsList.innerHTML = htmlStr;

    // Cálculos finales
    let costoEnvio = pesoTotal * COSTO_POR_KG;
    let totalFinal = subtotal + costoEnvio;

    // Actualizamos el HTML
    document.getElementById("sumSubtotal").innerText = `$${subtotal.toFixed(2)}`;
    document.getElementById("sumWeight").innerText = `${pesoTotal.toFixed(2)} kg`;
    document.getElementById("sumShipping").innerText = `$${costoEnvio.toFixed(2)}`;
    document.getElementById("sumFinal").innerText = `$${totalFinal.toFixed(2)}`;

    // Guardamos el total para Google Pay (debe ser string con 2 decimales)
    finalAmountForGPay = totalFinal.toFixed(2);

    // Intentamos iniciar Google Pay si ya se cargó el script
    if (paymentsClient) {
        setupGooglePayBtn();
    }
}

// ================================================
// FUNCIONES DE GOOGLE PAY
// ================================================

// Esta función se llama automáticamente cuando el script de Google Pay del HTML termina de cargar
window.onGooglePayLoaded = function() {
    paymentsClient = new google.payments.api.PaymentsClient({ environment: 'TEST' }); // 'PRODUCTION' para real
    
    // Si ya calculamos el carrito, mostramos el botón. Si no, esperará a loadCheckout.
    if (finalAmountForGPay !== "0.00") {
        setupGooglePayBtn();
    }
}

function setupGooglePayBtn() {
    const isReadyToPayRequest = Object.assign(
        {},
        baseRequest,
        {
          allowedPaymentMethods: [baseCardPaymentMethod]
        }
    );

    paymentsClient.isReadyToPay(isReadyToPayRequest)
        .then(function(response) {
            if (response.result) {
                // Si Google Pay está listo, creamos el botón
                createAndAddButton();
            } else {
                console.log("Google Pay no está disponible en este dispositivo/navegador.");
                document.getElementById("gpay-container").innerHTML = "<p style='color:#ef4444;'>Google Pay no disponible.</p>";
            }
        })
        .catch(function(err) {
            console.error("Error verificando Google Pay:", err);
        });
}

function createAndAddButton() {
    const button = paymentsClient.createButton({
        buttonColor: 'default', // 'default' (negro) o 'white'
        buttonType: 'pay',      // 'buy', 'plain', 'checkout'
        onClick: onGooglePaymentButtonClicked
    });
    
    const container = document.getElementById('gpay-container');
    container.innerHTML = ""; // Limpiar por si acaso
    container.appendChild(button);
}

function onGooglePaymentButtonClicked() {
    // Configuración de la transacción específica
    const paymentDataRequest = Object.assign({}, baseRequest);
    paymentDataRequest.allowedPaymentMethods = [cardPaymentMethod];
    paymentDataRequest.transactionInfo = {
      totalPriceStatus: 'FINAL',
      totalPrice: finalAmountForGPay, // USAMOS EL TOTAL CALCULADO DEL CARRITO
      currencyCode: 'USD',
      countryCode: 'US' // Puede ser AR, pero para test US funciona mejor
    };
    paymentDataRequest.merchantInfo = {
      merchantName: 'Argenville Demo Store',
      merchantId: '01234567890123456789' // ID de prueba
    };

    // Abrir la hoja de pago de Google
    paymentsClient.loadPaymentData(paymentDataRequest)
        .then(function(paymentData) {
            // =================================================
            // ¡PAGO AUTORIZADO!
            // Aquí es donde enviarías `paymentData.paymentMethodData.tokenizationData.token`
            // a tu servidor backend para procesar el cobro real.
            // =================================================
            console.log('Éxito:', paymentData);
            showSuccessMessage();
        })
        .catch(function(err) {
            // El usuario cerró la ventana o hubo un error
            console.error('Error en el pago o cancelado:', err);
        });
}

function showSuccessMessage() {
    // Simulación de éxito
    const paymentSection = document.getElementById("paymentSection");
    paymentSection.innerHTML = `
        <div style="text-align: center; padding: 30px;">
            <i class="fa-solid fa-circle-check" style="color: #22c55e; font-size: 4rem; margin-bottom: 20px;"></i>
            <h2 style="border:none;">¡Pago Exitoso!</h2>
            <p style="color: var(--text-muted);">Gracias por tu compra en Argenville.</p>
            <p style="font-weight:700; margin-top: 20px;">Orden de prueba #ARG-TEST-${Math.floor(Math.random()*9000)+1000}</p>
            <button onclick="localStorage.removeItem('argenville_global_cart'); window.location.href='index.html'" style="margin-top: 30px; padding: 12px 30px; background: var(--accent); color: white; border: none; border-radius: 50px; font-weight: 700; cursor: pointer;">Volver al Inicio</button>
        </div>
    `;
    // Opcional: Borrar el carrito
    // localStorage.removeItem('argenville_global_cart');
}

// ================================================
// INICIALIZACIÓN
// ================================================
// Cargar el resumen del carrito cuando la página esté lista
window.addEventListener('load', loadCheckout);