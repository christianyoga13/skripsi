import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Link, useNavigate, useParams, useSearchParams } from "react-router-dom";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { Save, Check, X, Info } from "lucide-react";

// ─── GLB model imports ─────────────────────────────────────────────────────────
import couchModel        from "../assets/couch1.glb";
import tableModel        from "../assets/table.glb";
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
import { getProductBySlug } from "../data/products";
import woodColorUrl    from "../assets/Wood060_2K-JPG/Wood060_2K-JPG_Color.jpg";
import woodNormalUrl   from "../assets/Wood060_2K-JPG/Wood060_2K-JPG_NormalGL.jpg";
import woodRoughUrl    from "../assets/Wood060_2K-JPG/Wood060_2K-JPG_Roughness.jpg";
import woodAOUrl       from "../assets/Wood060_2K-JPG/Wood060_2K-JPG_AmbientOcclusion.jpg";
import { createWorkspace, getWorkspaceById } from "../lib/workspaceStorage";

// ─── Texture URL maps ──────────────────────────────────────────────────────────

const FABRIC_URLS = {
  color: fabricColorUrl, normal: fabricNormalUrl,
  roughness: fabricRoughnessUrl, ao: fabricAOUrl,
};
const WOOD_URLS = { color: woodColorUrl, normal: woodNormalUrl, roughness: woodRoughUrl, ao: woodAOUrl };

// ─── Material options ──────────────────────────────────────────────────────────

const FRAME_OPTIONS = [
  { id: "wood-light",  label: "Kayu Natural", type: "wood",  hex: 0x9C6B3C, roughness: 0.85, metalness: 0.0 },
  { id: "wood-dark",   label: "Kayu Gelap",   type: "wood",  hex: 0x3B1F0E, roughness: 0.80, metalness: 0.0 },
  { id: "metal-black", label: "Besi Hitam",   type: "metal", hex: 0x1C1C1C, roughness: 0.25, metalness: 0.85 },
  { id: "metal-gold",  label: "Kuningan",     type: "metal", hex: 0xB8860B, roughness: 0.18, metalness: 0.92 },
];

const CUSHION_OPTIONS = [
  { id: "natural",    label: "Natural",    hex: 0xD4C4B0 },
  { id: "charcoal",   label: "Charcoal",   hex: 0x3A3A3A },
  { id: "terracotta", label: "Terracotta", hex: 0xC4614B },
  { id: "sage",       label: "Sage",       hex: 0x7A9E84 },
  { id: "navy",       label: "Navy",       hex: 0x3D5878 },
];

// ─── AR Models — all GLB assets ───────────────────────────────────────────────

const AR_MODELS = [
  { id: "sofa",      label: "Sofa",         modelUrl: couchModel,        initialScale: 1, icon: "🛋️", group: "Ruang Tamu"  },
  { id: "table",     label: "Meja Makan",   modelUrl: tableModel,        initialScale: 1, icon: "🍽️", group: "Ruang Makan" },
  { id: "coffeetbl", label: "Meja Kopi",    modelUrl: coffeeTableModel,  initialScale: 1, icon: "☕",  group: "Ruang Tamu"  },
  { id: "bed",       label: "Kasur 1",      modelUrl: bedModel,          initialScale: 1, icon: "🛏️", group: "Kamar Tidur" },
  { id: "bed1",      label: "Kasur 2",      modelUrl: bed1Model,         initialScale: 1, icon: "🛏️", group: "Kamar Tidur" },
  { id: "desk",      label: "Meja Belajar", modelUrl: studydeskModel,    initialScale: 1, icon: "📖", group: "Kamar Tidur" },
  { id: "desk1",     label: "Meja Kerja",   modelUrl: studydesk1Model,   initialScale: 1, icon: "💼", group: "Ruang Kerja" },
  { id: "cupboard",  label: "Lemari",       modelUrl: cupboardModel,     initialScale: 1, icon: "🗄️", group: "Penyimpanan" },
  { id: "cupboard1", label: "Lemari 2",     modelUrl: cupboard1Model,    initialScale: 1, icon: "🗄️", group: "Penyimpanan" },
  { id: "wardrobe",  label: "Wardrobe",     modelUrl: wardrobeModel,     initialScale: 1, icon: "👕", group: "Penyimpanan" },
  { id: "wardrobe1", label: "Wardrobe 2",   modelUrl: wardrobe1Model,    initialScale: 1, icon: "👗", group: "Penyimpanan" },
  { id: "dining1",   label: "Meja Makan 1", modelUrl: diningTableModel,  initialScale: 1, icon: "🍽️", group: "Ruang Makan" },
  { id: "dining2",   label: "Meja Makan 2", modelUrl: diningTable1Model, initialScale: 1, icon: "🍽️", group: "Ruang Makan" },
  { id: "dining3",   label: "Meja Makan 3", modelUrl: diningTable2Model, initialScale: 1, icon: "🍽️", group: "Ruang Makan" },
];

// ─── Status config ─────────────────────────────────────────────────────────────

const STATUS_PILL = {
  loading:       { color: "#9ca3af", label: "Memuat..."       },
  permission:    { color: "#f59e0b", label: "Izinkan Kamera"  },
  scanning:      { color: "#22c55e", label: "AR Ready"         },
  placed:        { color: "#22c55e", label: "AR Aktif"         },
  failed:        { color: "#ef4444", label: "AR Gagal"         },
  unsupported:   { color: "#9ca3af", label: "Tidak Didukung"   },
  "load-origin": { color: "#60a5fa", label: "Tap Lantai"       },
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

// ─── Mesh categorization ───────────────────────────────────────────────────────

const SOFA_FRAME_MESHES = ["bottom", "legs", "sides"];
const SOFA_CUSHION_MESHES = [
  "back",
  "Back cousion", "Back cousion.001", "Back cousion.002",
  "seat cousion",  "seat cousion.001",  "seat cousion.002",
  "pillow.001",    "pillow.002",         "pillow.003",
];

const FRAME_KEYWORDS   = ["frame", "leg", "base", "arm", "foot", "feet", "support", "rail", "struct"];
const CUSHION_KEYWORDS = ["cushion", "seat", "back", "pillow", "fabric", "cover", "upholstery", "soft", "pad"];

function getMeshPart(node) {
  const name = (node.name || "").toLowerCase();
  if (SOFA_FRAME_MESHES.length || SOFA_CUSHION_MESHES.length) {
    if (SOFA_FRAME_MESHES.includes(node.name))   return "frame";
    if (SOFA_CUSHION_MESHES.includes(node.name)) return "cushion";
    return "unknown";
  }
  if (CUSHION_KEYWORDS.some((k) => name.includes(k))) return "cushion";
  if (FRAME_KEYWORDS.some((k) => name.includes(k)))   return "frame";
  return "unknown";
}

// ─── Material factories ────────────────────────────────────────────────────────

function applyTexSettings(tex, repeatU = 3, repeatV = 3) {
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(repeatU, repeatV);
  tex.needsUpdate = true;
}

function makeMetalMaterial(opt) {
  return new THREE.MeshStandardMaterial({
    color: new THREE.Color(opt.hex),
    roughness: opt.roughness,
    metalness: opt.metalness,
    envMapIntensity: 1.5,
  });
}

function makeWoodMaterial(opt, woodTextures) {
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

function makeFabricMaterial(opt, fabricTextures) {
  const color = new THREE.Color(opt.hex);
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

function makeFrameMaterial(frameId, woodTextures) {
  const opt = FRAME_OPTIONS.find((o) => o.id === frameId) ?? FRAME_OPTIONS[0];
  return opt.type === "metal" ? makeMetalMaterial(opt) : makeWoodMaterial(opt, woodTextures);
}

function replaceMeshMaterial(node, mat) {
  if (Array.isArray(node.material)) {
    node.material.forEach((m) => m.dispose());
    node.material = node.material.map(() => mat.clone());
  } else {
    node.material?.dispose();
    node.material = mat;
  }
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

// ─── Texture loader helper ─────────────────────────────────────────────────────

function loadTextureSet(loader, urls, onDone) {
  const result = {}; let loaded = 0;
  const keys = Object.keys(urls);
  keys.forEach((key) => {
    result[key] = loader.load(urls[key], () => { loaded += 1; if (loaded === keys.length) onDone(result); });
  });
}

// ─── AR scene builder ──────────────────────────────────────────────────────────

function buildFurnitureScene({
  canvas, models,
  selectedModelRef, activeObjectRef,
  onStatusChange, onError,
  selectedFrameRef, selectedCushionRef,
  applyFrameRef, applyCushionRef,
  snapshotRef, pendingLoadRef,
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

  let glbLoader = null, fabricTextures = null, woodTextures = null;

  // ── Material apply helpers ───────────────────────────────────────────────

  const applyFrameToSofa = (frameId) => {
    const placed = placedObjects.get("sofa"); if (!placed) return;
    const mat = makeFrameMaterial(frameId, woodTextures);
    placed.root.traverse((node) => {
      if (!node.isMesh || getMeshPart(node) !== "frame") return;
      replaceMeshMaterial(node, mat.clone());
    });
    mat.dispose();
  };

  const applyCushionToSofa = (cushionId) => {
    const placed = placedObjects.get("sofa"); if (!placed) return;
    const mat = makeFabricMaterial(CUSHION_OPTIONS.find((o) => o.id === cushionId) ?? CUSHION_OPTIONS[0], fabricTextures);
    placed.root.traverse((node) => {
      if (!node.isMesh) return;
      const part = getMeshPart(node);
      if (part === "cushion" || part === "unknown") replaceMeshMaterial(node, mat.clone());
    });
    mat.dispose();
  };

  const applyBothMaterials = (frameId, cushionId) => {
    applyFrameToSofa(frameId); applyCushionToSofa(cushionId);
    const placed = placedObjects.get("sofa");
    if (placed) {
      let frameFound = false;
      placed.root.traverse((n) => { if (n.isMesh && getMeshPart(n) === "frame") frameFound = true; });
      if (!frameFound) console.warn("[ProductAR] No frame mesh detected — fill SOFA_FRAME_MESHES.");
    }
  };

  applyFrameRef.current   = applyFrameToSofa;
  applyCushionRef.current = applyCushionToSofa;

  // ── Snapshot ─────────────────────────────────────────────────────────────

  snapshotRef.current = () => {
    const objects = [];
    placedObjects.forEach((obj, modelId) => {
      if (!obj.root.visible) return;
      objects.push({
        modelId,
        x: obj.root.position.x, y: obj.root.position.y, z: obj.root.position.z,
        scale: obj.scale, rotationY: obj.root.rotation.y,
        frameId:   modelId === "sofa" ? selectedFrameRef.current  : null,
        cushionId: modelId === "sofa" ? selectedCushionRef.current : null,
      });
    });
    return objects;
  };

  // ── Spawn from workspace ─────────────────────────────────────────────────

  const spawnFromOrigin = (originPoint, savedObjects) => {
    if (!savedObjects || savedObjects.length === 0) return;
    const cx = savedObjects.reduce((s, o) => s + o.x, 0) / savedObjects.length;
    const cz = savedObjects.reduce((s, o) => s + o.z, 0) / savedObjects.length;
    savedObjects.forEach((item) => {
      const config = models.find((m) => m.id === item.modelId);
      const source = loadedModels.get(item.modelId);
      if (!config || !source || !sceneRef) return;
      let obj = placedObjects.get(item.modelId);
      if (!obj) {
        const root = source.clone(true);
        obj = { id: item.modelId, root, scale: item.scale };
        root.scale.setScalar(item.scale);
        sceneRef.add(root);
        placedObjects.set(item.modelId, obj);
      } else {
        obj.scale = item.scale;
        obj.root.scale.setScalar(item.scale);
      }
      obj.root.position.set(originPoint.x + (item.x - cx), 0, originPoint.z + (item.z - cz));
      obj.root.rotation.y = item.rotationY;
      obj.root.visible = true;
      if (item.modelId === "sofa") {
        if (item.frameId)   applyFrameToSofa(item.frameId);
        if (item.cushionId) applyCushionToSofa(item.cushionId);
      }
    });
    floorMarker.position.copy(originPoint);
    floorMarker.visible = true;
    onStatusChange("placed");
  };

  // ── Lazy model loader ─────────────────────────────────────────────────────

  const lazyLoadModel = (config) => {
    if (loadedModels.has(config.id) || loadingSet.has(config.id)) return;
    loadingSet.add(config.id);
    glbLoader.load(
      config.modelUrl,
      (gltf) => {
        console.group(`[ProductAR] Mesh list — ${config.label}`);
        gltf.scene.traverse((node) => {
          if (node.isMesh) console.log(`  "${node.name}"  part→${getMeshPart(node)}  parent:"${node.parent?.name}"`);
        });
        console.groupEnd();
        gltf.scene.visible = false;
        loadedModels.set(config.id, gltf.scene);
        loadingSet.delete(config.id);
        // Retry pending placement
        if (pendingPlace && selectedModelRef.current === config.id) {
          const { x, y } = pendingPlace; pendingPlace = null;
          addSelectedObject(x, y);
        }
        // Workspace readiness check
        if (pendingLoadRef.current) {
          const allLoaded = pendingLoadRef.current.every((o) => loadedModels.has(o.modelId));
          if (allLoaded && !waitingForOrigin) { waitingForOrigin = true; onStatusChange("load-origin"); }
        } else {
          onStatusChange("scanning");
        }
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
      if (config.id === "sofa") applyBothMaterials(selectedFrameRef.current, selectedCushionRef.current);
    }
    activeObject = obj;
    activeObjectRef.current = obj;
    return setObjectOnFloor(obj, clientX, clientY);
  };

  // syncActive — always updates activeObject to match the currently selected model.
  // If the selected model has not been placed yet, activeObject is cleared to null.
  const syncActive = () => {
    const obj = placedObjects.get(selectedModelRef.current) ?? null;
    activeObject = obj;
    activeObjectRef.current = obj;
  };

  // ── Raycast helpers — tap-to-select & direct grab ────────────────────────

  // Collect all meshes from visible placed objects and raycast against them.
  // Returns the placed-object record that was hit (closest), or null.
  const raycastPlacedObjects = (clientX, clientY) => {
    if (!camera || placedObjects.size === 0) return null;
    const rect = canvas.getBoundingClientRect();
    pointer.x = ((clientX - rect.left) / rect.width)  *  2 - 1;
    pointer.y = ((clientY - rect.top)  / rect.height) * -2 + 1;
    raycaster.setFromCamera(pointer, camera);

    // Build mesh list and a Map(mesh → placedObj) in a single pass.
    const meshes   = [];
    const meshToObj = new Map();
    placedObjects.forEach((obj) => {
      if (!obj.root.visible) return;
      obj.root.traverse((node) => {
        if (node.isMesh) {
          meshes.push(node);
          meshToObj.set(node, obj);
        }
      });
    });
    if (meshes.length === 0) return null;

    const hits = raycaster.intersectObjects(meshes, false);
    if (hits.length === 0) return null;
    return meshToObj.get(hits[0].object) ?? null;
  };

  // Mark a placed object as the active (selected) one and notify React UI.
  const selectPlacedObj = (obj) => {
    activeObject = obj;
    activeObjectRef.current = obj;
    selectedModelRef.current = obj.id;
    onModelSelect?.(obj.id); // updates React state so UI pill / model picker reflects the change
  };

  // Called immediately from React when the user taps a model button in the UI.
  // Ensures the canvas reflects the new selection BEFORE the next touch event.
  if (notifyModelChangeRef) {
    notifyModelChangeRef.current = () => {
      syncActive();
      lastSingleTouch = null;
      gestureStart    = null;
    };
  }

  // ── Touch / pointer handlers ─────────────────────────────────────────────

  const resolveFloor = (clientX, clientY) => {
    if (!camera) return null;
    const rect = canvas.getBoundingClientRect();
    pointer.x = ((clientX - rect.left) / rect.width)  *  2 - 1;
    pointer.y = ((clientY - rect.top)  / rect.height)  * -2 + 1;
    raycaster.setFromCamera(pointer, camera);
    const p = new THREE.Vector3();
    return raycaster.ray.intersectPlane(floor, p) ? p : null;
  };

  const handleTap = (clientX, clientY) => {
    if (waitingForOrigin) {
      const p = resolveFloor(clientX, clientY);
      if (p && pendingLoadRef.current) {
        waitingForOrigin = false;
        spawnFromOrigin(p, pendingLoadRef.current);
        pendingLoadRef.current = null;
      }
      return;
    }

    // Tap on a placed object → select it (don't move it).
    // This lets the user switch active selection by tapping the furniture in the scene.
    const hitObj = raycastPlacedObjects(clientX, clientY);
    if (hitObj) {
      selectPlacedObj(hitObj);
      return;
    }

    // Tap on the floor → place / teleport the currently selected model there.
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

      // Direct-grab: if the finger lands on a placed object, lock on to that object
      // regardless of what the UI model picker says. This is how the user naturally
      // expects to pick up and move a furniture item they can see in the scene.
      const hitObj = raycastPlacedObjects(t.clientX, t.clientY);
      if (hitObj) {
        selectPlacedObj(hitObj); // also updates React UI
      } else {
        syncActive();            // fall back to whatever model is selected in the UI
      }
    }

    if (e.touches.length === 2) {
      // For two-finger pinch / rotate we use the object that is currently active.
      // syncActive keeps this in sync with the UI picker (or with a prior direct-grab).
      syncActive();
      if (!activeObject?.root.visible) return;
      e.preventDefault();
      lastSingleTouch = null;
      suppressPlacementUntil = Date.now() + 350;
      // Lock gestureTarget so switching models mid-gesture doesn’t corrupt scale/rotation.
      const gestureTarget = activeObject;
      gestureStart = {
        target:    gestureTarget,
        distance:  getTouchDistance(e.touches),
        angle:     getTouchAngle(e.touches),
        scale:     gestureTarget.scale,
        rotationY: gestureTarget.root.rotation.y,
      };
    }
  };

  const handleTouchMove = (e) => {
    // Single-finger drag: move whichever object was locked in handleTouchStart.
    // Do NOT call syncActive here — the target was already determined (either via
    // direct raycast or via the UI selection) when the finger went down.
    if (e.touches.length === 1) {
      if (lastSingleTouch && activeObject && !waitingForOrigin) {
        e.preventDefault();
        const [t] = e.touches;
        if (Math.hypot(t.clientX - lastSingleTouch.startX, t.clientY - lastSingleTouch.startY) > 8) {
          lastSingleTouch.moved = true;
          setObjectOnFloor(activeObject, t.clientX, t.clientY);
        }
        lastSingleTouch = { ...lastSingleTouch, x: t.clientX, y: t.clientY };
      }
    }
    // Two-finger gesture: apply scale/rotate to gestureStart.target (locked at gesture begin).
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
      const hadGesture    = gestureStart !== null;
      lastSingleTouch = null;
      gestureStart    = null;
      // Keep a longer suppression after a two-finger gesture so the finger-lift
      // doesn't immediately trigger a single-tap placement.
      suppressPlacementUntil = hadGesture ? Date.now() + 350 : Date.now() + 80;
    }
    if (e.touches.length === 1) {
      if (gestureStart) {
        lastSingleTouch        = null;
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
        fabricTextures = result;
        const placed = placedObjects.get("sofa");
        if (placed) applyCushionToSofa(selectedCushionRef.current);
      });
      if (WOOD_URLS) {
        loadTextureSet(texLoader, WOOD_URLS, (result) => {
          woodTextures = result;
          const placed = placedObjects.get("sofa");
          if (placed) applyFrameToSofa(selectedFrameRef.current);
        });
      }

      // Lazy-load: only load the initially selected model (others load on demand)
      glbLoader = new GLTFLoader();
      const initConfig = models.find((m) => m.id === selectedModelRef.current) ?? models[0];
      lazyLoadModel(initConfig);

      // Pre-load workspace models if restoring a saved layout
      if (pendingLoadRef.current) {
        pendingLoadRef.current.forEach((item) => {
          const cfg = models.find((m) => m.id === item.modelId);
          if (cfg) lazyLoadModel(cfg);
        });
      }
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

// ─── Component ─────────────────────────────────────────────────────────────────

export default function ProductAR() {
  const { slug }       = useParams();
  const [searchParams] = useSearchParams();
  const navigate       = useNavigate();
  const product        = getProductBySlug(slug);
  const canvasRef      = useRef(null);
  const loadId         = searchParams.get("load");

  const [arStatus,            setArStatus]           = useState("loading");
  const [errorDetail,         setErrorDetail]        = useState("");
  const [browserBottomOffset, setBrowserBottomOffset] = useState(0);
  const [inAppBrowser]      = useState(() => isInAppBrowser());
  const [isMobile]          = useState(() => isMobileBrowser());
  const [selectedModel,       setSelectedModel]      = useState(AR_MODELS[0].id);
  const [selectedFrame,       setSelectedFrame]      = useState(FRAME_OPTIONS[0].id);
  const [selectedCushion,     setSelectedCushion]    = useState(CUSHION_OPTIONS[0].id);
  const [showSaveDialog,      setShowSaveDialog]     = useState(false);
  const [savedToast,          setSavedToast]         = useState(false);
  const [activeTab,           setActiveTab]          = useState(null); // null | "material" | "object" | "warna"
  const [showInfo,            setShowInfo]           = useState(false);

  const selectedModelRef   = useRef(AR_MODELS[0].id);
  const selectedFrameRef   = useRef(FRAME_OPTIONS[0].id);
  const selectedCushionRef = useRef(CUSHION_OPTIONS[0].id);
  const activeObjectRef    = useRef(null);
  const applyFrameRef      = useRef(null);
  const applyCushionRef    = useRef(null);
  const snapshotRef        = useRef(null);
  const pendingLoadRef     = useRef(null);
  const notifyModelChangeRef = useRef(null);
  // Called from inside the AR scene when user taps directly on a placed object.
  // We use a ref-wrapped setter so the closure inside buildFurnitureScene always
  // has access to the latest setSelectedModel without needing to re-register.
  const onModelSelectRef = useRef(null);
  onModelSelectRef.current = (modelId) => {
    setSelectedModel(modelId);
    selectedModelRef.current = modelId;
  };

  useEffect(() => {
    if (!loadId) return;
    const ws = getWorkspaceById(loadId);
    if (ws) pendingLoadRef.current = ws.objects;
  }, [loadId]);

  useEffect(() => { selectedModelRef.current   = selectedModel;   }, [selectedModel]);
  useEffect(() => { selectedFrameRef.current   = selectedFrame;   }, [selectedFrame]);
  useEffect(() => { selectedCushionRef.current = selectedCushion; }, [selectedCushion]);

  const handleSave = (name) => {
    const objects = snapshotRef.current?.();
    if (!objects || objects.length === 0) { setShowSaveDialog(false); return; }
    createWorkspace({ name, objects });
    setShowSaveDialog(false);
    setSavedToast(true);
    setTimeout(() => setSavedToast(false), 2500);
  };

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
            selectedFrameRef, selectedCushionRef,
            applyFrameRef, applyCushionRef,
            snapshotRef, pendingLoadRef,
            notifyModelChangeRef,
            // Stable callback: the ref wrapper means the closure never stales out.
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
  const isSofa      = selectedModel === "sofa";

  const TABS = ["material", "object", "warna"];
  const TAB_LABEL    = { material: "Material", object: "Object",          warna: "Warna" };
  const PILL_LABEL   = { material: "Material", object: modelConfig.label, warna: "Warna" };

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
      {savedToast && (
        <div className="pointer-events-none fixed left-1/2 top-20 z-[2147483647] -translate-x-1/2 flex items-center gap-2 rounded-full bg-emerald-600/90 px-5 py-2.5 text-xs font-semibold text-white shadow-xl backdrop-blur-sm">
          <Check size={13} /> Layout berhasil disimpan
        </div>
      )}

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
                "Gunakan tab Object untuk memilih jenis furniture yang akan ditempatkan",
                "Tab Material = warna rangka (Sofa) · Tab Warna = warna kain (Sofa)",
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

          {/* Active-object indicator — always visible when something is placed */}
          {arStatus === "placed" && (
            <div className="mb-2 flex items-center justify-between gap-2">
              {/* Active selection badge */}
              <div className="flex items-center gap-2 rounded-full bg-black/40 px-3 py-1.5 backdrop-blur-md">
                <span className="text-base leading-none">{modelConfig.icon}</span>
                <div>
                  <p className="text-[8px] font-medium uppercase tracking-[0.14em] text-white/50">Aktif</p>
                  <p className="text-[11px] font-semibold leading-tight text-white">{modelConfig.label}</p>
                </div>
              </div>
              {/* Save button */}
              <button id="ar-save-btn" onClick={() => setShowSaveDialog(true)}
                className="flex items-center gap-2 rounded-full bg-white/90 px-5 py-2.5 text-[11px] font-semibold text-[#1a1a1a] shadow-lg backdrop-blur-md">
                <Save size={14} /> Simpan Layout
              </button>
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

                {/* Object grid */}
                {activeTab === "object" && (
                  <div className="grid grid-cols-3 gap-2 p-3 pb-[calc(env(safe-area-inset-bottom)+0.75rem)]">
                    {AR_MODELS.map((m) => (
                      <button key={m.id}
                        onClick={() => {
                          setSelectedModel(m.id);
                          selectedModelRef.current = m.id;
                          // Immediately notify the AR scene so activeObject is synced
                          // before the next touch event — prevents stale object interaction.
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

                {/* Material tab — Rangka swatches */}
                {activeTab === "material" && (
                  <div className="px-5 py-5 pb-[calc(env(safe-area-inset-bottom)+1.25rem)]">
                    {isSofa ? (
                      <>
                        <p className="mb-4 text-[10px] font-semibold uppercase tracking-[0.18em] text-[#999]">Rangka</p>
                        <div className="flex flex-wrap gap-3">
                          {FRAME_OPTIONS.map((opt) => {
                            const sel = selectedFrame === opt.id;
                            const hex = `#${opt.hex.toString(16).padStart(6, "0")}`;
                            return (
                              <button key={opt.id} title={opt.label}
                                onClick={() => { setSelectedFrame(opt.id); selectedFrameRef.current = opt.id; applyFrameRef.current?.(opt.id); }}
                                className={`h-11 w-11 rounded-full transition-all ${sel ? "scale-110 ring-2 ring-[#1a1a1a] ring-offset-2 ring-offset-[#f0eeec]" : "ring-1 ring-black/20"}`}
                                style={{ backgroundColor: hex, boxShadow: opt.type === "metal" ? "inset 0 2px 5px rgba(255,255,255,0.3),inset 0 -1px 3px rgba(0,0,0,0.4)" : undefined }}
                              />
                            );
                          })}
                        </div>
                        <p className="mt-2 text-[10px] text-[#aaa]">{FRAME_OPTIONS.find(o => o.id === selectedFrame)?.label}</p>
                      </>
                    ) : (
                      <div className="flex flex-col items-center py-8 text-center">
                        <span className="mb-2 text-3xl">🛋️</span>
                        <p className="text-[13px] font-semibold text-[#555]">Pilih Sofa</p>
                        <p className="mt-1 text-[11px] text-[#aaa]">Kustomisasi rangka tersedia untuk model Sofa</p>
                      </div>
                    )}
                  </div>
                )}

                {/* Warna tab — Kain swatches */}
                {activeTab === "warna" && (
                  <div className="px-5 py-5 pb-[calc(env(safe-area-inset-bottom)+1.25rem)]">
                    {isSofa ? (
                      <>
                        <p className="mb-4 text-[10px] font-semibold uppercase tracking-[0.18em] text-[#999]">Warna Kain</p>
                        <div className="flex flex-wrap gap-3">
                          {CUSHION_OPTIONS.map((opt) => {
                            const sel = selectedCushion === opt.id;
                            const hex = `#${opt.hex.toString(16).padStart(6, "0")}`;
                            return (
                              <button key={opt.id} title={opt.label}
                                onClick={() => { setSelectedCushion(opt.id); selectedCushionRef.current = opt.id; applyCushionRef.current?.(opt.id); }}
                                className={`h-11 w-11 rounded-full transition-all ${sel ? "scale-110 ring-2 ring-[#1a1a1a] ring-offset-2 ring-offset-[#f0eeec]" : "ring-1 ring-black/20"}`}
                                style={{ backgroundColor: hex }}
                              />
                            );
                          })}
                        </div>
                        <p className="mt-2 text-[10px] text-[#aaa]">{CUSHION_OPTIONS.find(o => o.id === selectedCushion)?.label}</p>
                      </>
                    ) : (
                      <div className="flex flex-col items-center py-8 text-center">
                        <span className="mb-2 text-3xl">🎨</span>
                        <p className="text-[13px] font-semibold text-[#555]">Pilih Sofa</p>
                        <p className="mt-1 text-[11px] text-[#aaa]">Kustomisasi warna kain tersedia untuk model Sofa</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Collapsed pill bar */}
          <div className="mb-3 flex items-center justify-around rounded-full bg-black/32 px-6 py-3 shadow-xl backdrop-blur-xl">
            {TABS.map((tab) => {
              const active = activeTab === tab;
              return (
                <button key={tab} onClick={() => toggleTab(tab)} className="flex flex-col items-center gap-1">
                  <span className={`flex items-center justify-center rounded-full transition-all duration-200 ${
                    active ? "h-11 w-11 bg-white text-lg text-[#1a1a1a] shadow" : "h-10 w-10 bg-white/22 text-xl text-white"
                  }`}>
                    {tab === "object" ? modelConfig.icon : ""}
                  </span>
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
