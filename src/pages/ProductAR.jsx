import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Link, useNavigate, useParams } from "react-router-dom";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { Check, X, Info } from "lucide-react";

// ─── GLB model imports ─────────────────────────────────────────────────────────
import couchModel        from "../assets/couch1.glb";
import couch2Model       from "../assets/couch.glb";
import tableModel        from "../assets/table.glb";
import table1Model       from "../assets/table1.glb";
import coffeeTableModel  from "../assets/coffee_table.glb";
import bedModel          from "../assets/bed.glb";
import bed1Model         from "../assets/bed1.glb";
import studydeskModel    from "../assets/studydesk.glb";
import studydesk1Model   from "../assets/studydesk1.glb";
import cupboardModel     from "../assets/Cupboard.glb";
import cupboard1Model    from "../assets/cupboard1.glb";
import wardrobeModel     from "../assets/wardrobe.glb";
import wardrobe1Model    from "../assets/wardrobe1.glb";
import diningTableModel  from "../assets/dining table.glb";
import diningTable1Model from "../assets/dining table1.glb";
import diningTable2Model from "../assets/dining table2.glb";

// ─── Texture imports ───────────────────────────────────────────────────────────
import fabricColorUrl     from "../assets/Fabric066_2K-JPG/Fabric066_2K-JPG_Color.jpg";
import fabricNormalUrl    from "../assets/Fabric066_2K-JPG/Fabric066_2K-JPG_NormalGL.jpg";
import fabricRoughnessUrl from "../assets/Fabric066_2K-JPG/Fabric066_2K-JPG_Roughness.jpg";
import fabricAOUrl        from "../assets/Fabric066_2K-JPG/Fabric066_2K-JPG_AmbientOcclusion.jpg";
import tableclothColorUrl     from "../assets/Fabric055_2K-JPG/Fabric055_2K-JPG_Color.jpg";
import tableclothNormalUrl    from "../assets/Fabric055_2K-JPG/Fabric055_2K-JPG_NormalGL.jpg";
import tableclothRoughnessUrl from "../assets/Fabric055_2K-JPG/Fabric055_2K-JPG_Roughness.jpg";
import tableclothAOUrl        from "../assets/Fabric055_2K-JPG/Fabric055_2K-JPG_AmbientOcclusion.jpg";
import woodColorUrl    from "../assets/Wood060_2K-JPG/Wood060_2K-JPG_Color.jpg";
import woodNormalUrl   from "../assets/Wood060_2K-JPG/Wood060_2K-JPG_NormalGL.jpg";
import woodRoughUrl    from "../assets/Wood060_2K-JPG/Wood060_2K-JPG_Roughness.jpg";
import woodAOUrl       from "../assets/Wood060_2K-JPG/Wood060_2K-JPG_AmbientOcclusion.jpg";
import { getProductBySlug } from "../data/products";

// ─── Texture URL maps ──────────────────────────────────────────────────────────
const FABRIC_URLS = {
  color: fabricColorUrl, normal: fabricNormalUrl,
  roughness: fabricRoughnessUrl, ao: fabricAOUrl,
};
const TABLECLOTH_URLS = {
  color: tableclothColorUrl, normal: tableclothNormalUrl,
  roughness: tableclothRoughnessUrl, ao: tableclothAOUrl,
};
const WOOD_URLS = { color: woodColorUrl, normal: woodNormalUrl, roughness: woodRoughUrl, ao: woodAOUrl };

// ─── Color palette options ─────────────────────────────────────────────────────

// Generic wood/metal frame options (Tab Material)
const FRAME_OPTIONS = [
  { id: "wood-natural", label: "Kayu Natural", type: "wood",  hex: 0x9C6B3C, roughness: 0.85, metalness: 0.0 },
  { id: "wood-dark",    label: "Kayu Gelap",   type: "wood",  hex: 0x3B1F0E, roughness: 0.80, metalness: 0.0 },
  { id: "wood-ash",     label: "Kayu Abu",     type: "wood",  hex: 0xC0A882, roughness: 0.88, metalness: 0.0 },
  { id: "wood-honey",   label: "Kayu Madu",    type: "wood",  hex: 0xB8750A, roughness: 0.82, metalness: 0.0 },
  { id: "metal-black",  label: "Besi Hitam",   type: "metal", hex: 0x1C1C1C, roughness: 0.25, metalness: 0.85 },
  { id: "metal-silver", label: "Besi Silver",  type: "metal", hex: 0x9E9E9E, roughness: 0.28, metalness: 0.90 },
  { id: "metal-gold",   label: "Kuningan",     type: "metal", hex: 0xB8860B, roughness: 0.18, metalness: 0.92 },
  { id: "metal-bronze", label: "Perunggu",     type: "metal", hex: 0x8C6D3F, roughness: 0.30, metalness: 0.88 },
];

// Fabric / cushion colors (Tab Warna for sofas, beds)
const FABRIC_OPTIONS = [
  { id: "natural",    label: "Natural",    hex: 0xD4C4B0 },
  { id: "ivory",      label: "Ivory",      hex: 0xF5F0E8 },
  { id: "charcoal",   label: "Charcoal",   hex: 0x3A3A3A },
  { id: "slate",      label: "Slate",      hex: 0x6B7280 },
  { id: "terracotta", label: "Terracotta", hex: 0xC4614B },
  { id: "sage",       label: "Sage",       hex: 0x7A9E84 },
  { id: "navy",       label: "Navy",       hex: 0x3D5878 },
  { id: "blush",      label: "Blush",      hex: 0xD4927A },
  { id: "olive",      label: "Olive",      hex: 0x6B6E34 },
  { id: "mustard",    label: "Mustard",    hex: 0xC8940E },
];

// Tablecloth colors (Fabric055 — Tab Warna for dining1/dining2)
const TABLECLOTH_OPTIONS = [
  { id: "linen",      label: "Linen",       hex: 0xE8DFD0 },
  { id: "cream",      label: "Cream",       hex: 0xFAF3E0 },
  { id: "ash",        label: "Abu",         hex: 0xB0ADA8 },
  { id: "mocha",      label: "Mocha",       hex: 0x7D6552 },
  { id: "forest",     label: "Hijau Hutan", hex: 0x4A6741 },
  { id: "burgundy",   label: "Burgundy",    hex: 0x722F37 },
  { id: "navy-tbl",   label: "Navy",        hex: 0x2C3E6B },
  { id: "dusty-rose", label: "Dusty Rose",  hex: 0xC49A8A },
];

// Body/paint colors (Tab Warna for storage furniture, tables)
const BODY_OPTIONS = [
  { id: "white",      label: "Putih",      hex: 0xF5F5F0, roughness: 0.25 },
  { id: "cream",      label: "Krem",       hex: 0xF0EBD8, roughness: 0.28 },
  { id: "light-gray", label: "Abu Muda",   hex: 0xCCCCCC, roughness: 0.30 },
  { id: "dark-gray",  label: "Abu Tua",    hex: 0x555555, roughness: 0.35 },
  { id: "black",      label: "Hitam",      hex: 0x1A1A1A, roughness: 0.30 },
  { id: "walnut",     label: "Walnut",     hex: 0x5C3317, roughness: 0.75 },
  { id: "oak",        label: "Oak",        hex: 0xC9A96E, roughness: 0.70 },
  { id: "sage-green", label: "Hijau Sage", hex: 0x8FAF8A, roughness: 0.35 },
  { id: "navy-blue",  label: "Biru Navy",  hex: 0x2C3E6B, roughness: 0.35 },
  { id: "terracotta", label: "Terracotta", hex: 0xC4614B, roughness: 0.40 },
];

// ─── Per-model material slot definitions ───────────────────────────────────────
//
// Each entry defines HOW to customize a specific model:
//   primarySlot:   { label, options, textureSet? }  → Tab Material
//   secondarySlot: { label, options, textureSet? }  → Tab Warna
//
// matTarget: which meshes/material-names to paint. Strategy:
//   { nodeNames: [...] }   – paint meshes whose THREE node.name is in the list
//   { matNames: [...] }    – paint primitives whose original material name is in the list
//   { primIndices: [...] } – paint specific primitive indices on all meshes
//   { all: true }          – paint all meshes
//   { except: [...] }      – paint all EXCEPT listed node names
//
// textureSet: "wood" | "fabric" | "tablecloth" | null (= solid color only)
//
const MODEL_SLOTS = {
  // ── Sofa 1 (couch1) ──────────────────────────────────────────────────────
  // From GLB: all nodes use "fabric" material except "legs" (metal).
  // Primary = kaki metal. Secondary = semua kain (body+cushion+pillow).
  sofa: {
    primarySlot: {
      label: "Kaki Sofa",
      icon: "🪑",
      options: FRAME_OPTIONS.filter(o => o.type === "metal"),
      defaultId: "metal-silver",
      matTarget: { nodeNames: ["legs"] },
      textureSet: null,
    },
    secondarySlot: {
      label: "Warna Kain",
      icon: "🧶",
      options: FABRIC_OPTIONS,
      defaultId: "natural",
      matTarget: { nodeNames: ["back", "Back cousion", "Back cousion.001", "Back cousion.002",
                               "seat cousion", "seat cousion.001", "seat cousion.002",
                               "pillow.001", "pillow.002", "pillow.003",
                               "bottom", "sides"] },
      textureSet: "fabric",
    },
  },

  // ── Sofa 2 (couch) ────────────────────────────────────────────────────────
  // Same mesh structure as Sofa 1 (same GLB, same node names)
  sofa2: {
    primarySlot: {
      label: "Kaki Sofa",
      icon: "🪑",
      options: FRAME_OPTIONS.filter(o => o.type === "metal"),
      defaultId: "metal-black",
      matTarget: { nodeNames: ["legs"] },
      textureSet: null,
    },
    secondarySlot: {
      label: "Warna Kain",
      icon: "🧶",
      options: FABRIC_OPTIONS,
      defaultId: "charcoal",
      matTarget: { nodeNames: ["back", "Back cousion", "Back cousion.001", "Back cousion.002",
                               "seat cousion", "seat cousion.001", "seat cousion.002",
                               "pillow.001", "pillow.002", "pillow.003",
                               "bottom", "sides"] },
      textureSet: "fabric",
    },
  },

  // ── Meja Makan 1 (table.glb) ─────────────────────────────────────────────
  // Nodes: CandleStick (dekorasi), Corpus/Corpus.002/Drawer Back/Drawer Front (kayu meja)
  table: {
    primarySlot: {
      label: "Warna Kayu Meja",
      icon: "🪵",
      options: FRAME_OPTIONS.filter(o => o.type === "wood"),
      defaultId: "wood-natural",
      matTarget: { nodeNames: ["Corpus", "Corpus.002", "Drawer Back", "Drawer Front"] },
      textureSet: "wood",
    },
    secondarySlot: null,
  },

  // ── Meja Makan 2 (table1.glb) ────────────────────────────────────────────
  // Single node "table" with 2 prims: prim0=table(wood), prim1=steel
  table1: {
    primarySlot: {
      label: "Material Meja",
      icon: "🪵",
      options: FRAME_OPTIONS,
      defaultId: "wood-natural",
      matTarget: { matNames: ["table"] },
      textureSet: "wood",
    },
    secondarySlot: {
      label: "Warna Kaki/Besi",
      icon: "⚙️",
      options: FRAME_OPTIONS.filter(o => o.type === "metal"),
      defaultId: "metal-silver",
      matTarget: { matNames: ["steel"] },
      textureSet: null,
    },
  },

  // ── Meja Kopi (coffee_table.glb) ─────────────────────────────────────────
  // Single node "Object_2" with 1 prim: None.001 (wood/marble finish)
  coffeetbl: {
    primarySlot: null,
    secondarySlot: {
      label: "Warna Meja Kopi",
      icon: "☕",
      options: BODY_OPTIONS,
      defaultId: "walnut",
      matTarget: { all: true },
      textureSet: "wood",
    },
  },

  // ── Kasur 1 (bed.glb) ────────────────────────────────────────────────────
  // Single node "Modern Bed" with 7 prims:
  // prim0=Fabric5, prim1=Fabric2, prim2=Fabric1 → fabric/kasur
  // prim3=Base (grey, no tex) → rangka/base
  // prim4=Metal (black metal) → kaki
  // prim5=Fabric3, prim6=Fabric4 → fabric
  bed: {
    primarySlot: {
      label: "Rangka Kasur",
      icon: "🪑",
      options: BODY_OPTIONS,
      defaultId: "light-gray",
      matTarget: { matNames: ["Base"] },
      textureSet: null,
    },
    secondarySlot: {
      label: "Warna Kain Kasur",
      icon: "🛌",
      options: FABRIC_OPTIONS,
      defaultId: "ivory",
      matTarget: { matNames: ["Fabric5", "Fabric2", "Fabric1", "Fabric3", "Fabric4"] },
      textureSet: "fabric",
    },
  },

  // ── Kasur 2 (bed1.glb) ───────────────────────────────────────────────────
  // Nodes: Plane/Plane.001=wood frame, Plane.002=Metal legs,
  //        Mattress/Plane.004-.006=Fabric19, Plane.003/Plane.010=Fabric03, Bed 01=headboard
  bed1: {
    primarySlot: {
      label: "Rangka Kasur",
      icon: "🪵",
      options: FRAME_OPTIONS,
      defaultId: "wood-dark",
      matTarget: { nodeNames: ["Plane", "Plane.001", "Plane.002"] },
      textureSet: "wood",
    },
    secondarySlot: {
      label: "Warna Kain",
      icon: "🛌",
      options: FABRIC_OPTIONS,
      defaultId: "ivory",
      matTarget: { nodeNames: ["Mattress", "Plane.003", "Plane.004", "Plane.005", "Plane.006", "Plane.010", "Bed 01"] },
      textureSet: "fabric",
    },
  },

  // ── Meja Belajar (studydesk.glb) ─────────────────────────────────────────
  // Single node "Wooden desk" prim0=Desk wood
  desk: {
    primarySlot: null,
    secondarySlot: {
      label: "Warna Kayu",
      icon: "📖",
      options: FRAME_OPTIONS.filter(o => o.type === "wood"),
      defaultId: "wood-natural",
      matTarget: { all: true },
      textureSet: "wood",
    },
  },

  // ── Meja Kerja (studydesk1.glb) ──────────────────────────────────────────
  // Single node "Wodden desk" prim0=Desk wood, prim1=Frozen white metal
  desk1: {
    primarySlot: {
      label: "Warna Kayu",
      icon: "🪵",
      options: FRAME_OPTIONS.filter(o => o.type === "wood"),
      defaultId: "wood-natural",
      matTarget: { matNames: ["Desk wood"] },
      textureSet: "wood",
    },
    secondarySlot: {
      label: "Warna Besi/Badan",
      icon: "💼",
      options: BODY_OPTIONS,
      defaultId: "white",
      matTarget: { matNames: ["Frozen white metal"] },
      textureSet: null,
    },
  },

  // ── Lemari 1 (Cupboard.glb) ──────────────────────────────────────────────
  // Single node, 1 prim: GWC_Cupboard_05 (wood tex, metalness:1)
  cupboard: {
    primarySlot: null,
    secondarySlot: {
      label: "Warna Lemari",
      icon: "🗄️",
      options: BODY_OPTIONS,
      defaultId: "walnut",
      matTarget: { all: true },
      textureSet: "wood",
    },
  },

  // ── Lemari 2 (cupboard1.glb) ─────────────────────────────────────────────
  // Single node "Cabinet" 6 prims:
  // prim0,4 = Persian walnut (kayu)
  // prim2 = white paint (body)
  // prim1 = metal, prim3 = black plastic, prim5 = glass
  cupboard1: {
    primarySlot: {
      label: "Kayu Lemari",
      icon: "🪵",
      options: FRAME_OPTIONS.filter(o => o.type === "wood"),
      defaultId: "wood-dark",
      matTarget: { matNames: ["Persian walnut PBR texture seamless.003", "Persian walnut PBR texture seamless.002"] },
      textureSet: "wood",
    },
    secondarySlot: {
      label: "Warna Body",
      icon: "🎨",
      options: BODY_OPTIONS,
      defaultId: "white",
      matTarget: { matNames: ["white paint.001"] },
      textureSet: null,
    },
  },

  // ── Wardrobe 1 (wardrobe.glb) ────────────────────────────────────────────
  // Single node "Modern Wardrobe White"
  // prim0=Wardrobe_White (grey, no tex) → body
  // prim1=Wardrobe_Black (black) → trim/accent
  wardrobe: {
    primarySlot: {
      label: "Warna Body",
      icon: "👕",
      options: BODY_OPTIONS,
      defaultId: "white",
      matTarget: { matNames: ["Wardrobe_White"] },
      textureSet: null,
    },
    secondarySlot: {
      label: "Warna Aksen",
      icon: "🎨",
      options: BODY_OPTIONS,
      defaultId: "black",
      matTarget: { matNames: ["Wardrobe_Black"] },
      textureSet: null,
    },
  },

  // ── Wardrobe 2 (wardrobe1.glb) ───────────────────────────────────────────
  // Single node "Wardrobe classic"
  // prim0=Desk wood (wood tex) → kayu
  // prim1=Metal (metal tex) → aksen logam
  wardrobe1: {
    primarySlot: {
      label: "Kayu Lemari",
      icon: "🪵",
      options: FRAME_OPTIONS.filter(o => o.type === "wood"),
      defaultId: "wood-natural",
      matTarget: { matNames: ["Desk wood"] },
      textureSet: "wood",
    },
    secondarySlot: {
      label: "Aksen Metal",
      icon: "⚙️",
      options: FRAME_OPTIONS.filter(o => o.type === "metal"),
      defaultId: "metal-silver",
      matTarget: { matNames: ["Metal"] },
      textureSet: null,
    },
  },

  // ── Meja Makan 3 (dining table.glb) — "dining1" ──────────────────────────
  // Nodes: chair1-4 (Material_chair), table (Material_table)
  dining1: {
    primarySlot: {
      label: "Warna Kursi",
      icon: "🪑",
      options: BODY_OPTIONS,
      defaultId: "walnut",
      matTarget: { nodeNames: ["chair1", "chair2", "chair3", "chair4"] },
      textureSet: "wood",
    },
    secondarySlot: {
      label: "Warna Meja",
      icon: "🍽️",
      options: BODY_OPTIONS,
      defaultId: "walnut",
      matTarget: { nodeNames: ["table"] },
      textureSet: "wood",
    },
  },

  // ── Meja Makan 4 (dining table1.glb) — "dining2" ─────────────────────────
  // Nodes: chair1-4 (miliesetchair_material), Table (milietblematerial), Plane (taplak/Bentley fabric)
  dining2: {
    primarySlot: {
      label: "Kursi & Meja",
      icon: "🪑",
      options: FRAME_OPTIONS,
      defaultId: "wood-natural",
      matTarget: { matNames: ["miliesetchair_material.001", "milietblematerial.001"] },
      textureSet: "wood",
    },
    secondarySlot: {
      label: "Warna Taplak",
      icon: "🧺",
      options: TABLECLOTH_OPTIONS,
      defaultId: "linen",
      matTarget: { nodeNames: ["Plane"] },
      textureSet: "tablecloth",
    },
  },

  // ── Meja Makan 5 (dining table2.glb) — "dining3" ─────────────────────────
  // Nodes: Chair×6 + Table → each has prim0=Table_White_Wood + prim1=Table_Marble
  // Chair_Screws×6 → Screw_Metal
  dining3: {
    primarySlot: {
      label: "Warna Kayu/Body",
      icon: "🪵",
      options: BODY_OPTIONS,
      defaultId: "white",
      matTarget: { matNames: ["Table_White_Wood"] },
      textureSet: "wood",
    },
    secondarySlot: {
      label: "Aksen Marmer",
      icon: "🍽️",
      options: BODY_OPTIONS,
      defaultId: "light-gray",
      matTarget: { matNames: ["Table_Marble"] },
      textureSet: null,
    },
  },
};

// ─── AR Models ────────────────────────────────────────────────────────────────
const AR_MODELS = [
  { id: "sofa",      label: "Sofa",         modelUrl: couchModel,        initialScale: 1, icon: "🛋️", group: "Ruang Tamu"  },
  { id: "sofa2",     label: "Sofa 2",        modelUrl: couch2Model,       initialScale: 1, icon: "🛋️", group: "Ruang Tamu"  },
  { id: "table",     label: "Meja Makan",   modelUrl: tableModel,        initialScale: 1, icon: "🍽️", group: "Ruang Makan" },
  { id: "table1",    label: "Meja Makan 2", modelUrl: table1Model,       initialScale: 1, icon: "🍽️", group: "Ruang Makan" },
  { id: "coffeetbl", label: "Meja Kopi",    modelUrl: coffeeTableModel,  initialScale: 1, icon: "☕",  group: "Ruang Tamu"  },
  { id: "bed",       label: "Kasur 1",      modelUrl: bedModel,          initialScale: 1, icon: "🛏️", group: "Kamar Tidur" },
  { id: "bed1",      label: "Kasur 2",      modelUrl: bed1Model,         initialScale: 1, icon: "🛏️", group: "Kamar Tidur" },
  { id: "desk",      label: "Meja Belajar", modelUrl: studydeskModel,    initialScale: 1, icon: "📖", group: "Kamar Tidur" },
  { id: "desk1",     label: "Meja Kerja",   modelUrl: studydesk1Model,   initialScale: 1, icon: "💼", group: "Ruang Kerja" },
  { id: "cupboard",  label: "Lemari",       modelUrl: cupboardModel,     initialScale: 1, icon: "🗄️", group: "Penyimpanan" },
  { id: "cupboard1", label: "Lemari 2",     modelUrl: cupboard1Model,    initialScale: 1, icon: "🗄️", group: "Penyimpanan" },
  { id: "wardrobe",  label: "Wardrobe",     modelUrl: wardrobeModel,     initialScale: 1, icon: "👕", group: "Penyimpanan" },
  { id: "wardrobe1", label: "Wardrobe 2",   modelUrl: wardrobe1Model,    initialScale: 1, icon: "👗", group: "Penyimpanan" },
  { id: "dining1",   label: "Meja Makan 3", modelUrl: diningTableModel,  initialScale: 1, icon: "🍽️", group: "Ruang Makan" },
  { id: "dining2",   label: "Meja Makan 4", modelUrl: diningTable1Model, initialScale: 1, icon: "🍽️", group: "Ruang Makan" },
  { id: "dining3",   label: "Meja Makan 5", modelUrl: diningTable2Model, initialScale: 1, icon: "🍽️", group: "Ruang Makan" },
];

// ─── Status config ─────────────────────────────────────────────────────────────
const STATUS_PILL = {
  loading:       { color: "#9ca3af", label: "Memuat..."      },
  permission:    { color: "#f59e0b", label: "Izinkan Kamera" },
  scanning:      { color: "#22c55e", label: "AR Ready"        },
  placed:        { color: "#22c55e", label: "AR Aktif"        },
  failed:        { color: "#ef4444", label: "AR Gagal"        },
  unsupported:   { color: "#9ca3af", label: "Tidak Didukung"  },
  "load-origin": { color: "#60a5fa", label: "Tap Lantai"      },
};

const STATUS_TEXT = {
  loading:       "Menyiapkan AR engine dan scene.",
  permission:    "Izinkan akses kamera untuk melihat furniture di ruangan Anda.",
  scanning:      "Pilih furniture, arahkan kamera ke lantai, lalu tap untuk menempatkan.",
  placed:        "Tap untuk pindah · cubit untuk scale · putar 2 jari untuk rotate.",
  failed:        "AR gagal. Lihat detail error.",
  unsupported:   "8th Wall belum tersedia. Pastikan engine dimuat dari /external/xr.",
  "load-origin": "Tap lantai untuk menempatkan layout yang dimuat.",
};

// ─── Texture helpers ───────────────────────────────────────────────────────────
function applyTexSettings(tex, repeatU = 3, repeatV = 3) {
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(repeatU, repeatV);
  tex.needsUpdate = true;
}

function loadTextureSet(loader, urls, onDone) {
  const result = {}; let loaded = 0;
  const keys = Object.keys(urls);
  keys.forEach((key) => {
    result[key] = loader.load(urls[key], () => { loaded += 1; if (loaded === keys.length) onDone(result); });
  });
}

// ─── Material factories ────────────────────────────────────────────────────────
function makeColorMaterial(hex, roughness = 0.7, metalness = 0.0) {
  return new THREE.MeshStandardMaterial({
    color: new THREE.Color(hex),
    roughness, metalness, envMapIntensity: 1.2,
  });
}

function makeFrameMaterial(opt, woodTextures) {
  if (opt.type === "metal") {
    return new THREE.MeshStandardMaterial({
      color: new THREE.Color(opt.hex),
      roughness: opt.roughness,
      metalness: opt.metalness,
      envMapIntensity: 1.5,
    });
  }
  // wood
  if (!woodTextures) {
    return new THREE.MeshStandardMaterial({ color: new THREE.Color(opt.hex), roughness: opt.roughness, metalness: 0.0 });
  }
  const mat = new THREE.MeshStandardMaterial({
    map: woodTextures.color.clone(), normalMap: woodTextures.normal.clone(),
    roughnessMap: woodTextures.roughness.clone(), aoMap: woodTextures.ao?.clone() ?? null,
    color: new THREE.Color(opt.hex), roughness: 1.0, metalness: 0.0,
  });
  if (mat.map)          { mat.map.colorSpace = THREE.SRGBColorSpace; applyTexSettings(mat.map, 2, 2); }
  if (mat.normalMap)    applyTexSettings(mat.normalMap, 2, 2);
  if (mat.roughnessMap) applyTexSettings(mat.roughnessMap, 2, 2);
  if (mat.aoMap)        applyTexSettings(mat.aoMap, 2, 2);
  return mat;
}

function makeFabricMaterial(hex, fabricTextures) {
  const color = new THREE.Color(hex);
  if (!fabricTextures) return new THREE.MeshStandardMaterial({ color, roughness: 0.9, metalness: 0.0 });
  const mat = new THREE.MeshStandardMaterial({
    map: fabricTextures.color.clone(), normalMap: fabricTextures.normal.clone(),
    roughnessMap: fabricTextures.roughness.clone(), aoMap: fabricTextures.ao.clone(),
    color, roughness: 1.0, metalness: 0.0,
  });
  if (mat.map)          { mat.map.colorSpace = THREE.SRGBColorSpace; applyTexSettings(mat.map); }
  if (mat.normalMap)    applyTexSettings(mat.normalMap);
  if (mat.roughnessMap) applyTexSettings(mat.roughnessMap);
  if (mat.aoMap)        applyTexSettings(mat.aoMap);
  return mat;
}

function makeTableclothMaterial(hex, tableclothTextures) {
  const color = new THREE.Color(hex);
  if (!tableclothTextures) return new THREE.MeshStandardMaterial({ color, roughness: 0.95, metalness: 0.0 });
  const mat = new THREE.MeshStandardMaterial({
    map: tableclothTextures.color.clone(), normalMap: tableclothTextures.normal.clone(),
    roughnessMap: tableclothTextures.roughness.clone(), aoMap: tableclothTextures.ao.clone(),
    color, roughness: 1.0, metalness: 0.0,
  });
  if (mat.map)          { mat.map.colorSpace = THREE.SRGBColorSpace; applyTexSettings(mat.map, 3, 3); }
  if (mat.normalMap)    applyTexSettings(mat.normalMap, 3, 3);
  if (mat.roughnessMap) applyTexSettings(mat.roughnessMap, 3, 3);
  if (mat.aoMap)        applyTexSettings(mat.aoMap, 3, 3);
  return mat;
}

// Build a THREE.Material from a slot option + texture sets
function buildMaterialFromOption(opt, textureSet, allTextures) {
  const { woodTextures, fabricTextures, tableclothTextures } = allTextures;

  if (textureSet === "fabric") {
    return makeFabricMaterial(opt.hex, fabricTextures);
  }
  if (textureSet === "tablecloth") {
    return makeTableclothMaterial(opt.hex, tableclothTextures);
  }
  if (textureSet === "wood") {
    // opt may be a FRAME_OPTIONS entry (has type/roughness/metalness) or BODY_OPTIONS (has roughness)
    if (opt.type !== undefined) {
      return makeFrameMaterial(opt, woodTextures);
    }
    // BODY_OPTIONS with wood texture
    if (!woodTextures) {
      return makeColorMaterial(opt.hex, opt.roughness ?? 0.7, 0.0);
    }
    const mat = new THREE.MeshStandardMaterial({
      map: woodTextures.color.clone(), normalMap: woodTextures.normal.clone(),
      roughnessMap: woodTextures.roughness.clone(), aoMap: woodTextures.ao?.clone() ?? null,
      color: new THREE.Color(opt.hex), roughness: 1.0, metalness: 0.0,
    });
    if (mat.map)          { mat.map.colorSpace = THREE.SRGBColorSpace; applyTexSettings(mat.map, 2, 2); }
    if (mat.normalMap)    applyTexSettings(mat.normalMap, 2, 2);
    if (mat.roughnessMap) applyTexSettings(mat.roughnessMap, 2, 2);
    if (mat.aoMap)        applyTexSettings(mat.aoMap, 2, 2);
    return mat;
  }
  // null / solid color
  return makeColorMaterial(opt.hex, opt.roughness ?? 0.4, opt.metalness ?? 0.0);
}

// ─── Apply a slot to placed model ─────────────────────────────────────────────
//
// matTarget defines WHICH meshes/primitives to paint:
//   { all: true }          → all meshes
//   { nodeNames: [...] }   → match node.name
//   { matNames: [...] }    → match original material name (per-primitive)
//   { except: [...] }      → all EXCEPT listed node names
//
function applySlotToModel(root, matTarget, newMaterial) {
  if (!root) return;

  root.traverse((node) => {
    if (!node.isMesh) return;

    if (matTarget.all) {
      // Replace entire material array or single
      if (Array.isArray(node.material)) {
        node.material.forEach((m) => m.dispose());
        node.material = node.material.map(() => newMaterial.clone());
      } else {
        node.material?.dispose();
        node.material = newMaterial.clone();
      }
      return;
    }

    if (matTarget.nodeNames) {
      if (!matTarget.nodeNames.includes(node.name)) return;
      if (Array.isArray(node.material)) {
        node.material.forEach((m) => m.dispose());
        node.material = node.material.map(() => newMaterial.clone());
      } else {
        node.material?.dispose();
        node.material = newMaterial.clone();
      }
      return;
    }

    if (matTarget.except) {
      if (matTarget.except.includes(node.name)) return;
      if (Array.isArray(node.material)) {
        node.material.forEach((m) => m.dispose());
        node.material = node.material.map(() => newMaterial.clone());
      } else {
        node.material?.dispose();
        node.material = newMaterial.clone();
      }
      return;
    }

    if (matTarget.matNames) {
      // Per-primitive matching by original material name
      if (Array.isArray(node.material)) {
        const newMats = node.material.map((m) => {
          if (matTarget.matNames.includes(m.name)) {
            m.dispose();
            const nm = newMaterial.clone();
            nm.name = m.name; // preserve name for future matching
            return nm;
          }
          return m;
        });
        node.material = newMats;
      } else if (node.material && matTarget.matNames.includes(node.material.name)) {
        const origName = node.material.name;
        node.material.dispose();
        node.material = newMaterial.clone();
        node.material.name = origName;
      }
    }
  });
}

// ─── Utility helpers ───────────────────────────────────────────────────────────
function formatError(err) {
  if (!err) return "Tidak ada detail error dari browser.";
  if (typeof err === "string") return err;
  if (err.message) return err.message;
  try { return JSON.stringify(err); } catch { return String(err); }
}
function isInAppBrowser() {
  return /FBAN|FBAV|Instagram|Line|MicroMessenger|TikTok|Twitter|WhatsApp/i.test(navigator.userAgent);
}
function isMobileBrowser() {
  return /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
}
function resizeCanvasToViewport(canvas) {
  canvas.style.width  = "100vw";
  canvas.style.height = "100dvh";
}
function stopMediaStreams() {
  document.querySelectorAll("video").forEach((v) => {
    const s = v.srcObject;
    if (s && "getTracks" in s) s.getTracks().forEach((t) => t.stop());
    v.srcObject = null;
  });
}
function hideAndReleaseCanvas(canvas) {
  if (!canvas) return;
  canvas.style.setProperty("display",        "none",   "important");
  canvas.style.setProperty("visibility",     "hidden", "important");
  canvas.style.setProperty("opacity",        "0",      "important");
  canvas.style.setProperty("pointer-events", "none",   "important");
  const gl = canvas.getContext("webgl2") || canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
  gl?.getExtension("WEBGL_lose_context")?.loseContext();
  canvas.width = 1; canvas.height = 1;
}
function stop8thWall(canvas) {
  hideAndReleaseCanvas(canvas);
  stopMediaStreams();
  const once = () => {
    window.XR8?.pause?.(); window.XR8?.stop?.(); window.XR8?.clearCameraPipelineModules?.();
    stopMediaStreams(); hideAndReleaseCanvas(canvas);
  };
  once(); window.setTimeout(once, 80); window.setTimeout(once, 250);
}
function keepCanvasBehindUi(canvas) {
  canvas.style.setProperty("position",       "absolute", "important");
  canvas.style.setProperty("inset",          "0",        "important");
  canvas.style.setProperty("z-index",        "0",        "important");
  canvas.style.setProperty("pointer-events", "auto",     "important");
}
function canvasLayerModule(canvas) {
  const fix = () => keepCanvasBehindUi(canvas);
  return { name: "furniture-canvas-layer", onAttach: fix, onCanvasSizeChange: fix, onDeviceOrientationChange: fix, onUpdate: fix };
}
function getTouchDistance(t) { return Math.hypot(t[0].clientX - t[1].clientX, t[0].clientY - t[1].clientY); }
function getTouchAngle(t)    { return Math.atan2(t[1].clientY - t[0].clientY, t[1].clientX - t[0].clientX); }

// ─── AR Scene Builder ──────────────────────────────────────────────────────────
function buildFurnitureScene({
  canvas, models,
  selectedModelRef, activeObjectRef,
  onStatusChange, onError,
  primarySelectionsRef, secondarySelectionsRef,
  applyPrimaryRef, applySecondaryRef,
  notifyModelChangeRef,
  onModelSelect,
}) {
  let camera, sceneRef, floorMarker;
  let activeObject           = null;
  let lastSingleTouch        = null;
  let gestureStart           = null;
  let suppressPlacementUntil = 0;
  let waitingForOrigin       = false;
  let pendingPlace           = null;

  const loadedModels  = new Map();
  const loadingSet    = new Set();
  const placedObjects = new Map();
  const raycaster     = new THREE.Raycaster();
  const pointer       = new THREE.Vector2();
  const floor         = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);
  const hitPoint      = new THREE.Vector3();

  let glbLoader = null;
  let allTextures = { woodTextures: null, fabricTextures: null, tableclothTextures: null };

  // ── Apply slot helpers ───────────────────────────────────────────────────
  const applyPrimarySlot = (optionId, modelId) => {
    const id = modelId ?? selectedModelRef.current;
    const placed = placedObjects.get(id); if (!placed) return;
    const slots = MODEL_SLOTS[id]; if (!slots?.primarySlot) return;
    const { options, matTarget, textureSet } = slots.primarySlot;
    const opt = options.find((o) => o.id === optionId) ?? options[0];
    const mat = buildMaterialFromOption(opt, textureSet, allTextures);
    applySlotToModel(placed.root, matTarget, mat);
    mat.dispose();
    console.log(`[AR] Primary slot applied: ${id} → ${optionId}`);
  };

  const applySecondarySlot = (optionId, modelId) => {
    const id = modelId ?? selectedModelRef.current;
    const placed = placedObjects.get(id); if (!placed) return;
    const slots = MODEL_SLOTS[id]; if (!slots?.secondarySlot) return;
    const { options, matTarget, textureSet } = slots.secondarySlot;
    const opt = options.find((o) => o.id === optionId) ?? options[0];
    const mat = buildMaterialFromOption(opt, textureSet, allTextures);
    applySlotToModel(placed.root, matTarget, mat);
    mat.dispose();
    console.log(`[AR] Secondary slot applied: ${id} → ${optionId}`);
  };

  applyPrimaryRef.current   = applyPrimarySlot;
  applySecondaryRef.current = applySecondarySlot;

  // Apply both slots after model is first placed
  const applyAllSlots = (modelId) => {
    const slots = MODEL_SLOTS[modelId];
    if (!slots) return;
    if (slots.primarySlot) {
      const primId = primarySelectionsRef.current[modelId] ?? slots.primarySlot.defaultId;
      applyPrimarySlot(primId, modelId);
    }
    if (slots.secondarySlot) {
      const secId = secondarySelectionsRef.current[modelId] ?? slots.secondarySlot.defaultId;
      applySecondarySlot(secId, modelId);
    }
  };

  // ── Lazy model loader ─────────────────────────────────────────────────────
  const lazyLoadModel = (config) => {
    if (loadedModels.has(config.id) || loadingSet.has(config.id)) return;
    loadingSet.add(config.id);
    glbLoader.load(
      config.modelUrl,
      (gltf) => {
        // Log all mesh/material names for debugging
        console.group(`[AR] Mesh list — ${config.label}`);
        gltf.scene.traverse((node) => {
          if (node.isMesh) {
            const mats = Array.isArray(node.material)
              ? node.material.map((m) => `"${m.name}"`).join(", ")
              : `"${node.material?.name}"`;
            console.log(`  node:"${node.name}"  mats:[${mats}]`);
          }
        });
        console.groupEnd();
        gltf.scene.visible = false;
        loadedModels.set(config.id, gltf.scene);
        loadingSet.delete(config.id);
        if (pendingPlace && selectedModelRef.current === config.id) {
          const { x, y } = pendingPlace; pendingPlace = null;
          addSelectedObject(x, y);
        }
        onStatusChange("scanning");
      },
      undefined,
      (err) => {
        loadingSet.delete(config.id);
        onError(`${config.label} gagal dimuat: ${formatError(err)}`);
        onStatusChange("failed");
      },
    );
  };

  // ── Scene helpers ─────────────────────────────────────────────────────────
  const selectedConfig = () => models.find((m) => m.id === selectedModelRef.current) ?? models[0];

  const setObjectOnFloor = (obj, clientX, clientY) => {
    if (!camera || !obj) return false;
    const rect = canvas.getBoundingClientRect();
    pointer.x = ((clientX - rect.left) / rect.width)  *  2 - 1;
    pointer.y = ((clientY - rect.top)  / rect.height)  * -2 + 1;
    raycaster.setFromCamera(pointer, camera);
    if (!raycaster.ray.intersectPlane(floor, hitPoint)) return false;
    obj.root.position.copy(hitPoint);
    obj.root.visible = true;
    floorMarker.visible = true;
    floorMarker.position.copy(hitPoint);
    onStatusChange("placed");
    return true;
  };

  const resolveFloor = (clientX, clientY) => {
    if (!camera) return null;
    const rect = canvas.getBoundingClientRect();
    pointer.x = ((clientX - rect.left) / rect.width)  *  2 - 1;
    pointer.y = ((clientY - rect.top)  / rect.height)  * -2 + 1;
    raycaster.setFromCamera(pointer, camera);
    const p = new THREE.Vector3();
    return raycaster.ray.intersectPlane(floor, p) ? p : null;
  };

  const addSelectedObject = (clientX, clientY) => {
    const config = selectedConfig();
    if (!sceneRef) { onStatusChange("loading"); return false; }
    if (!loadedModels.has(config.id)) {
      pendingPlace = { x: clientX, y: clientY };
      lazyLoadModel(config);
      onStatusChange("loading");
      return false;
    }
    const source = loadedModels.get(config.id);
    let obj = placedObjects.get(config.id);
    if (!obj) {
      const root = source.clone(true);
      obj = { id: config.id, root, scale: config.initialScale };
      root.visible = false;
      root.scale.setScalar(obj.scale);
      sceneRef.add(root);
      placedObjects.set(config.id, obj);
      // Apply default materials on first placement
      applyAllSlots(config.id);
    }
    activeObject = obj;
    activeObjectRef.current = obj;
    return setObjectOnFloor(obj, clientX, clientY);
  };

  const syncActive = () => {
    const obj = placedObjects.get(selectedModelRef.current) ?? null;
    activeObject = obj;
    activeObjectRef.current = obj;
  };

  // ── Raycast helpers ───────────────────────────────────────────────────────
  const raycastPlacedObjects = (clientX, clientY) => {
    if (!camera || placedObjects.size === 0) return null;
    const rect = canvas.getBoundingClientRect();
    pointer.x = ((clientX - rect.left) / rect.width)  *  2 - 1;
    pointer.y = ((clientY - rect.top)  / rect.height) * -2 + 1;
    raycaster.setFromCamera(pointer, camera);
    const meshes   = [];
    const meshToObj = new Map();
    placedObjects.forEach((obj) => {
      if (!obj.root.visible) return;
      obj.root.traverse((node) => {
        if (node.isMesh) { meshes.push(node); meshToObj.set(node, obj); }
      });
    });
    if (meshes.length === 0) return null;
    const hits = raycaster.intersectObjects(meshes, false);
    if (hits.length === 0) return null;
    return meshToObj.get(hits[0].object) ?? null;
  };

  const selectPlacedObj = (obj) => {
    activeObject = obj;
    activeObjectRef.current = obj;
    selectedModelRef.current = obj.id;
    onModelSelect?.(obj.id);
  };

  if (notifyModelChangeRef) {
    notifyModelChangeRef.current = () => { syncActive(); lastSingleTouch = null; gestureStart = null; };
  }

  // ── Touch / pointer handlers ─────────────────────────────────────────────
  const handleTap = (clientX, clientY) => {
    const hitObj = raycastPlacedObjects(clientX, clientY);
    if (hitObj) { selectPlacedObj(hitObj); return; }
    addSelectedObject(clientX, clientY);
  };

  const placeModel = (e) => {
    if (Date.now() < suppressPlacementUntil) return;
    if (e.pointerType === "touch") return;
    handleTap(e.clientX, e.clientY);
  };

  const handleTouchStart = (e) => {
    if (e.touches.length === 1) {
      const [t] = e.touches;
      lastSingleTouch = { startX: t.clientX, startY: t.clientY, x: t.clientX, y: t.clientY, moved: false, startedAt: Date.now() };
      gestureStart = null;
      const hitObj = raycastPlacedObjects(t.clientX, t.clientY);
      if (hitObj) { selectPlacedObj(hitObj); } else { syncActive(); }
    }
    if (e.touches.length === 2) {
      syncActive();
      if (!activeObject?.root.visible) return;
      e.preventDefault();
      lastSingleTouch = null;
      suppressPlacementUntil = Date.now() + 350;
      const gestureTarget = activeObject;
      gestureStart = {
        target: gestureTarget,
        distance: getTouchDistance(e.touches),
        angle:    getTouchAngle(e.touches),
        scale:    gestureTarget.scale,
        rotationY: gestureTarget.root.rotation.y,
      };
    }
  };

  const handleTouchMove = (e) => {
    if (e.touches.length === 1) {
      if (lastSingleTouch && activeObject) {
        e.preventDefault();
        const [t] = e.touches;
        if (Math.hypot(t.clientX - lastSingleTouch.startX, t.clientY - lastSingleTouch.startY) > 8) {
          lastSingleTouch.moved = true;
          setObjectOnFloor(activeObject, t.clientX, t.clientY);
        }
        lastSingleTouch = { ...lastSingleTouch, x: t.clientX, y: t.clientY };
      }
    }
    if (e.touches.length === 2 && gestureStart) {
      e.preventDefault();
      suppressPlacementUntil = Date.now() + 350;
      const { target } = gestureStart;
      if (!target?.root.visible) return;
      const dist  = getTouchDistance(e.touches);
      const angle = getTouchAngle(e.touches);
      const next  = THREE.MathUtils.clamp(gestureStart.scale * (dist / gestureStart.distance), 0.35, 2.5);
      target.scale = next;
      target.root.scale.setScalar(next);
      target.root.rotation.y = gestureStart.rotationY + (angle - gestureStart.angle);
    }
  };

  const handleTouchEnd = (e) => {
    if (e.touches.length === 0) {
      if (lastSingleTouch && !lastSingleTouch.moved && Date.now() - lastSingleTouch.startedAt < 450 && Date.now() >= suppressPlacementUntil) {
        handleTap(lastSingleTouch.startX, lastSingleTouch.startY);
      }
      const hadGesture = gestureStart !== null;
      lastSingleTouch = null; gestureStart = null;
      suppressPlacementUntil = hadGesture ? Date.now() + 350 : Date.now() + 80;
    }
    if (e.touches.length === 1) {
      if (gestureStart) {
        lastSingleTouch = null;
        suppressPlacementUntil = Date.now() + 350;
      } else {
        const [t] = e.touches;
        lastSingleTouch = { startX: t.clientX, startY: t.clientY, x: t.clientX, y: t.clientY, moved: false, startedAt: Date.now() };
      }
      gestureStart = null;
    }
  };

  canvas.addEventListener("pointerup",   placeModel);
  canvas.addEventListener("touchstart",  handleTouchStart, { passive: false });
  canvas.addEventListener("touchmove",   handleTouchMove,  { passive: false });
  canvas.addEventListener("touchend",    handleTouchEnd);
  canvas.addEventListener("touchcancel", handleTouchEnd);

  return {
    name: "furniture-scene",

    onStart: () => {
      const { scene, camera: xrCamera, renderer } = window.XR8.Threejs.xrScene();
      camera = xrCamera; sceneRef = scene;
      if ("outputColorSpace" in renderer) renderer.outputColorSpace = THREE.SRGBColorSpace;

      scene.add(new THREE.HemisphereLight(0xffffff, 0x5d5d66, 1.3));
      const dLight = new THREE.DirectionalLight(0xffffff, 1.2);
      dLight.position.set(1, 4, 2); scene.add(dLight);

      floorMarker = new THREE.Mesh(
        new THREE.RingGeometry(0.42, 0.46, 48),
        new THREE.MeshBasicMaterial({ color: 0xf5f3ef, transparent: true, opacity: 0.75, side: THREE.DoubleSide }),
      );
      floorMarker.rotation.x = -Math.PI / 2;
      floorMarker.visible = false;
      scene.add(floorMarker);

      const texLoader = new THREE.TextureLoader();
      loadTextureSet(texLoader, FABRIC_URLS, (result) => {
        allTextures.fabricTextures = result;
        placedObjects.forEach((_, mid) => {
          const s = MODEL_SLOTS[mid];
          if (s?.secondarySlot?.textureSet === "fabric") {
            const sid = secondarySelectionsRef.current[mid] ?? s.secondarySlot.defaultId;
            applySecondarySlot(sid, mid);
          }
          if (s?.primarySlot?.textureSet === "fabric") {
            const pid = primarySelectionsRef.current[mid] ?? s.primarySlot.defaultId;
            applyPrimarySlot(pid, mid);
          }
        });
      });
      loadTextureSet(texLoader, WOOD_URLS, (result) => {
        allTextures.woodTextures = result;
        placedObjects.forEach((_, mid) => {
          const s = MODEL_SLOTS[mid];
          if (s?.primarySlot?.textureSet === "wood") {
            const pid = primarySelectionsRef.current[mid] ?? s.primarySlot.defaultId;
            applyPrimarySlot(pid, mid);
          }
          if (s?.secondarySlot?.textureSet === "wood") {
            const sid = secondarySelectionsRef.current[mid] ?? s.secondarySlot.defaultId;
            applySecondarySlot(sid, mid);
          }
        });
      });
      loadTextureSet(texLoader, TABLECLOTH_URLS, (result) => {
        allTextures.tableclothTextures = result;
        placedObjects.forEach((_, mid) => {
          const s = MODEL_SLOTS[mid];
          if (s?.secondarySlot?.textureSet === "tablecloth") {
            const sid = secondarySelectionsRef.current[mid] ?? s.secondarySlot.defaultId;
            applySecondarySlot(sid, mid);
          }
        });
      });

      glbLoader = new GLTFLoader();
      const initConfig = models.find((m) => m.id === selectedModelRef.current) ?? models[0];
      lazyLoadModel(initConfig);

      if (pendingLoadRef.current) {
        pendingLoadRef.current.forEach((item) => {
          const cfg = models.find((m) => m.id === item.modelId);
          if (cfg) lazyLoadModel(cfg);
        });
      }
    },

    onUpdate: () => {
    },

    onDetach: () => {
      canvas.removeEventListener("pointerup",   placeModel);
      canvas.removeEventListener("touchstart",  handleTouchStart);
      canvas.removeEventListener("touchmove",   handleTouchMove);
      canvas.removeEventListener("touchend",    handleTouchEnd);
      canvas.removeEventListener("touchcancel", handleTouchEnd);
    },
  };
}

// ─── Save Dialog ───────────────────────────────────────────────────────────────
function SaveDialog({ onSave, onClose }) {
  const [name, setName] = useState("");
  const handleSubmit = () => { const t = name.trim(); if (t) onSave(t); };
  return (
    <div className="fixed inset-0 z-[2147483648] flex items-center justify-center px-6">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-sm overflow-hidden rounded-3xl border border-white/15 bg-[#1a1a1a] shadow-[0_32px_80px_rgba(0,0,0,0.6)]">
        <div className="px-6 pt-6 pb-2">
          <p className="text-[9px] font-medium uppercase tracking-[0.24em] text-white/40">Simpan Layout</p>
          <h2 className="mt-1 font-cormorant text-2xl text-white">Beri nama layout ini</h2>
        </div>
        <div className="px-6 py-4">
          <input
            autoFocus value={name} onChange={(e) => setName(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter") handleSubmit(); if (e.key === "Escape") onClose(); }}
            placeholder="cth: Ruang Tamu, Kamar Tidur..."
            className="w-full rounded-xl border border-white/12 bg-white/8 px-4 py-3 text-sm text-white placeholder-white/30 outline-none focus:border-white/30 focus:bg-white/10 transition-all"
          />
        </div>
        <div className="flex gap-2 border-t border-white/8 px-6 py-4">
          <button onClick={onClose} className="flex-1 rounded-xl border border-white/12 py-2.5 text-[11px] font-medium uppercase tracking-[0.14em] text-white/50 hover:text-white transition-colors">
            Batal
          </button>
          <button onClick={handleSubmit} disabled={!name.trim()} className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-white py-2.5 text-[11px] font-medium uppercase tracking-[0.14em] text-[#171513] disabled:opacity-40 transition-opacity">
            <Check size={13} /> Simpan
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Material Swatch Component ─────────────────────────────────────────────────
function SwatchGrid({ options, selectedId, onSelect, ringOffset = "#f0eeec" }) {
  return (
    <div className="flex flex-wrap gap-2.5">
      {options.map((opt) => {
        const sel = selectedId === opt.id;
        const hex = `#${opt.hex.toString(16).padStart(6, "0")}`;
        const isLight = opt.hex > 0xCCCCCC;
        return (
          <button
            key={opt.id}
            title={opt.label}
            onClick={() => onSelect(opt.id)}
            className={`h-10 w-10 rounded-full transition-all duration-150 ${
              sel
                ? "scale-115 ring-2 ring-[#1a1a1a] ring-offset-2"
                : "ring-1 ring-black/20 hover:scale-105"
            }`}
            style={{
              backgroundColor: hex,
              ringOffsetColor: ringOffset,
              boxShadow: opt.metalness > 0.5
                ? "inset 0 2px 5px rgba(255,255,255,0.35),inset 0 -1px 3px rgba(0,0,0,0.45)"
                : isLight ? "inset 0 0 0 1px rgba(0,0,0,0.15)" : undefined,
            }}
          />
        );
      })}
    </div>
  );
}

// ─── Component ─────────────────────────────────────────────────────────────────
export default function ProductAR() {
  const { slug }  = useParams();
  const navigate    = useNavigate();
  const product     = getProductBySlug(slug);
  const canvasRef   = useRef(null);

  const initialModelId = product?.modelId ?? AR_MODELS[0].id;
  const [arStatus,            setArStatus]           = useState("loading");
  const [errorDetail,         setErrorDetail]        = useState("");
  const [browserBottomOffset, setBrowserBottomOffset] = useState(0);
  const [inAppBrowser]      = useState(() => isInAppBrowser());
  const [isMobile]          = useState(() => isMobileBrowser());
  const [selectedModel,       setSelectedModel]      = useState(initialModelId);
  const [activeTab,           setActiveTab]          = useState(null);
  const [showInfo,            setShowInfo]           = useState(false);

  // Per-model primary/secondary selections: { [modelId]: optionId }
  // Initialize with defaults from MODEL_SLOTS
  const initSelections = (slot) => {
    const obj = {};
    AR_MODELS.forEach((m) => {
      const s = MODEL_SLOTS[m.id];
      if (s?.[slot]) obj[m.id] = s[slot].defaultId;
    });
    return obj;
  };
  const [primarySelections,   setPrimarySelections]   = useState(() => initSelections("primarySlot"));
  const [secondarySelections, setSecondarySelections] = useState(() => initSelections("secondarySlot"));

  const selectedModelRef       = useRef(initialModelId);
  const activeObjectRef        = useRef(null);
  const applyPrimaryRef        = useRef(null);
  const applySecondaryRef      = useRef(null);
  const snapshotRef            = useRef(null);
  const notifyModelChangeRef   = useRef(null);
  // Mutable refs holding latest selections (used inside AR scene closures)
  const primarySelectionsRef   = useRef(initSelections("primarySlot"));
  const secondarySelectionsRef = useRef(initSelections("secondarySlot"));

  const onModelSelectRef = useRef(null);
  onModelSelectRef.current = (modelId) => {
    setSelectedModel(modelId);
    selectedModelRef.current = modelId;
  };

  useEffect(() => { primarySelectionsRef.current   = primarySelections;   }, [primarySelections]);
  useEffect(() => { secondarySelectionsRef.current = secondarySelections; }, [secondarySelections]);

  useEffect(() => { selectedModelRef.current = selectedModel; }, [selectedModel]);

  // ── 8th Wall init ─────────────────────────────────────────────────────────
  useEffect(() => {
    if (!isMobile) return undefined;
    document.body.style.overflow = document.documentElement.style.overflow = "hidden";
    let cancelled = false, startTimer;
    const canvas = canvasRef.current;
    const obs = canvas ? new MutationObserver(() => keepCanvasBehindUi(canvas)) : null;
    if (canvas && obs) obs.observe(canvas, { attributes: true, attributeFilter: ["style", "class"] });

    const handleResize = () => {
      if (canvas) { resizeCanvasToViewport(canvas); keepCanvasBehindUi(canvas); }
      const vp = window.visualViewport;
      setBrowserBottomOffset(vp ? Math.ceil(Math.max(0, window.innerHeight - vp.height - vp.offsetTop)) : 0);
    };
    handleResize();
    window.addEventListener("resize",            handleResize);
    window.visualViewport?.addEventListener("resize", handleResize);
    window.addEventListener("orientationchange", handleResize);

    const start8thWall = async () => {
      const XR8 = window.XR8;
      if (!canvas) return;
      if (!XR8) { setErrorDetail("window.XR8 belum ada."); setArStatus("unsupported"); return; }
      try {
        window.THREE = THREE;
        setErrorDetail("");
        resizeCanvasToViewport(canvas);
        keepCanvasBehindUi(canvas);
        XR8.stop?.(); XR8.clearCameraPipelineModules?.();
        await XR8.loadChunk?.("slam");
        if (cancelled) return;
        XR8.addCameraPipelineModules([
          XR8.FullWindowCanvas.pipelineModule(),
          canvasLayerModule(canvas),
          XR8.GlTextureRenderer.pipelineModule(),
          XR8.Threejs.pipelineModule(),
          XR8.XrController.pipelineModule(),
          {
            name: "furniture-camera-status",
            onCameraStatusChange: ({ status }) => {
              if (status === "requesting") setArStatus("permission");
              if (status === "hasVideo")   setArStatus("scanning");
              if (status === "failed") {
                setErrorDetail(window.isSecureContext
                  ? "Browser menolak akses kamera."
                  : "Bukan secure context. Buka dari HTTPS ngrok.");
                setArStatus("failed");
              }
            },
            onException: (err) => { console.error("8th Wall exception", err); setErrorDetail(formatError(err)); setArStatus("failed"); },
          },
          buildFurnitureScene({
            canvas, models: AR_MODELS,
            selectedModelRef, activeObjectRef,
            onStatusChange: setArStatus, onError: setErrorDetail,
            primarySelectionsRef, secondarySelectionsRef,
            applyPrimaryRef, applySecondaryRef,
            snapshotRef, pendingLoadRef,
            notifyModelChangeRef,
            onModelSelect: (modelId) => onModelSelectRef.current?.(modelId),
          }),
        ]);
        const mob = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
        XR8.run({ canvas, allowFront: true, cameraConfig: { direction: mob ? XR8.XrConfig.camera().BACK : XR8.XrConfig.camera().FRONT }, allowedDevices: XR8.XrConfig.device().ANY });
      } catch (err) {
        if (!cancelled) { console.error("8th Wall startup failed", err); setErrorDetail(formatError(err)); setArStatus("failed"); }
      }
    };

    if (window.XR8) {
      start8thWall();
    } else {
      const onLoaded = () => start8thWall();
      window.addEventListener("xrloaded", onLoaded, { once: true });
      startTimer = window.setTimeout(() => setArStatus("unsupported"), 5000);
      return () => {
        cancelled = true; window.clearTimeout(startTimer);
        window.removeEventListener("resize", handleResize);
        window.visualViewport?.removeEventListener("resize", handleResize);
        window.removeEventListener("orientationchange", handleResize);
        window.removeEventListener("xrloaded", onLoaded);
        obs?.disconnect();
        document.body.style.overflow = document.documentElement.style.overflow = "";
        stop8thWall(canvas);
      };
    }

    const onPageExit = () => stop8thWall(canvas);
    window.addEventListener("pagehide", onPageExit);
    window.addEventListener("popstate", onPageExit);

    return () => {
      cancelled = true; window.clearTimeout(startTimer);
      window.removeEventListener("resize", handleResize);
      window.visualViewport?.removeEventListener("resize", handleResize);
      window.removeEventListener("orientationchange", handleResize);
      obs?.disconnect();
      document.body.style.overflow = document.documentElement.style.overflow = "";
      window.removeEventListener("pagehide", onPageExit);
      window.removeEventListener("popstate", onPageExit);
      stop8thWall(canvas);
    };
  }, [isMobile]);

  const exitAR = (e) => {
    e.preventDefault();
    stop8thWall(canvasRef.current);
    document.body.style.overflow = document.documentElement.style.overflow = "";
    window.setTimeout(() => navigate(product ? `/products/${product.slug}` : "/products"), 90);
  };

  // ── Desktop fallback ──────────────────────────────────────────────────────
  if (!isMobile) {
    return (
      <div className="min-h-screen bg-[#11100f] font-dmsans text-[#f5f3ef]">
        <main className="mx-auto flex min-h-screen max-w-6xl flex-col px-4 py-6 sm:px-6">
          <Link to={product ? `/products/${product.slug}` : "/products"} onClick={exitAR}
            className="inline-flex w-fit items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-3 text-[11px] font-medium uppercase tracking-[0.16em] text-white transition-colors hover:bg-white hover:text-[#171513]">
            <X size={16} /> Product
          </Link>
          <section className="grid flex-1 items-center gap-8 py-10 lg:grid-cols-[minmax(0,1fr)_360px]">
            <div className="overflow-hidden rounded-[28px] border border-white/10 bg-white/5">
              <img src={product?.image} alt={product?.name ?? "Furniture preview"} className="h-[62vh] min-h-[420px] w-full object-cover" />
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-[0.24em] text-white/45">Mobile AR Required</p>
              <h1 className="mt-3 font-cormorant text-5xl leading-none text-white">{product?.name ?? "Furniture Preview"}</h1>
              <p className="mt-5 text-sm leading-relaxed text-white/68">
                8th Wall camera AR is intended for mobile Safari/Chrome. Open this route from your phone through the ngrok HTTPS URL.
              </p>
            </div>
          </section>
        </main>
      </div>
    );
  }

  // ── AR overlay ────────────────────────────────────────────────────────────
  const toggleTab   = (tab) => setActiveTab((prev) => (prev === tab ? null : tab));
  const modelConfig = AR_MODELS.find((m) => m.id === selectedModel) ?? AR_MODELS[0];
  const statusPill  = STATUS_PILL[arStatus] ?? { color: "#9ca3af", label: arStatus };
  const slots       = MODEL_SLOTS[selectedModel];
  const hasPrimary   = !!slots?.primarySlot;
  const hasSecondary = !!slots?.secondarySlot;
  const hasAnyCustomization = hasPrimary || hasSecondary;

  const TABS = ["material", "object", "warna"];
  const TAB_LABEL  = { material: "Material", object: "Object",          warna: "Warna" };
  const PILL_LABEL = { material: "Material", object: modelConfig.label, warna: "Warna" };

  // Current slot info for selected model
  const primarySlot   = slots?.primarySlot;
  const secondarySlot = slots?.secondarySlot;
  const currentPrimaryId   = primarySelections[selectedModel]   ?? primarySlot?.defaultId;
  const currentSecondaryId = secondarySelections[selectedModel] ?? secondarySlot?.defaultId;

  const arOverlay = (
    <>
      {/* ── Top bar ─────────────────────────────────────────────────────── */}
      <div className="pointer-events-none fixed inset-x-0 top-0 z-[2147483647] flex items-center justify-between px-5 pt-[calc(env(safe-area-inset-top)+0.75rem)]">
        <button onClick={exitAR} className="pointer-events-auto flex h-10 w-10 items-center justify-center rounded-full bg-black/32 text-white shadow-lg backdrop-blur-md active:scale-95">
          <X size={18} />
        </button>

        <div className="pointer-events-none inline-flex items-center gap-2 rounded-full bg-white/92 px-4 py-[7px] shadow-md backdrop-blur-xl">
          <span className="h-[7px] w-[7px] rounded-full" style={{ backgroundColor: statusPill.color, boxShadow: `0 0 6px ${statusPill.color}` }} />
          <span className="text-[11px] font-semibold tracking-tight text-[#1a1a1a]">{statusPill.label}</span>
        </div>

        <button onClick={() => setShowInfo((v) => !v)} className="pointer-events-auto flex h-10 w-10 items-center justify-center rounded-full bg-black/32 text-white shadow-lg backdrop-blur-md active:scale-95">
          <Info size={18} />
        </button>
      </div>

      {/* ── Saved toast ─────────────────────────────────────────────────── */}

      {/* ── In-app browser warning ──────────────────────────────────────── */}
      {inAppBrowser && (
        <div className="pointer-events-none fixed inset-x-4 top-16 z-[2147483647] rounded-2xl bg-amber-500/90 px-4 py-3 text-xs leading-relaxed text-white backdrop-blur-md">
          Buka di Safari/Chrome agar AR bekerja dengan benar.
        </div>
      )}

      {/* ── Scanning / load-origin hint ─────────────────────────────────── */}
      {(arStatus === "scanning" || arStatus === "load-origin") && (
        <div className="pointer-events-none fixed inset-x-10 top-1/2 z-[2147483646] flex -translate-y-1/2 justify-center">
          <div className="rounded-2xl bg-black/40 px-5 py-3 text-center text-[11px] leading-relaxed text-white/85 backdrop-blur-md">
            {STATUS_TEXT[arStatus]}
          </div>
        </div>
      )}

      {/* ── Error detail ─────────────────────────────────────────────────── */}
      {errorDetail && (arStatus === "failed" || arStatus === "unsupported") && (
        <div className="pointer-events-none fixed inset-x-4 top-20 z-[2147483647] rounded-2xl bg-red-900/82 px-4 py-3 text-xs leading-relaxed text-red-100 backdrop-blur-md">
          {errorDetail}
        </div>
      )}

      {/* ── Info bottom sheet ───────────────────────────────────────────── */}
      {showInfo && (
        <div className="fixed inset-0 z-[2147483647] flex items-end justify-center">
          <div className="absolute inset-0 bg-black/45 backdrop-blur-sm" onClick={() => setShowInfo(false)} />
          <div className="pointer-events-auto relative w-full max-w-lg overflow-hidden rounded-t-3xl bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-black/8 px-5 py-4">
              <h2 className="text-sm font-bold text-[#1a1a1a]">Panduan AR</h2>
              <button onClick={() => setShowInfo(false)} className="flex h-7 w-7 items-center justify-center rounded-full bg-black/8 text-[#555]">
                <X size={14} />
              </button>
            </div>
            <ul className="space-y-3 px-5 py-5 text-[12px] leading-relaxed text-[#444]">
              {[
                "Tap langsung pada furniture di scene untuk memilih & menggesernya",
                "Arahkan kamera ke lantai kosong dan tap untuk menempatkan model baru",
                "Cubit 2 jari untuk skala · Putar 2 jari untuk rotasi",
                "Tab Object = pilih jenis furniture · Tab Material = ubah rangka/kayu · Tab Warna = ubah kain/cat",
                "Setiap furniture punya opsi kustomisasi yang berbeda sesuai materialnya",
              ].map((text, i) => (
                <li key={i} className="flex gap-3">
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#1a1a1a] text-[9px] font-bold text-white">{i + 1}</span>
                  <p>{text}</p>
                </li>
              ))}
            </ul>
            <div className="px-5 pb-[max(env(safe-area-inset-bottom),1.25rem)]">
              <button onClick={() => setShowInfo(false)} className="w-full rounded-xl bg-[#1a1a1a] py-3 text-sm font-semibold text-white">
                Mengerti
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Bottom panel ─────────────────────────────────────────────────── */}
      <div
        className="pointer-events-none fixed inset-x-0 z-[2147483647]"
        style={{ bottom: inAppBrowser ? `calc(${Math.max(browserBottomOffset, 72)}px + env(safe-area-inset-bottom))` : `${browserBottomOffset}px` }}
      >
        <div className="pointer-events-auto mx-auto max-w-lg px-3">

          {/* Active-object indicator */}
          {arStatus === "placed" && (
            <div className="mb-2 flex items-center justify-between gap-2">
              <div className="flex items-center gap-2 rounded-full bg-black/40 px-3 py-1.5 backdrop-blur-md">
                <span className="text-base leading-none">{modelConfig.icon}</span>
                <div>
                  <p className="text-[8px] font-medium uppercase tracking-[0.14em] text-white/50">Aktif</p>
                  <p className="text-[11px] font-semibold leading-tight text-white">{modelConfig.label}</p>
                </div>
              </div>
            </div>
          )}

          {/* Expanded panel */}
          {activeTab !== null && (
            <div className="mb-2 overflow-hidden rounded-3xl bg-[#f0eeec]/96 shadow-2xl backdrop-blur-2xl">

              {/* Tab bar */}
              <div className="flex items-end justify-around px-6 py-4">
                {TABS.map((tab) => {
                  const active = activeTab === tab;
                  return (
                    <button key={tab} onClick={() => toggleTab(tab)} className="flex flex-col items-center gap-1">
                      <span className={`flex items-center justify-center rounded-full font-semibold leading-tight transition-all duration-200 ${
                        active
                          ? "h-14 w-14 border-2 border-[#1a1a1a] bg-[#2c2c2c] text-[11px] text-white shadow-lg"
                          : "h-10 w-10 bg-[#c6c4c1] text-[10px] text-[#3a3a3a]"
                      }`}>
                        {TAB_LABEL[tab]}
                      </span>
                    </button>
                  );
                })}
              </div>

              <div className="mx-4 h-px bg-black/10" />

              {/* Tab content */}
              <div className="max-h-[44vh] overflow-y-auto">

                {/* ── Object grid ──────────────────────────────────────── */}
                {activeTab === "object" && (
                  <div className="grid grid-cols-3 gap-2 p-3 pb-[calc(env(safe-area-inset-bottom)+0.75rem)]">
                    {AR_MODELS.map((m) => (
                      <button key={m.id}
                        onClick={() => {
                          setSelectedModel(m.id);
                          selectedModelRef.current = m.id;
                          notifyModelChangeRef.current?.();
                        }}
                        className={`flex flex-col items-center justify-center gap-1.5 rounded-2xl border-2 bg-white py-3 px-2 transition-all ${
                          selectedModel === m.id ? "border-[#1a1a1a] shadow-md" : "border-transparent shadow-sm"
                        }`}>
                        <span className="text-3xl leading-none">{m.icon}</span>
                        <span className="text-center text-[10px] font-semibold leading-tight text-[#1a1a1a]">{m.label}</span>
                        <span className="text-[8px] text-[#aaa]">{m.group}</span>
                      </button>
                    ))}
                  </div>
                )}

                {/* ── Material tab (Primary Slot) ───────────────────────── */}
                {activeTab === "material" && (
                  <div className="px-5 py-4 pb-[calc(env(safe-area-inset-bottom)+1.25rem)]">
                    {hasPrimary ? (
                      <>
                        <div className="mb-3 flex items-center gap-2">
                          <span className="text-xl">{primarySlot.icon}</span>
                          <div>
                            <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#999]">{primarySlot.label}</p>
                            <p className="text-[9px] text-[#bbb]">{modelConfig.label}</p>
                          </div>
                        </div>
                        <SwatchGrid
                          options={primarySlot.options}
                          selectedId={currentPrimaryId}
                          onSelect={(optId) => {
                            setPrimarySelections((prev) => ({ ...prev, [selectedModel]: optId }));
                            primarySelectionsRef.current = { ...primarySelectionsRef.current, [selectedModel]: optId };
                            applyPrimaryRef.current?.(optId);
                          }}
                        />
                        <p className="mt-2 text-[10px] text-[#aaa]">
                          {primarySlot.options.find((o) => o.id === currentPrimaryId)?.label ?? ""}
                        </p>
                      </>
                    ) : (
                      <div className="flex flex-col items-center py-8 text-center">
                        <span className="mb-2 text-3xl">🪑</span>
                        <p className="text-[13px] font-semibold text-[#555]">{modelConfig.label}</p>
                        <p className="mt-1 text-[11px] text-[#aaa]">Model ini tidak memiliki opsi material rangka terpisah</p>
                      </div>
                    )}
                  </div>
                )}

                {/* ── Warna tab (Secondary Slot) ────────────────────────── */}
                {activeTab === "warna" && (
                  <div className="px-5 py-4 pb-[calc(env(safe-area-inset-bottom)+1.25rem)]">
                    {hasSecondary ? (
                      <>
                        <div className="mb-3 flex items-center gap-2">
                          <span className="text-xl">{secondarySlot.icon}</span>
                          <div>
                            <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#999]">{secondarySlot.label}</p>
                            <p className="text-[9px] text-[#bbb]">{modelConfig.label}</p>
                          </div>
                        </div>
                        <SwatchGrid
                          options={secondarySlot.options}
                          selectedId={currentSecondaryId}
                          onSelect={(optId) => {
                            setSecondarySelections((prev) => ({ ...prev, [selectedModel]: optId }));
                            secondarySelectionsRef.current = { ...secondarySelectionsRef.current, [selectedModel]: optId };
                            applySecondaryRef.current?.(optId);
                          }}
                        />
                        <p className="mt-2 text-[10px] text-[#aaa]">
                          {secondarySlot.options.find((o) => o.id === currentSecondaryId)?.label ?? ""}
                        </p>
                      </>
                    ) : (
                      <div className="flex flex-col items-center py-8 text-center">
                        <span className="mb-2 text-3xl">🎨</span>
                        <p className="text-[13px] font-semibold text-[#555]">{modelConfig.label}</p>
                        <p className="mt-1 text-[11px] text-[#aaa]">Model ini tidak memiliki opsi warna kain/cat terpisah</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ── Collapsed pill bar ───────────────────────────────────────── */}
          <div className="mb-3 flex items-center justify-around rounded-full bg-black/32 px-6 py-3 shadow-xl backdrop-blur-xl">
            {TABS.map((tab) => {
              const active = activeTab === tab;
              // Show dot on material/warna tabs if model has that customization
              const hasThisSlot = (tab === "material" && hasPrimary) || (tab === "warna" && hasSecondary);
              return (
                <button key={tab} onClick={() => toggleTab(tab)} className="relative flex flex-col items-center gap-1">
                  <span className={`flex items-center justify-center rounded-full transition-all duration-200 ${
                    active ? "h-11 w-11 bg-white text-lg text-[#1a1a1a] shadow" : "h-10 w-10 bg-white/22 text-xl text-white"
                  }`}>
                    {tab === "object" ? modelConfig.icon : ""}
                  </span>
                  {/* Green dot indicator if customizable */}
                  {hasThisSlot && tab !== "object" && (
                    <span className="absolute -top-0.5 -right-0.5 h-2 w-2 rounded-full bg-emerald-400 ring-1 ring-black/20" />
                  )}
                  <span className={`text-[9px] font-medium transition-colors ${active ? "text-white" : "text-white/60"}`}>
                    {PILL_LABEL[tab]}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Save dialog */}
      {showSaveDialog && <SaveDialog onSave={handleSave} onClose={() => setShowSaveDialog(false)} />}
    </>
  );

  return (
    <div className="fixed inset-0 isolate overflow-hidden bg-[#11100f] font-dmsans text-[#f5f3ef]">
      <main className="relative h-[100dvh] overflow-hidden">
        <canvas ref={canvasRef} id="furniture-xr-canvas" className="absolute inset-0 z-0 block touch-none bg-[#171513]" />
      </main>
      {createPortal(arOverlay, document.body)}
    </div>
  );
}
