// ─── model imports for AR ────────────────────────────────────────────────────
// Each product has a `modelId` that maps to an AR_MODELS entry in ProductAR.jsx

export const products = [
  // ── Sofas & Lounge ─────────────────────────────────────────────────────────
  {
    id: 1,
    slug: "aura-modular-sofa",
    series: "Residence Line",
    name: "Aura Modular Sofa",
    price: 5200,
    material: "Charcoal Kvadrat Wool",
    category: "Sofas & Lounge",
    badge: "In Stock",
    modelId: "sofa", // → couch1.glb
    image:
      "https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?w=900&q=80",
    frameFinishes: ["#2d2c2b", "#5c5147", "#b7aa96", "#8c654d"],
    upholstery: ["#efede8", "#515151", "#7b6358", "#938272"],
    dimensions: "W 274cm x D 96cm x H 70cm",
    weight: "74kg",
    leadTime: "8-10 weeks",
    summary:
      "Deep, modular seating with tailored seams and architectural proportions made for layered living rooms and open-plan homes.",
    imageFit: "contain",
  },

  // ── Coffee Tables ──────────────────────────────────────────────────────────
  {
    id: 2,
    slug: "meridian-coffee-table",
    series: "Stone Objects",
    name: "Meridian Coffee Table",
    price: 1180,
    material: "Honed Travertine",
    category: "Coffee Tables",
    badge: "In Stock",
    modelId: "coffeetbl", // → coffee_table.glb
    image:
      "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=900&q=80",
    frameFinishes: ["#d7ccb9", "#b6a38c", "#8d7967", "#4a4138"],
    upholstery: ["#f4f0eb", "#d6d0ca", "#a39386", "#76685b"],
    dimensions: "W 120cm x D 60cm x H 42cm",
    weight: "22kg",
    leadTime: "4-6 weeks",
    summary:
      "A compact coffee table carved from travertine with crisp detailing and a softly honed surface that grounds lounge settings.",
    imageFit: "contain",
  },

  // ── Beds ───────────────────────────────────────────────────────────────────
  {
    id: 3,
    slug: "haven-king-bed",
    series: "Craftsman Series",
    name: "Haven King Bed",
    price: 6800,
    material: "Solid Walnut / Linen",
    category: "Beds",
    badge: "In Stock",
    modelId: "bed", // → bed.glb
    image:
      "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=900&q=80",
    frameFinishes: ["#4d3a2d", "#181818", "#d4c28f", "#8f4b18"],
    upholstery: ["#f0ece6", "#3a3a3a", "#7a5645", "#8f7b67"],
    dimensions: "W 198cm x D 220cm x H 110cm",
    weight: "95kg",
    leadTime: "6-8 weeks",
    summary:
      "A statement king bed with a solid walnut headboard, refined linen upholstery, and clean joinery that transforms the bedroom.",
    imageFit: "contain",
  },
  {
    id: 4,
    slug: "nordic-platform-bed",
    series: "Nordic Line",
    name: "Nordic Platform Bed",
    price: 4200,
    material: "Oiled Oak",
    category: "Beds",
    badge: "In Stock",
    modelId: "bed1", // → bed1.glb
    image:
      "https://images.unsplash.com/photo-1615874959474-d609969a20ed?w=900&q=80",
    frameFinishes: ["#5b4534", "#171717", "#cbbb84", "#9a5616"],
    upholstery: ["#f4f1ea", "#3a3a3a", "#765647", "#8d7866"],
    dimensions: "W 168cm x D 210cm x H 90cm",
    weight: "68kg",
    leadTime: "5-7 weeks",
    summary:
      "A low platform bed with a clean-lined oiled oak frame, designed for minimalist bedrooms that prioritise calm and comfort.",
    imageFit: "contain",
  },

  // ── Study & Work Desks ─────────────────────────────────────────────────────
  {
    id: 5,
    slug: "Scholar-study-desk",
    series: "Crafted Core",
    name: "Scholar Study Desk",
    price: 1950,
    material: "Solid Ash",
    category: "Desks",
    badge: "In Stock",
    modelId: "desk", // → studydesk.glb
    image:
      "https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?w=900&q=80",
    frameFinishes: ["#3b2a22", "#181818", "#d5c07f", "#8b5624"],
    upholstery: ["#f2efea", "#cbc3b6", "#8e7665", "#544840"],
    dimensions: "W 140cm x D 60cm x H 76cm",
    weight: "28kg",
    leadTime: "3-5 weeks",
    summary:
      "A clean study desk with slender ash legs and a generous writing surface, built for focused work and tidy spaces.",
    imageFit: "contain",
  },
  {
    id: 6,
    slug: "executive-work-desk",
    series: "Residence Line",
    name: "Executive Work Desk",
    price: 3400,
    material: "Walnut Veneer / Steel",
    category: "Desks",
    badge: "In Stock",
    modelId: "desk1", // → studydesk1.glb
    image:
      "https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=900&q=80",
    frameFinishes: ["#1f1f1f", "#5a4e43", "#d6c39c", "#83511d"],
    upholstery: ["#f7f6f2", "#dbd4c8", "#8e7b6b", "#615449"],
    dimensions: "W 180cm x D 80cm x H 76cm",
    weight: "52kg",
    leadTime: "5-7 weeks",
    summary:
      "An executive desk with walnut veneer top and matte steel frame, offering ample workspace with refined proportions for the modern office.",
    imageFit: "contain",
  },

  // ── Storage & Cabinets ─────────────────────────────────────────────────────
  {
    id: 7,
    slug: "arc-sideboard",
    series: "Atmosphere Collection",
    name: "Arc Sideboard",
    price: 2900,
    material: "Lacquered Oak",
    category: "Storage & Media",
    badge: "In Stock",
    modelId: "cupboard", // → Cupboard.glb
    image:
      "https://images.unsplash.com/photo-1594736797933-d0401ba2fe65?w=900&q=80",
    frameFinishes: ["#4d3a2d", "#181818", "#d4c28f", "#8f4b18"],
    upholstery: ["#f0ece6", "#3a3a3a", "#7a5645", "#8f7b67"],
    dimensions: "W 160cm x D 45cm x H 80cm",
    weight: "48kg",
    leadTime: "5-7 weeks",
    summary:
      "A low sideboard with lacquered oak doors, subtle brass hardware, and generous shelving for living and dining rooms.",
    imageFit: "contain",
  },
  {
    id: 8,
    slug: "loft-storage-cabinet",
    series: "Crafted Core",
    name: "Loft Storage Cabinet",
    price: 3800,
    material: "Solid Walnut",
    category: "Storage & Media",
    badge: "In Stock",
    modelId: "cupboard1", // → cupboard1.glb
    image:
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=900&q=80",
    frameFinishes: ["#3b2a22", "#181818", "#d5c07f", "#8b5624"],
    upholstery: ["#f2efea", "#cbc3b6", "#8e7665", "#544840"],
    dimensions: "W 90cm x D 42cm x H 190cm",
    weight: "72kg",
    leadTime: "6-8 weeks",
    summary:
      "A tall solid walnut storage cabinet with adjustable shelving and discreet push-to-open doors for a seamless wall finish.",
    imageFit: "contain",
  },

  // ── Wardrobes ──────────────────────────────────────────────────────────────
  {
    id: 9,
    slug: "minimal-wardrobe",
    series: "Nordic Line",
    name: "Minimal Wardrobe",
    price: 4500,
    material: "Matte White MDF / Brass",
    category: "Wardrobes",
    badge: "In Stock",
    modelId: "wardrobe", // → wardrobe.glb
    image:
      "https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?w=900&q=80",
    frameFinishes: ["#e8e4de", "#d4c28f", "#4a4138", "#8f4b18"],
    upholstery: ["#f5f3ef", "#e0dbd2", "#a39386", "#76685b"],
    dimensions: "W 120cm x D 58cm x H 210cm",
    weight: "88kg",
    leadTime: "7-9 weeks",
    summary:
      "A slim floor-to-ceiling wardrobe with flush matte-white doors and slim brass handles for uncluttered bedroom interiors.",
    imageFit: "contain",
  },
  {
    id: 10,
    slug: "grand-walk-in-wardrobe",
    series: "Residence Line",
    name: "Grand Walk-In Wardrobe",
    price: 8900,
    material: "Smoked Oak / Velvet Interior",
    category: "Wardrobes",
    badge: "Made to Order",
    modelId: "wardrobe1", // → wardrobe1.glb
    image:
      "https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=900&q=80",
    frameFinishes: ["#2d2c2b", "#5c5147", "#b7aa96", "#8c654d"],
    upholstery: ["#efede8", "#515151", "#7b6358", "#938272"],
    dimensions: "W 200cm x D 60cm x H 240cm",
    weight: "160kg",
    leadTime: "10-14 weeks",
    summary:
      "A grand smoked oak walk-in wardrobe with velvet-lined interior, integrated lighting, and bespoke drawer configurations.",
    imageFit: "contain",
  },

  // ── Dining Tables ──────────────────────────────────────────────────────────
  {
    id: 11,
    slug: "terra-dining-table",
    series: "Stone Objects",
    name: "Terra Dining Table",
    price: 4800,
    material: "Terrazzo / Powder-Coated Steel",
    category: "Dining Tables",
    badge: "In Stock",
    modelId: "table", // → table.glb
    image:
      "https://images.unsplash.com/photo-1617806118233-18e1de247200?w=900&q=80",
    frameFinishes: ["#d7ccb9", "#b6a38c", "#8d7967", "#4a4138"],
    upholstery: ["#f4f0eb", "#d6d0ca", "#a39386", "#76685b"],
    dimensions: "W 200cm x D 90cm x H 75cm",
    weight: "65kg",
    leadTime: "6-8 weeks",
    summary:
      "A striking terrazzo-top dining table with a slim powder-coated steel base, designed for sophisticated dining rooms.",
    imageFit: "contain",
  },
  {
    id: 12,
    slug: "Zenith-dining-table",
    series: "Crafted Core",
    name: "Zenith Dining Table",
    price: 5600,
    material: "Solid Walnut",
    category: "Dining Tables",
    badge: "In Stock",
    modelId: "dining1", // → dining table.glb
    image:
      "https://images.unsplash.com/photo-1540574163026-643ea20ade25?w=900&q=80",
    frameFinishes: ["#3b2a22", "#181818", "#d5c07f", "#8b5624"],
    upholstery: ["#f2efea", "#cbc3b6", "#8e7665", "#544840"],
    dimensions: "W 220cm x D 95cm x H 75cm",
    weight: "88kg",
    leadTime: "7-9 weeks",
    summary:
      "A generous solid walnut dining table with hand-finished edges and tapered legs, crafted for family gatherings.",
    imageFit: "contain",
  },
  {
    id: 13,
    slug: "harvest-oval-table",
    series: "Craftsman Series",
    name: "Harvest Oval Table",
    price: 6200,
    material: "Oiled Oak",
    category: "Dining Tables",
    badge: "In Stock",
    modelId: "dining2", // → dining table1.glb
    image:
      "https://images.unsplash.com/photo-1536349788264-1b816db3cc13?w=900&q=80",
    frameFinishes: ["#5b4534", "#171717", "#cbbb84", "#9a5616"],
    upholstery: ["#f4f1ea", "#3a3a3a", "#765647", "#8d7866"],
    dimensions: "W 210cm x D 100cm x H 75cm",
    weight: "92kg",
    leadTime: "8-10 weeks",
    summary:
      "An oval oiled oak dining table with a sculptural pedestal base, softening large dining rooms with warmth and fluidity.",
    imageFit: "contain",
  },
  {
    id: 14,
    slug: "compact-bistro-table",
    series: "Atmosphere Collection",
    name: "Compact Bistro Table",
    price: 2100,
    material: "Powder-Coated Steel / Marble",
    category: "Dining Tables",
    badge: "In Stock",
    modelId: "dining3", // → dining table2.glb
    image:
      "https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?w=900&q=80",
    frameFinishes: ["#1f1f1f", "#5a4e43", "#d6c39c", "#83511d"],
    upholstery: ["#f7f6f2", "#dbd4c8", "#8e7b6b", "#615449"],
    dimensions: "W 80cm x D 80cm x H 75cm",
    weight: "24kg",
    leadTime: "3-4 weeks",
    summary:
      "A compact bistro table with a marble top and matte black steel base — ideal for breakfast nooks, balconies, or cosy dining corners.",
    imageFit: "contain",
  },
  {
    id: 15,
    slug: "solstice-meja-makan",
    series: "Crafted Core",
    name: "Solstice Meja Makan",
    price: 3900,
    material: "Reclaimed Teak",
    category: "Dining Tables",
    badge: "In Stock",
    modelId: "table1", // → table1.glb
    image:
      "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=900&q=80",
    frameFinishes: ["#4a3728", "#181818", "#c8b87a", "#784012"],
    upholstery: ["#f0ece6", "#cbc3b6", "#8e7665", "#6b5a4e"],
    dimensions: "W 180cm x D 88cm x H 75cm",
    weight: "78kg",
    leadTime: "6-8 weeks",
    summary:
      "A reclaimed teak dining table with a rich grain finish and sturdy cross-base, bringing natural character to any dining room.",
    imageFit: "contain",
  },
];

export function getProductBySlug(slug) {
  return products.find((product) => product.slug === slug);
}
