import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Link, useNavigate, useParams } from "react-router-dom";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { MeshoptDecoder } from "three/examples/jsm/libs/meshopt_decoder.module.js";
import { X, Info, Layers, Palette, Box, Trash2 } from "lucide-react";

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

import { getProductBySlug } from "../data/products";
import { FABRIC_URLS, TABLECLOTH_URLS, WOOD_URLS, MODEL_SLOTS, loadTextureSet, buildMaterialFromOption, applySlotToModel } from '../lib/customizer';

const AR_MODELS = [
  { id: "sofa",      label: "Aura Modular Sofa",      modelUrl: couchModel,        initialScale: 1, icon: "🛋️", group: "Ruang Tamu"  },
  { id: "sofa2",     label: "Velo Chaise Sofa",       modelUrl: couch2Model,       initialScale: 1, icon: "🛋️", group: "Ruang Tamu"  },
  { id: "table",     label: "Terra Dining Table",     modelUrl: tableModel,        initialScale: 1, icon: "🍽️", group: "Ruang Makan" },
  { id: "table1",    label: "Solstice Dining Table",  modelUrl: table1Model,       initialScale: 1, icon: "🍽️", group: "Ruang Makan" },
  { id: "coffeetbl", label: "Meridian Coffee Table",  modelUrl: coffeeTableModel,  initialScale: 0.4, icon: "☕",  group: "Ruang Tamu"  },
  { id: "bed",       label: "Haven King Bed",         modelUrl: bedModel,          initialScale: 1, icon: "🛏️", group: "Kamar Tidur" },
  { id: "bed1",      label: "Nordic Platform Bed",    modelUrl: bed1Model,         initialScale: 1, icon: "🛏️", group: "Kamar Tidur" },
  { id: "desk",      label: "Scholar Study Desk",     modelUrl: studydeskModel,    initialScale: 1, icon: "📖", group: "Kamar Tidur" },
  { id: "desk1",     label: "Executive Work Desk",    modelUrl: studydesk1Model,   initialScale: 1, icon: "💼", group: "Ruang Kerja" },
  { id: "cupboard",  label: "Arc Sideboard",          modelUrl: cupboardModel,     initialScale: 1, icon: "🗄️", group: "Penyimpanan" },
  { id: "cupboard1", label: "Loft Storage Cabinet",   modelUrl: cupboard1Model,    initialScale: 1, icon: "🗄️", group: "Penyimpanan" },
  { id: "wardrobe",  label: "Minimal Wardrobe",       modelUrl: wardrobeModel,     initialScale: 1, icon: "👕", group: "Penyimpanan" },
  { id: "wardrobe1", label: "Grand Walk-In Wardrobe", modelUrl: wardrobe1Model,    initialScale: 1, icon: "👗", group: "Penyimpanan" },
  { id: "dining1",   label: "Zenith Dining Table",    modelUrl: diningTableModel,  initialScale: 1, icon: "🍽️", group: "Ruang Makan" },
  { id: "dining2",   label: "Harvest Oval Table",     modelUrl: diningTable1Model, initialScale: 1, icon: "🍽️", group: "Ruang Makan" },
  { id: "dining3",   label: "Compact Bistro Table",   modelUrl: diningTable2Model, initialScale: 1, icon: "🍽️", group: "Ruang Makan" },
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
  deleteActiveObjectRef,
}) {
  let camera, sceneRef, floorMarker;
  let activeObject           = null;
  let lastSingleTouch        = null;
  let gestureStart           = null;
  let suppressPlacementUntil = 0;
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
  // Expose delete method
  deleteActiveObjectRef.current = () => {
    if (activeObject) {
      sceneRef.remove(activeObject.root);
      placedObjects.delete(activeObject.id);
      activeObject = null;
      activeObjectRef.current = null;
      if (placedObjects.size === 0) {
        onStatusChange("scanning");
      }
    }
  };

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
      const next  = THREE.MathUtils.clamp(gestureStart.scale * (dist / gestureStart.distance), 0.1, 3.5);
      target.scale = next;
      target.root.scale.setScalar(next);
      target.root.rotation.y = gestureStart.rotationY - (angle - gestureStart.angle);
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
      
      // OPTIMIZATION: Reduce heavy processing for low-end devices
      renderer.shadowMap.enabled = false;
      renderer.powerPreference = "high-performance";

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
      texLoader.setRequestHeader({ "ngrok-skip-browser-warning": "69420" });
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
      glbLoader.setMeshoptDecoder(MeshoptDecoder);
      glbLoader.setRequestHeader({ "ngrok-skip-browser-warning": "69420" });
      const initConfig = models.find((m) => m.id === selectedModelRef.current) ?? models[0];
      lazyLoadModel(initConfig);
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
  const bottomPanelRef      = useRef(null);
  const menuContainerRef    = useRef(null);

  useEffect(() => {
    if (!menuContainerRef.current) return;
    const observer = new ResizeObserver((entries) => {
      for (let entry of entries) {
        const height = entry.borderBoxSize?.[0]?.blockSize ?? entry.contentRect.height;
        const offset = inAppBrowser ? Math.max(browserBottomOffset, 72) : browserBottomOffset;
        document.documentElement.style.setProperty('--bottom-panel-height', `${height + offset}px`);
      }
    });
    observer.observe(menuContainerRef.current);
    return () => {
      observer.disconnect();
      document.documentElement.style.removeProperty('--bottom-panel-height');
    };
  }, [inAppBrowser, browserBottomOffset]);

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
  const deleteActiveObjectRef  = useRef(null);
  // Mutable refs holding latest selections (used inside AR scene closures)
  const primarySelectionsRef   = useRef(initSelections("primarySlot"));
  const secondarySelectionsRef = useRef(initSelections("secondarySlot"));

  const onModelSelectRef = useRef(null);
  useEffect(() => {
    onModelSelectRef.current = (modelId) => {
      setSelectedModel(modelId);
      selectedModelRef.current = modelId;
    };
  }, []);

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
            snapshotRef,
            notifyModelChangeRef,
            deleteActiveObjectRef,
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

  const TABS = ["material", "object", "warna"];
  const TAB_LABEL  = { material: "Material", object: "Object",          warna: "Warna" };
  const PILL_LABEL = { material: "Material", object: modelConfig.label, warna: "Warna" };
  const ICONS = {
    material: <Layers size={18} />,
    object: <Box size={18} />,
    warna: <Palette size={18} />
  };

  // Current slot info for selected model
  const primarySlot   = slots?.primarySlot;
  const secondarySlot = slots?.secondarySlot;
  const currentPrimaryId   = primarySelections[selectedModel]   ?? primarySlot?.defaultId;
  const currentSecondaryId = secondarySelections[selectedModel] ?? secondarySlot?.defaultId;

  const arOverlay = (
    <>
      {/* ── Top bar ─────────────────────────────────────────────────────── */}
      <div className="pointer-events-none fixed inset-x-0 top-0 z-40 flex items-center justify-between px-5 pt-[calc(env(safe-area-inset-top)+0.75rem)]">
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
        <div className="pointer-events-none fixed inset-x-4 top-16 z-40 rounded-2xl bg-amber-500/90 px-4 py-3 text-xs leading-relaxed text-white backdrop-blur-md">
          Buka di Safari/Chrome agar AR bekerja dengan benar.
        </div>
      )}

      {/* ── Scanning / load-origin hint ─────────────────────────────────── */}
      {(arStatus === "scanning" || arStatus === "load-origin") && (
        <div className="pointer-events-none fixed inset-x-10 top-1/2 z-40 flex -translate-y-1/2 justify-center">
          <div className="rounded-2xl bg-black/40 px-5 py-3 text-center text-[11px] leading-relaxed text-white/85 backdrop-blur-md">
            {STATUS_TEXT[arStatus]}
          </div>
        </div>
      )}

      {/* ── Error detail ─────────────────────────────────────────────────── */}
      {errorDetail && (arStatus === "failed" || arStatus === "unsupported") && (
        <div className="pointer-events-none fixed inset-x-4 top-20 z-40 rounded-2xl bg-red-900/82 px-4 py-3 text-xs leading-relaxed text-red-100 backdrop-blur-md">
          {errorDetail}
        </div>
      )}

      {/* ── Info bottom sheet ───────────────────────────────────────────── */}
      {showInfo && (
        <div className="fixed inset-0 z-50 flex items-end justify-center">
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
        ref={bottomPanelRef}
        data-tour="ar-customize"
        className="pointer-events-none fixed inset-x-0 z-40"
        style={{ bottom: inAppBrowser ? `calc(${Math.max(browserBottomOffset, 72)}px + env(safe-area-inset-bottom))` : `${browserBottomOffset}px` }}
      >
        <style>{`
          @keyframes slideUp {
            from { transform: translateY(20%); opacity: 0; }
            to { transform: translateY(0); opacity: 1; }
          }
        `}</style>
        <div className="pointer-events-auto mx-auto max-w-lg px-3">

          {/* Active-object indicator */}
          {arStatus === "placed" && !activeTab && (
            <div className="mb-2 flex items-center justify-start gap-3 animate-[slideUp_0.3s_ease-out_forwards] pl-1">
              <div className="flex items-center gap-2 rounded-full bg-black/40 px-3 py-1.5 backdrop-blur-md">
                <span className="text-base leading-none">{modelConfig.icon}</span>
                <div>
                  <p className="text-[8px] font-medium uppercase tracking-[0.14em] text-white/50">Aktif</p>
                  <p className="text-[11px] font-semibold leading-tight text-white">{modelConfig.label}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  deleteActiveObjectRef.current?.();
                }}
                className="flex h-9 w-9 items-center justify-center rounded-full bg-red-500/90 text-white shadow-md backdrop-blur-md transition-transform active:scale-95"
                aria-label="Hapus objek"
              >
                <Trash2 size={16} />
              </button>
            </div>
          )}

          {/* Expanded panel */}
          <div className={`grid transition-[grid-template-rows] duration-500 ease-[cubic-bezier(0.2,0.8,0.2,1)] ${activeTab ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}>
            <div className="overflow-hidden">
              <div ref={menuContainerRef} className="mb-2 overflow-hidden rounded-3xl bg-[#f0eeec]/96 shadow-2xl backdrop-blur-2xl animate-[slideUp_0.3s_ease-out_forwards]">

              {/* Tab bar */}
              <div className="flex items-end justify-around px-6 py-4">
                {TABS.map((tab) => {
                  const active = activeTab === tab;
                  return (
                    <button key={tab} data-tour={`ar-tab-${tab}`} onClick={() => toggleTab(tab)} className="flex flex-col items-center gap-1">
                      <span className={`flex items-center justify-center rounded-full font-semibold leading-tight transition-all duration-200 ${
                        active
                          ? "h-12 w-12 border-2 border-[#1a1a1a] bg-[#2c2c2c] text-white shadow-lg"
                          : "h-10 w-10 bg-[#c6c4c1] text-[#3a3a3a]"
                      }`}>
                        {ICONS[tab]}
                      </span>
                      <span className={`text-[10px] ${active ? "font-bold text-[#1a1a1a]" : "font-medium text-[#888]"}`}>
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
          </div>
        </div>
          {/* ── Collapsed pill bar ───────────────────────────────────────── */}
          {activeTab === null && (
            <div className="mb-3 flex items-center justify-around rounded-full bg-black/32 px-6 py-3 shadow-xl backdrop-blur-xl animate-[slideUp_0.3s_ease-out_forwards]">
              {TABS.map((tab) => {
                // Show dot on material/warna tabs if model has that customization
                const hasThisSlot = (tab === "material" && hasPrimary) || (tab === "warna" && hasSecondary);
                return (
                  <button key={tab} onClick={() => toggleTab(tab)} className="relative flex flex-col items-center gap-1">
                    <span className="flex h-10 w-10 items-center justify-center rounded-full bg-white/22 text-white transition-all duration-200 hover:bg-white/40 active:scale-95">
                      {ICONS[tab]}
                    </span>
                    {/* Green dot indicator if customizable */}
                    {hasThisSlot && tab !== "object" && (
                      <span className="absolute -top-0.5 -right-0.5 h-2 w-2 rounded-full bg-emerald-400 ring-1 ring-black/20" />
                    )}
                    <span className="text-[9px] font-medium text-white/60 transition-colors">
                      {PILL_LABEL[tab]}
                    </span>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>

    </>
  );

  return (
    <div className="fixed inset-0 isolate overflow-hidden bg-[#11100f] font-dmsans text-[#f5f3ef]">
      <main data-tour="ar-canvas" className="relative h-[100dvh] overflow-hidden">
        <canvas ref={canvasRef} id="furniture-xr-canvas" className="absolute inset-0 z-0 block touch-none bg-[#171513]" />
      </main>
      {createPortal(arOverlay, document.body)}
    </div>
  );
}
