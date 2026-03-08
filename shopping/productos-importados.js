// productos-regionales.js — Catálogo Argenville Regionales y Folclore
// Cargar este archivo ANTES de tienda-regionales.html
// Define la variable global: window.PRODUCTOS adaptada al HTML

window.PRODUCTOS = [
  // ==========================================
  // PACKS GAUCHOS (Categoría: packs)
  // ==========================================
  {
    "id": "reg-pack-001",
    "name": "Pack Matero Completo Premium",
    "desc": "Llevate todo: Mate Imperial, Termo estilo Stanley de 1L, Bombilla de alpaca y Bolso Matero 100% cuero.",
    "category": "packs",
    "price": 175.00,
    "chip": "Súper Pack",
    "tags": ["Set", "Matero", "Regalo"],
    "image": "https://images.unsplash.com/photo-1601614216843-6c70014022a1?auto=format&fit=crop&q=80&w=600"
  },
  {
    "id": "reg-pack-002",
    "name": "Pack Asador Gaucho",
    "desc": "Juego de cuchillo y tenedor artesanales con mango de madera y asta. Incluye estuche de cuero crudo.",
    "category": "packs",
    "price": 110.00,
    "chip": "Ideal Asado",
    "tags": ["Asado", "Cuchillería", "Set"],
    "image": "https://images.unsplash.com/photo-1590412200988-a436970781fa?auto=format&fit=crop&q=80&w=600"
  },

  // ==========================================
  // MATES Y BOMBILLAS (Categoría: Mates)
  // ==========================================
  {
    "id": "reg-mat-001",
    "name": "Mate Imperial Premium",
    "desc": "Calabaza gruesa seleccionada, forrado en cuero vaqueta con virola de alpaca cincelada a mano.",
    "category": "Mates",
    "price": 45.50,
    "chip": "Top Ventas",
    "tags": ["Mate", "Imperial", "Alpaca"],
    "image": "https://images.unsplash.com/photo-1555581298-500b46d03099?auto=format&fit=crop&q=80&w=600"
  },
  {
    "id": "reg-mat-002",
    "name": "Mate Torpedo Uruguayo",
    "desc": "Clásico mate torpedo forrado en cuero negro. Tamaño ideal para un mate duradero y de buen rendimiento.",
    "category": "Mates",
    "price": 32.00,
    "chip": "Clásico",
    "tags": ["Mate", "Torpedo", "Cuero"],
    "image": "https://images.unsplash.com/photo-1627440409748-0348dbf37b13?auto=format&fit=crop&q=80&w=600"
  },
  {
    "id": "reg-mat-003",
    "name": "Bombilla Pico de Loro Alpaca",
    "desc": "Bombilla artesanal con filtro de pala ancha, labrada a mano en alpaca maciza. No se tapa.",
    "category": "Mates",
    "price": 28.50,
    "chip": "",
    "tags": ["Bombilla", "Alpaca", "Artesanal"],
    "image": "https://images.unsplash.com/photo-1647427017056-b0e6fb1c4915?auto=format&fit=crop&q=80&w=600"
  },

  // ==========================================
  // NUESTROS CUEROS (Categoría: Cuero)
  // ==========================================
  {
    "id": "reg-cue-001",
    "name": "Mochila Matera de Cuero Crudo",
    "desc": "Mochila 100% cuero genuino. Espacio reforzado para termo grande, mate, yerbera y azucarera.",
    "category": "Cuero",
    "price": 85.00,
    "chip": "Premium",
    "tags": ["Bolso", "Cuero", "Marroquinería"],
    "image": "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&q=80&w=600"
  },
  {
    "id": "reg-cue-002",
    "name": "Billetera Hombre de Carpincho",
    "desc": "Billetera tradicional con diseño clásico. Máxima suavidad y durabilidad. Costuras a mano.",
    "category": "Cuero",
    "price": 35.00,
    "chip": "Regalo Ideal",
    "tags": ["Billetera", "Carpincho"],
    "image": "https://images.unsplash.com/photo-1627123424574-724758594e93?auto=format&fit=crop&q=80&w=600"
  },

  // ==========================================
  // PONCHOS Y TEXTILES (Categoría: Textil)
  // ==========================================
  {
    "id": "reg-tex-001",
    "name": "Poncho Salteño Tradicional",
    "desc": "Tejido en telar, color rojo con guardas negras. El símbolo indiscutido del folclore argentino.",
    "category": "Textil",
    "price": 120.00,
    "chip": "Patrimonio",
    "tags": ["Poncho", "Tejido", "Gaucho"],
    "image": "https://images.unsplash.com/photo-1605001011153-6258ff0ba8e7?auto=format&fit=crop&q=80&w=600"
  },
  {
    "id": "reg-tex-002",
    "name": "Alpargatas de Lona Reforzadas",
    "desc": "Calzado fresco y súper cómodo. Suela de yute antideslizante, ideales para el campo o la ciudad.",
    "category": "Textil",
    "price": 18.00,
    "chip": "Básico",
    "tags": ["Alpargata", "Calzado"],
    "image": "https://images.unsplash.com/photo-1515347619362-d9657b018596?auto=format&fit=crop&q=80&w=600"
  },
  {
    "id": "reg-tex-003",
    "name": "Boina Vasca de Lana Tejida",
    "desc": "Accesorio tradicional tejido en lana. Talle universal, perfecta para protegerse del frío con estilo.",
    "category": "Textil",
    "price": 22.00,
    "chip": "",
    "tags": ["Boina", "Lana", "Campo"],
    "image": "https://images.unsplash.com/photo-1579247926958-3d23f790dd28?auto=format&fit=crop&q=80&w=600"
  },

  // ==========================================
  // CUCHILLERÍA (Categoría: Cuchillos)
  // ==========================================
  {
    "id": "reg-cuc-001",
    "name": "Cuchillo Facón de Plata y Oro",
    "desc": "Hoja de acero al carbono de 20cm forjada a mano. Cabo y vaina con hermosos apliques finos.",
    "category": "Cuchillos",
    "price": 190.00,
    "chip": "Colección",
    "tags": ["Facón", "Plata", "Artesanal"],
    "image": "https://images.unsplash.com/photo-1589139031735-e10db33454b8?auto=format&fit=crop&q=80&w=600"
  },
  {
    "id": "reg-cuc-002",
    "name": "Cuchillo Verijero con Mango de Ciervo",
    "desc": "Hoja de 14cm, tamaño ideal para llevar en la cintura y comer asado. Incluye vaina de suela pesada.",
    "category": "Cuchillos",
    "price": 65.00,
    "chip": "Único",
    "tags": ["Verijero", "Asta", "Asado"],
    "image": "https://images.unsplash.com/photo-1593618998160-e34014e67546?auto=format&fit=crop&q=80&w=600"
  }
];