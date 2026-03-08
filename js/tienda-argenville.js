document.addEventListener("DOMContentLoaded", () => {
  const lista = document.getElementById("productos-lista");
  const buscador = document.getElementById("search-productos");
  const chipsCategoria = document.querySelectorAll(".filters .chip[data-category]");

  let productos = [];
  let categoriaActiva = "all";

  // 1) Cargar productos desde JSON
  fetch("../data/productos-argenville.json")
    .then((res) => res.json())
    .then((data) => {
      productos = data;
      renderProductos();
    })
    .catch((err) => {
      console.error("Error cargando productos:", err);
      lista.innerHTML = "<p>Error al cargar productos.</p>";
    });

  // 2) Renderizar productos
  function renderProductos() {
    if (!lista) return;

    const texto = (buscador?.value || "").toLowerCase().trim();

    const filtrados = productos.filter((p) => {
      const coincideCategoria =
        categoriaActiva === "all" || p.categoria === categoriaActiva;

      const textoPlano =
        (p.nombre || "").toLowerCase() +
        " " +
        (p.descripcion || "").toLowerCase();

      const coincideBusqueda = texto === "" || textoPlano.includes(texto);

      return coincideCategoria && coincideBusqueda;
    });

    if (filtrados.length === 0) {
      lista.innerHTML =
        "<p>No encontramos productos con esos filtros. Probá limpiarlos o buscar otra cosa.</p>";
      return;
    }

    lista.innerHTML = filtrados
      .map((p) => crearCardProducto(p))
      .join("");
  }

  // 3) Card de producto (HTML)
  function crearCardProducto(p) {
    const precio = p.precioUsd
      ? `USD ${p.precioUsd}`
      : "Consultar";

    return `
      <article class="producto-card">
        <div class="producto-img">
          <img src="${p.imagen}" alt="${p.nombre}" />
        </div>
        <div class="producto-body">
          <h3 class="producto-title">${p.nombre}</h3>
          <p class="producto-desc">${p.descripcion || ""}</p>
          <div class="producto-meta">
            <span class="producto-precio">${precio}</span>
          </div>
          <button class="btn-add" data-id="${p.id}">
            Agregar al pedido
          </button>
        </div>
      </article>
    `;
  }

  // 4) Click en filtros por categoría
  chipsCategoria.forEach((chip) => {
    chip.addEventListener("click", () => {
      chipsCategoria.forEach((c) => c.classList.remove("chip-active"));
      chip.classList.add("chip-active");
      categoriaActiva = chip.dataset.category || "all";
      renderProductos();
    });
  });

  // 5) Buscador
  if (buscador) {
    buscador.addEventListener("input", () => {
      renderProductos();
    });
  }

  // 6) Manejo simple de "Agregar al pedido"
  lista?.addEventListener("click", (e) => {
    const btn = e.target.closest(".btn-add");
    if (!btn) return;

    const id = parseInt(btn.dataset.id, 10);
    const producto = productos.find((p) => p.id === id);
    if (!producto) return;

    // Por ahora solo logueamos, después lo conectamos al carrito real
    console.log("Agregar al pedido:", producto);
    alert(`Se agregó al pedido: ${producto.nombre}`);
  });
});

