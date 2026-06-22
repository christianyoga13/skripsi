import * as THREE from "three";

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

import plasticColorUrl     from "../assets/Plastic013A_2K-JPG/Plastic013A_2K-JPG_Color.jpg";
import plasticNormalUrl    from "../assets/Plastic013A_2K-JPG/Plastic013A_2K-JPG_NormalGL.jpg";
import plasticRoughnessUrl from "../assets/Plastic013A_2K-JPG/Plastic013A_2K-JPG_Roughness.jpg";

import wood47ColorUrl    from "../assets/Wood047_2K-JPG/Wood047_2K-JPG_Color.jpg";
import wood47NormalUrl   from "../assets/Wood047_2K-JPG/Wood047_2K-JPG_NormalGL.jpg";
import wood47RoughUrl    from "../assets/Wood047_2K-JPG/Wood047_2K-JPG_Roughness.jpg";

// ─── Texture URL maps ──────────────────────────────────────────────────────────
export const FABRIC_URLS = {
  color: fabricColorUrl, normal: fabricNormalUrl,
  roughness: fabricRoughnessUrl, ao: fabricAOUrl,
};
export const TABLECLOTH_URLS = {
  color: tableclothColorUrl, normal: tableclothNormalUrl,
  roughness: tableclothRoughnessUrl, ao: tableclothAOUrl,
};
export const WOOD_URLS = { color: woodColorUrl, normal: woodNormalUrl, roughness: woodRoughUrl, ao: woodAOUrl };

export const PLASTIC_URLS = {
  color: plasticColorUrl, normal: plasticNormalUrl, roughness: plasticRoughnessUrl
};

export const WOOD47_URLS = {
  color: wood47ColorUrl, normal: wood47NormalUrl, roughness: wood47RoughUrl
};

// ─── Color palette options ─────────────────────────────────────────────────────

// Generic wood/metal frame options (Tab Material)
export const FRAME_OPTIONS = [
  { id: "wood-natural", label: "Kayu Natural", type: "wood",  hex: 0x9C6B3C, roughness: 0.85, metalness: 0.0 },
  { id: "wood-dark",    label: "Kayu Gelap",   type: "wood",  hex: 0x3B1F0E, roughness: 0.80, metalness: 0.0 },
  { id: "wood-ash",     label: "Kayu Abu",     type: "wood",  hex: 0xC0A882, roughness: 0.88, metalness: 0.0 },
  { id: "wood-honey",   label: "Kayu Madu",    type: "wood",  hex: 0xB8750A, roughness: 0.82, metalness: 0.0 },
  { id: "wood-047",     label: "Kayu Premium", type: "wood",  hex: 0x8A6146, roughness: 0.75, metalness: 0.0 },
  { id: "metal-black",  label: "Besi Hitam",   type: "metal", hex: 0x1C1C1C, roughness: 0.25, metalness: 0.85 },
  { id: "metal-silver", label: "Besi Silver",  type: "metal", hex: 0x9E9E9E, roughness: 0.28, metalness: 0.90 },
  { id: "metal-gold",   label: "Kuningan",     type: "metal", hex: 0xB8860B, roughness: 0.18, metalness: 0.92 },
  { id: "metal-bronze", label: "Perunggu",     type: "metal", hex: 0x8C6D3F, roughness: 0.30, metalness: 0.88 },
];

// Fabric / cushion colors (Tab Warna for sofas, beds)
export const FABRIC_OPTIONS = [
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
export const TABLECLOTH_OPTIONS = [
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
export const BODY_OPTIONS = [
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

export const PLASTIC_OPTIONS = [
  { id: "plastic-white", label: "Plastik Putih", hex: 0xF5F5F0, roughness: 0.6 },
  { id: "plastic-gray",  label: "Plastik Abu",   hex: 0xA0A0A0, roughness: 0.6 },
  { id: "plastic-black", label: "Plastik Hitam", hex: 0x2A2A2A, roughness: 0.6 },
];

export const MARBLE_OPTIONS = [
  { id: "marble-carrara", label: "Carrara White", type: "marble", hex: 0xF9F9F9, roughness: 0.1, metalness: 0.1 },
  { id: "marble-nero",    label: "Nero Marquina", type: "marble", hex: 0x1A1A1A, roughness: 0.1, metalness: 0.1 },
  { id: "marble-verde",   label: "Verde",         type: "marble", hex: 0x1B2C24, roughness: 0.15, metalness: 0.1 },
];

export const GLASS_OPTIONS = [
  { id: "glass-clear",  label: "Kaca Bening",  type: "glass", hex: 0xFFFFFF, roughness: 0.05, transmission: 0.9, ior: 1.5, transparent: true },
  { id: "glass-smoked", label: "Kaca Gelap",   type: "glass", hex: 0x222222, roughness: 0.05, transmission: 0.8, ior: 1.5, transparent: true },
];

export const LEATHER_OPTIONS = [
  { id: "leather-tan",   label: "Tan Leather",   type: "leather", hex: 0x9B5E33, roughness: 0.45, metalness: 0.1 },
  { id: "leather-brown", label: "Dark Brown",    type: "leather", hex: 0x4A2E1B, roughness: 0.4, metalness: 0.1 },
  { id: "leather-black", label: "Black Leather", type: "leather", hex: 0x151515, roughness: 0.35, metalness: 0.1 },
];

// ─── Per-model material slot definitions ───────────────────────────────────────
export const MODEL_SLOTS = {
  sofa: {
    primarySlot: {
      label: "Kaki Sofa",
      icon: "🪑",
      options: FRAME_OPTIONS.filter(o => o.type === "metal"),
      defaultId: "metal-silver",
      matTarget: { nodeNames: ["SofaAWS_Frame", "SofaAWS_FrameSide_L", "SofaAWS_FrameSide_R", "SofaAWS_FrameBeams"] },
      textureSet: null,
    },
    secondarySlot: {
      label: "Warna Kain",
      icon: "🧶",
      options: FABRIC_OPTIONS,
      defaultId: "natural",
      matTarget: { nodeNames: ["SofaAWS_SeatCushion", "SofaAWS_BackCushion"] },
      textureSet: "fabric",
    },
  },
  sofa2: {
    primarySlot: {
      label: "Kaki Sofa",
      icon: "🪑",
      options: FRAME_OPTIONS.filter(o => o.type === "metal"),
      defaultId: "metal-silver",
      matTarget: { matNames: ["metal"] },
      textureSet: null,
    },
    secondarySlot: {
      label: "Warna Kain",
      icon: "🧶",
      options: FABRIC_OPTIONS,
      defaultId: "ivory",
      matTarget: { matNames: ["fabric", "pillow black", "pillow brown", "Couch"] },
      textureSet: "fabric",
    },
  },
  table: {
    primarySlot: {
      label: "Permukaan Meja",
      icon: "🪨",
      options: [...FRAME_OPTIONS.filter(o => o.type === "wood"), ...MARBLE_OPTIONS],
      defaultId: "wood-natural",
      matTarget: { matNames: ["Wood026"] },
      textureSet: "wood",
    },
    secondarySlot: null,
  },
  table1: {
    primarySlot: {
      label: "Warna Kaki/Besi",
      icon: "⚙️",
      options: FRAME_OPTIONS.filter(o => o.type === "metal"),
      defaultId: "metal-silver",
      matTarget: { matNames: ["steel"] },
      textureSet: null,
    },
    secondarySlot: null,
  },
  coffeetbl: {
    primarySlot: {
      label: "Warna Meja",
      icon: "🪵",
      options: [...BODY_OPTIONS, ...MARBLE_OPTIONS, ...GLASS_OPTIONS],
      defaultId: "walnut",
      matTarget: { matNames: ["None.001"], tintOnly: true },
      textureSet: null,
    },
    secondarySlot: null,
  },
  bed: {
    primarySlot: {
      label: "Material Rangka",
      icon: "🪑",
      options: FRAME_OPTIONS.filter(o => o.type === "wood"),
      defaultId: "wood-honey",
      matTarget: { matNames: ["Base"] },
      textureSet: "wood",
    },
    secondarySlot: {
      label: "Warna Kain Sprei",
      icon: "🧶",
      options: FABRIC_OPTIONS,
      defaultId: "sage",
      matTarget: { matNames: ["Fabric1", "Fabric2", "Fabric3", "Fabric4", "Fabric5"] },
      textureSet: "fabric",
    },
  },
  bed1: {
    primarySlot: {
      label: "Material Rangka",
      icon: "🪑",
      options: FRAME_OPTIONS.filter(o => o.type === "wood"),
      defaultId: "wood-ash",
      matTarget: { matNames: ["wood_fine_5"] },
      textureSet: "wood",
    },
    secondarySlot: {
      label: "Warna Kain Sprei",
      icon: "🧶",
      options: FABRIC_OPTIONS,
      defaultId: "natural",
      matTarget: { matNames: ["Fabric03", "Fabric03.001", "Fabric19"] },
      textureSet: "fabric",
    },
  },
  desk: {
    primarySlot: {
      label: "Material Meja",
      icon: "🪵",
      options: FRAME_OPTIONS.filter(o => o.type === "wood"),
      defaultId: "wood-natural",
      matTarget: { matNames: ["Desk wood"] },
      textureSet: "wood",
    },
    secondarySlot: null,
  },
  desk1: {
    primarySlot: {
      label: "Material Meja",
      icon: "🪵",
      options: FRAME_OPTIONS.filter(o => o.type === "wood"),
      defaultId: "wood-dark",
      matTarget: { matNames: ["Desk wood"] },
      textureSet: "wood",
    },
    secondarySlot: {
      label: "Material Rangka Besi",
      icon: "⚙️",
      options: FRAME_OPTIONS.filter(o => o.type === "metal"),
      defaultId: "metal-black",
      matTarget: { matNames: ["Frozen white metal"] },
      textureSet: null,
    },
  },
  cupboard: {
    primarySlot: {
      label: "Warna Kabinet",
      icon: "🪵",
      options: BODY_OPTIONS,
      defaultId: "oak",
      matTarget: { matNames: ["GWC_Cupboard_05"] },
      textureSet: "wood",
    },
    secondarySlot: null,
  },
  cupboard1: {
    primarySlot: {
      label: "Warna Kabinet",
      icon: "🪵",
      options: BODY_OPTIONS,
      defaultId: "walnut",
      matTarget: { matNames: ["Persian walnut PBR texture seamless.003", "Persian walnut PBR texture seamless.002"] },
      textureSet: "wood",
    },
    secondarySlot: null,
  },
  wardrobe: {
    primarySlot: {
      label: "Warna Lemari",
      icon: "🪵",
      options: [...BODY_OPTIONS, ...PLASTIC_OPTIONS, ...FRAME_OPTIONS.filter(o => o.type === "wood")],
      defaultId: "white",
      matTarget: { matNames: ["Wardrobe_White"] },
      textureSet: "wood",
    },
    secondarySlot: {
      label: "Material Handle",
      icon: "⚙️",
      options: FRAME_OPTIONS.filter(o => o.type === "metal"),
      defaultId: "metal-gold",
      matTarget: { matNames: ["Wardrobe_Black"] },
      textureSet: null,
    },
  },
  wardrobe1: {
    primarySlot: {
      label: "Warna Lemari",
      icon: "🪵",
      options: [...BODY_OPTIONS, ...PLASTIC_OPTIONS, ...FRAME_OPTIONS.filter(o => o.type === "wood")],
      defaultId: "walnut",
      matTarget: { matNames: ["Desk wood"] },
      textureSet: "wood",
    },
    secondarySlot: null,
  },
  dining1: {
    primarySlot: {
      label: "Material Meja",
      icon: "🪵",
      options: [...FRAME_OPTIONS.filter(o => o.type === "wood"), ...MARBLE_OPTIONS],
      defaultId: "wood-honey",
      matTarget: { matNames: ["Material_table", "Material_chair"] },
      textureSet: "wood",
    },
    secondarySlot: null,
  },
  dining2: {
    primarySlot: {
      label: "Material Meja",
      icon: "🪵",
      options: [...FRAME_OPTIONS.filter(o => o.type === "wood"), ...MARBLE_OPTIONS],
      defaultId: "wood-natural",
      matTarget: { matNames: ["milietblematerial.001", "miliesetchair_material.001"] },
      textureSet: "wood",
    },
    secondarySlot: {
      label: "Warna Taplak",
      icon: "🧶",
      options: TABLECLOTH_OPTIONS,
      defaultId: "cream",
      matTarget: { matNames: ["Bentley 05 Soft Fabric.001"] },
      textureSet: "tablecloth",
    },
  },
  dining3: {
    primarySlot: {
      label: "Material Top Meja",
      icon: "🪨",
      options: [...BODY_OPTIONS.filter(o => o.id === "white" || o.id === "black" || o.id === "cream"), ...MARBLE_OPTIONS, ...GLASS_OPTIONS],
      defaultId: "white",
      matTarget: { matNames: ["Table_Marble"] },
      textureSet: null,
    },
    secondarySlot: {
      label: "Material Rangka Besi",
      icon: "⚙️",
      options: FRAME_OPTIONS.filter(o => o.type === "metal"),
      defaultId: "metal-black",
      matTarget: { matNames: ["Table_White_Wood", "WoodSRB", "Walnut_D"] },
      textureSet: null,
    },
  },
};

// ─── Texture Helpers ───────────────────────────────────────────────────────────
export function applyTexSettings(tex, repeatU = 3, repeatV = 3) {
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(repeatU, repeatV);
  tex.needsUpdate = true;
}

export function loadTextureSet(loader, urls, onDone) {
  const result = {}; let loaded = 0;
  const keys = Object.keys(urls);
  if (keys.length === 0) { onDone(result); return; }
  keys.forEach((key) => {
    result[key] = loader.load(urls[key], () => { loaded += 1; if (loaded === keys.length) onDone(result); });
  });
}

// ─── Material factories ────────────────────────────────────────────────────────
export function makeAdvancedMaterial(opt) {
  const color = new THREE.Color(opt.hex);
  if (opt.type === "glass") {
    return new THREE.MeshPhysicalMaterial({
      color,
      roughness: opt.roughness ?? 0,
      metalness: opt.metalness ?? 0,
      transmission: opt.transmission ?? 0.9,
      ior: opt.ior ?? 1.5,
      transparent: opt.transparent ?? true,
      thickness: 0.05,
      envMapIntensity: 1.5,
    });
  }
  return new THREE.MeshStandardMaterial({
    color,
    roughness: opt.roughness ?? 0.7,
    metalness: opt.metalness ?? 0.0,
    envMapIntensity: 1.2,
  });
}

export function makeFrameMaterial(opt, woodTextures) {
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

export function makeFabricMaterial(hex, fabricTextures) {
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

export function makeTableclothMaterial(hex, tableclothTextures) {
  const color = new THREE.Color(hex);
  if (!tableclothTextures) return new THREE.MeshStandardMaterial({ color, roughness: 0.95, metalness: 0.0 });
  const mat = new THREE.MeshStandardMaterial({
    map: tableclothTextures.color.clone(), normalMap: tableclothTextures.normal.clone(),
    roughnessMap: tableclothTextures.roughness.clone(), aoMap: tableclothTextures.ao ? tableclothTextures.ao.clone() : null,
    color, roughness: 1.0, metalness: 0.0,
  });
  if (mat.map)          { mat.map.colorSpace = THREE.SRGBColorSpace; applyTexSettings(mat.map, 3, 3); }
  if (mat.normalMap)    applyTexSettings(mat.normalMap, 3, 3);
  if (mat.roughnessMap) applyTexSettings(mat.roughnessMap, 3, 3);
  if (mat.aoMap)        applyTexSettings(mat.aoMap, 3, 3);
  return mat;
}

export function makePlasticMaterial(hex, plasticTextures) {
  const color = new THREE.Color(hex);
  if (!plasticTextures) return new THREE.MeshStandardMaterial({ color, roughness: 0.6, metalness: 0.0 });
  const mat = new THREE.MeshStandardMaterial({
    map: plasticTextures.color.clone(), normalMap: plasticTextures.normal.clone(),
    roughnessMap: plasticTextures.roughness.clone(),
    color, roughness: 0.8, metalness: 0.0,
  });
  if (mat.map)          { mat.map.colorSpace = THREE.SRGBColorSpace; applyTexSettings(mat.map, 2, 2); }
  if (mat.normalMap)    applyTexSettings(mat.normalMap, 2, 2);
  if (mat.roughnessMap) applyTexSettings(mat.roughnessMap, 2, 2);
  return mat;
}

export function makeWood47Material(hex, wood47Textures) {
  const color = new THREE.Color(hex);
  if (!wood47Textures) return new THREE.MeshStandardMaterial({ color, roughness: 0.8, metalness: 0.0 });
  const mat = new THREE.MeshStandardMaterial({
    map: wood47Textures.color.clone(), normalMap: wood47Textures.normal.clone(),
    roughnessMap: wood47Textures.roughness.clone(),
    color, roughness: 0.8, metalness: 0.0,
  });
  if (mat.map)          { mat.map.colorSpace = THREE.SRGBColorSpace; applyTexSettings(mat.map, 2, 2); }
  if (mat.normalMap)    applyTexSettings(mat.normalMap, 2, 2);
  if (mat.roughnessMap) applyTexSettings(mat.roughnessMap, 2, 2);
  return mat;
}

// Build a THREE.Material from a slot option + texture sets
export function buildMaterialFromOption(opt, textureSet, allTextures) {
  const { woodTextures, fabricTextures, tableclothTextures, plasticTextures, wood47Textures } = allTextures;

  if (textureSet === "fabric") {
    return makeFabricMaterial(opt.hex, fabricTextures);
  }
  if (textureSet === "tablecloth") {
    return makeTableclothMaterial(opt.hex, tableclothTextures);
  }
  if (textureSet === "wood") {
    if (opt.id === "wood-047") {
      return makeWood47Material(opt.hex, wood47Textures);
    }
    if (opt.type === "wood" || opt.type === "metal") {
      return makeFrameMaterial(opt, woodTextures);
    }
  }
  if (textureSet === "plastic" || opt.type === "plastic") {
    return makePlasticMaterial(opt.hex, plasticTextures);
  }
  return makeAdvancedMaterial(opt);
}

// Apply a slot to placed model
export function applySlotToModel(root, matTarget, newMaterial, useOriginal = false) {
  if (!root) return;

  root.traverse((node) => {
    if (!node.isMesh) return;

    // Backup original materials once
    if (!node.userData.originalMaterialBackup) {
      if (Array.isArray(node.material)) {
        node.userData.originalMaterialBackup = node.material.map(m => m.clone());
      } else if (node.material) {
        node.userData.originalMaterialBackup = node.material.clone();
      }
    }

    // Helper for pillow combo colors
    const getPillowComboColor = (baseColor, pillowName) => {
      const hsl = {};
      baseColor.getHSL(hsl);
      const newColor = baseColor.clone();
      if (pillowName === "pillow black") {
        // First pillow: lighter or white variant
        newColor.setHSL(hsl.h, hsl.s * 0.5, Math.min(1.0, hsl.l + 0.3));
        // Force white if it's already a very light color
        if (hsl.l > 0.8) newColor.setHex(0xFFFFFF);
      } else if (pillowName === "pillow brown") {
        // Second pillow: darker accent or complementary
        newColor.setHSL((hsl.h + 0.1) % 1.0, Math.min(1.0, hsl.s + 0.2), Math.max(0.2, hsl.l - 0.2));
        // Force mocha brown if it's ivory
        if (hsl.l > 0.8) newColor.setHex(0x7D6552);
      }
      return newColor;
    };

    // Helper to replace/tint or restore
    const processMaterial = (currentMat, index) => {
      if (useOriginal) {
        const backup = node.userData.originalMaterialBackup;
        const origMat = Array.isArray(backup) ? backup[index] : backup;
        if (!origMat) return currentMat;
        const restored = origMat.clone();
        return restored;
      }
      if (matTarget.tintOnly) {
        currentMat.color.setHex(newMaterial.color.getHex());
        if (newMaterial.roughness !== undefined) currentMat.roughness = newMaterial.roughness;
        if (newMaterial.metalness !== undefined) currentMat.metalness = newMaterial.metalness;
        return currentMat;
      }
      const nm = newMaterial.clone();
      
      // Apply pillow combo colors
      if (currentMat.name === "pillow black" || currentMat.name === "pillow brown") {
        nm.color = getPillowComboColor(newMaterial.color, currentMat.name);
      }
      
      nm.name = currentMat.name;
      return nm;
    };

    let isTargeted = false;
    if (matTarget.all) {
      isTargeted = true;
    } else if (matTarget.nodeNames && matTarget.nodeNames.includes(node.name)) {
      isTargeted = true;
    } else if (matTarget.except && !matTarget.except.includes(node.name)) {
      isTargeted = true;
    }

    if (isTargeted && !matTarget.matNames) {
      if (Array.isArray(node.material)) {
        node.material = node.material.map((m, i) => processMaterial(m, i));
      } else if (node.material) {
        node.material = processMaterial(node.material, 0);
      }
      return;
    }

    // matNames targets specific materials regardless of node (or combined with nodeNames)
    if (matTarget.matNames) {
      // If nodeNames is defined and we are not in it, skip
      if (matTarget.nodeNames && !matTarget.nodeNames.includes(node.name)) return;
      
      if (Array.isArray(node.material)) {
        node.material = node.material.map((m, i) => {
          if (matTarget.matNames.includes(m.name)) {
            return processMaterial(m, i);
          }
          return m;
        });
      } else if (node.material && matTarget.matNames.includes(node.material.name)) {
        node.material = processMaterial(node.material, 0);
      }
    }
  });
}
