// Año en el footer
document.getElementById("year").textContent = new Date().getFullYear();

// Menú mobile
const navToggle = document.getElementById("navToggle");
const navMobile = document.getElementById("navMobile");

navToggle.addEventListener("click", () => {
  const isOpen = navMobile.style.display === "flex";
  navMobile.style.display = isOpen ? "none" : "flex";
});

// Cerrar menú mobile al hacer click en un link
navMobile.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    navMobile.style.display = "none";
  });
});

// Packs para Brasil (ejemplo estático, después podemos conectarlo a backend)
const packs = [
  {
    nombre: "Pack Nostalgia Brasil",
    tipo: "Consumo final",
    descripcion: "Selección de alfajores, yerba y snacks clásicos argentinos.",
    items: [
      "Alfajores surtidos",
      "Yerba mate suave",
      "Snacks salados típicos",
      "Caramelos y dulces varios"
    ],
    precio: "Desde USD 89 / pedido aprox."
  },
  {
    nombre: "Pack Comercio Brasil",
    tipo: "Para revender",
    descripcion:
      "Pensado para bares, mercados, kioscos y cafeterías que quieran probar Argenville.",
    items: [
      "Caja de alfajores para venta",
      "Pack de yerba fraccionada",
      "Snacks en formato exhibición",
      "Material de apoyo visual digital"
    ],
    precio: "Desde USD 199 / caja aprox."
  },
  {
    nombre: "Pack Reseller Argenville",
    tipo: "Representantes",
    descripcion:
      "Pack para representantes que quieran testear productos y mostrar la experiencia Argenville.",
    items: [
      "Mix de productos estrella",
      "Muestras para degustación",
      "Soporte comercial online",
      "Acceso a condiciones especiales"
    ],
    precio: "Consultar condiciones especiales"
  }
];

const packsContainer = document.getElementById("packsContainer");

if (packsContainer) {
  packs.forEach((pack) => {
    const card = document.createElement("div");
    card.className = "card";

    card.innerHTML = `
      <div>
        <span class="badge">${pack.tipo}</span>
        <h3>${pack.nombre}</h3>
        <p>${pack.descripcion}</p>
        <ul>
          ${pack.items.map((i) => `<li>${i}</li>`).join("")}
        </ul>
      </div>
      <div>
        <p class="price">${pack.precio}</p>
      </div>
    `;

    packsContainer.appendChild(card);
  });
}

// Manejo simple del formulario (solo mensaje en pantalla, sin backend todavía)
const contactForm = document.getElementById("contactForm");
const formStatus = document.getElementById("formStatus");

if (contactForm) {
  contactForm.addEventListener("submit", (e) => {
    e.preventDefault();

    formStatus.textContent =
      "Gracias por tu mensaje. En breve un representante de Argenville te contactará.";
    formStatus.classList.remove("error");
    formStatus.classList.add("ok");

    contactForm.reset();
  });
}

// ==========================
// WIDGET JUAN PATRIOTA -> WHATSAPP
// ==========================

const juanWidget = document.querySelector(".juan-widget");

if (juanWidget) {
  juanWidget.addEventListener("click", () => {
    window.open(
      "https://wa.me/543516965911?text=Hola%20Juan%20Patriota!%20Vengo%20de%20la%20web%20Argenville%20y%20necesito%20ayuda.",
      "_blank"
    );
  });
}
