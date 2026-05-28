import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Link, useNavigate, useParams } from "react-router-dom";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { AlertCircle, ArrowLeft, RotateCcw } from "lucide-react";
import sofaModel  from "../assets/sofa.glb";
import tableModel from "../assets/table.glb";
import fabricColorUrl from "../assets/Fabric066_2K-JPG/Fabric066_2K-JPG_Color.jpg";
import fabricNormalUrl from "../assets/Fabric066_2K-JPG/Fabric066_2K-JPG_NormalGL.jpg";
import fabricRoughnessUrl from "../assets/Fabric066_2K-JPG/Fabric066_2K-JPG_Roughness.jpg";
import fabricAOUrl from "../assets/Fabric066_2K-JPG/Fabric066_2K-JPG_AmbientOcclusion.jpg";
import { getProductBySlug } from "../data/products";
import woodColorUrl    from "../assets/Wood060_2K-JPG/Wood060_2K-JPG_Color.jpg";
import woodNormalUrl   from "../assets/Wood060_2K-JPG/Wood060_2K-JPG_NormalGL.jpg";
import woodRoughUrl    from "../assets/Wood060_2K-JPG/Wood060_2K-JPG_Roughness.jpg";
import woodAOUrl       from "../assets/Wood060_2K-JPG/Wood060_2K-JPG_AmbientOcclusion.jpg";

// ─── Texture URL maps ──────────────────────────────────────────────────────────

const FABRIC_URLS = {
  color: fabricColorUrl,
  normal: fabricNormalUrl,
  roughness: fabricRoughnessUrl,
  ao: fabricAOUrl,
};

const WOOD_URLS = { color: woodColorUrl, normal: woodNormalUrl, roughness: woodRoughUrl, ao: woodAOUrl };

// ─── Material options ──────────────────────────────────────────────────────────

const FRAME_OPTIONS = [
  // type: "wood"  → pakai WOOD_URLS jika ada, fallback ke warna solid
  { id: "wood-light",  label: "Kayu Natural", type: "wood",  hex: 0x9C6B3C, roughness: 0.85, metalness: 0.0 },
  { id: "wood-dark",   label: "Kayu Gelap",   type: "wood",  hex: 0x3B1F0E, roughness: 0.80, metalness: 0.0 },
  // type: "metal" → PBR parameters sudah cukup, tidak perlu texture
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

const AR_MODELS = [
  { id: "sofa",  label: "Sofa", modelUrl: sofaModel,  initialScale: 1 },
  { id: "table", label: "Meja", modelUrl: tableModel, initialScale: 1 },
];

const STATUS_TEXT = {
  loading:     "Menyiapkan 8th Wall Engine dan scene AR.",
  permission:  "Izinkan akses kamera untuk mulai melihat furniture di ruangan.",
  scanning:    "Pilih material rangka & kain, arahkan kamera ke lantai, lalu tap untuk menempatkan sofa.",
  placed:      "Tap lagi untuk pindah, cubit untuk scale, putar dua jari untuk rotate.",
  failed:      "AR gagal dibuka. Detail error ditampilkan di bawah.",
  unsupported: "8th Wall belum tersedia. Pastikan engine sudah dimuat dari /external/xr.",
};

// ─── Mesh categorization ───────────────────────────────────────────────────────
// Setelah buka browser console saat sofa load, salin nama mesh yang muncul ke sini.
// Contoh: SOFA_FRAME_MESHES = ["Frame", "Legs_L", "Legs_R"]

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

  // Prioritas 1: exact match dari array yang dikonfigurasi
  if (SOFA_FRAME_MESHES.length || SOFA_CUSHION_MESHES.length) {
    if (SOFA_FRAME_MESHES.includes(node.name))   return "frame";
    if (SOFA_CUSHION_MESHES.includes(node.name)) return "cushion";
    return "unknown";
  }

  // Prioritas 2: keyword matching
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

// woodTextures = { color, normal, roughness, ao } | null
function makeWoodMaterial(opt, woodTextures) {
  if (!woodTextures) {
    // Fallback: warna solid tanpa texture
    return new THREE.MeshStandardMaterial({
      color: new THREE.Color(opt.hex),
      roughness: opt.roughness,
      metalness: 0.0,
    });
  }

  const mat = new THREE.MeshStandardMaterial({
    map:          woodTextures.color.clone(),
    normalMap:    woodTextures.normal.clone(),
    roughnessMap: woodTextures.roughness.clone(),
    aoMap:        woodTextures.ao?.clone() ?? null,
    color:        new THREE.Color(opt.hex),
    roughness:    1.0,
    metalness:    0.0,
  });

  if (mat.map)          { mat.map.colorSpace = THREE.SRGBColorSpace; applyTexSettings(mat.map, 2, 2); }
  if (mat.normalMap)    applyTexSettings(mat.normalMap, 2, 2);
  if (mat.roughnessMap) applyTexSettings(mat.roughnessMap, 2, 2);
  if (mat.aoMap)        applyTexSettings(mat.aoMap, 2, 2);

  return mat;
}

// fabricTextures = { color, normal, roughness, ao } | null
function makeFabricMaterial(opt, fabricTextures) {
  const color = new THREE.Color(opt.hex);

  if (!fabricTextures) {
    return new THREE.MeshStandardMaterial({ color, roughness: 0.9, metalness: 0.0 });
  }

  const mat = new THREE.MeshStandardMaterial({
    map:          fabricTextures.color.clone(),
    normalMap:    fabricTextures.normal.clone(),
    roughnessMap: fabricTextures.roughness.clone(),
    aoMap:        fabricTextures.ao.clone(),
    color,
    roughness:    1.0,
    metalness:    0.0,
  });

  if (mat.map)          { mat.map.colorSpace = THREE.SRGBColorSpace; applyTexSettings(mat.map); }
  if (mat.normalMap)    applyTexSettings(mat.normalMap);
  if (mat.roughnessMap) applyTexSettings(mat.roughnessMap);
  if (mat.aoMap)        applyTexSettings(mat.aoMap);

  return mat;
}

function makeFrameMaterial(frameId, woodTextures) {
  const opt = FRAME_OPTIONS.find((o) => o.id === frameId) ?? FRAME_OPTIONS[0];
  return opt.type === "metal"
    ? makeMetalMaterial(opt)
    : makeWoodMaterial(opt, woodTextures);
}

// Replace a mesh's material, disposing the old one
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
  canvas.style.setProperty("display",         "none",    "important");
  canvas.style.setProperty("visibility",      "hidden",  "important");
  canvas.style.setProperty("opacity",         "0",       "important");
  canvas.style.setProperty("pointer-events",  "none",    "important");
  const gl = canvas.getContext("webgl2") || canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
  gl?.getExtension("WEBGL_lose_context")?.loseContext();
  canvas.width = 1;
  canvas.height = 1;
}

function stop8thWall(canvas) {
  hideAndReleaseCanvas(canvas);
  stopMediaStreams();
  const once = () => {
    window.XR8?.pause?.();
    window.XR8?.stop?.();
    window.XR8?.clearCameraPipelineModules?.();
    stopMediaStreams();
    hideAndReleaseCanvas(canvas);
  };
  once();
  window.setTimeout(once, 80);
  window.setTimeout(once, 250);
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

function getTouchDistance(t) {
  return Math.hypot(t[0].clientX - t[1].clientX, t[0].clientY - t[1].clientY);
}
function getTouchAngle(t) {
  return Math.atan2(t[1].clientY - t[0].clientY, t[1].clientX - t[0].clientX);
}

// ─── Texture loader helper ─────────────────────────────────────────────────────

function loadTextureSet(loader, urls, onDone) {
  const result = {};
  let loaded = 0;
  const keys = Object.keys(urls);
  keys.forEach((key) => {
    result[key] = loader.load(urls[key], () => {
      loaded += 1;
      if (loaded === keys.length) onDone(result);
    });
  });
}

// ─── AR scene builder ──────────────────────────────────────────────────────────

function buildFurnitureScene({
  canvas, models,
  selectedModelRef, activeObjectRef,
  onStatusChange, onError,
  selectedFrameRef, selectedCushionRef,
  applyFrameRef, applyCushionRef,
}) {
  let camera, sceneRef, floorMarker;
  let activeObject        = null;
  let lastSingleTouch     = null;
  let gestureStart        = null;
  let suppressPlacementUntil = 0;

  const loadedModels  = new Map();
  const placedObjects = new Map();
  const raycaster     = new THREE.Raycaster();
  const pointer       = new THREE.Vector2();
  const floor         = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);
  const hitPoint      = new THREE.Vector3();

  let fabricTextures = null;
  let woodTextures   = null; // populated if WOOD_URLS is set

  // ── Per-part apply helpers ───────────────────────────────────────────────

  const applyFrameToSofa = (frameId) => {
    const placed = placedObjects.get("sofa");
    if (!placed) return;
    const mat = makeFrameMaterial(frameId, woodTextures);
    placed.root.traverse((node) => {
      if (!node.isMesh || getMeshPart(node) !== "frame") return;
      replaceMeshMaterial(node, mat.clone());
    });
    mat.dispose();
  };

  const applyCushionToSofa = (cushionId) => {
    const placed = placedObjects.get("sofa");
    if (!placed) return;
    const mat = makeFabricMaterial(
      CUSHION_OPTIONS.find((o) => o.id === cushionId) ?? CUSHION_OPTIONS[0],
      fabricTextures,
    );
    placed.root.traverse((node) => {
      if (!node.isMesh) return;
      const part = getMeshPart(node);
      if (part === "cushion" || part === "unknown") replaceMeshMaterial(node, mat.clone());
    });
    mat.dispose();
  };

  const applyBothMaterials = (frameId, cushionId) => {
    applyFrameToSofa(frameId);
    applyCushionToSofa(cushionId);

    // Dev warning if frame meshes weren't found
    const placed = placedObjects.get("sofa");
    if (placed) {
      let frameFound = false;
      placed.root.traverse((n) => { if (n.isMesh && getMeshPart(n) === "frame") frameFound = true; });
      if (!frameFound) {
        console.warn(
          "[ProductAR] Tidak ada mesh frame terdeteksi — isi SOFA_FRAME_MESHES di ProductAR.jsx.\n" +
          "Cek console log '[ProductAR] Mesh list' untuk nama mesh yang tersedia.",
        );
      }
    }
  };

  applyFrameRef.current   = applyFrameToSofa;
  applyCushionRef.current = applyCushionToSofa;

  // ── Scene object helpers ─────────────────────────────────────────────────

  const selectedConfig = () =>
    models.find((m) => m.id === selectedModelRef.current) ?? models[0];

  const setObjectOnFloor = (obj, clientX, clientY) => {
    if (!camera || !obj) return false;
    const rect = canvas.getBoundingClientRect();
    pointer.x = ((clientX - rect.left) / rect.width)  *  2 - 1;
    pointer.y = ((clientY - rect.top)  / rect.height)  * -2 + 1;
    raycaster.setFromCamera(pointer, camera);
    if (!raycaster.ray.intersectPlane(floor, hitPoint)) return false;
    obj.root.position.copy(hitPoint);
    obj.root.visible     = true;
    floorMarker.visible  = true;
    floorMarker.position.copy(hitPoint);
    onStatusChange("placed");
    return true;
  };

  const addSelectedObject = (clientX, clientY) => {
    const config = selectedConfig();
    const source = loadedModels.get(config.id);
    if (!sceneRef || !source) { onStatusChange("loading"); return false; }

    let obj = placedObjects.get(config.id);
    if (!obj) {
      const root = source.clone(true);
      obj = { id: config.id, root, scale: config.initialScale };
      root.visible = false;
      root.scale.setScalar(obj.scale);
      sceneRef.add(root);
      placedObjects.set(config.id, obj);
      if (config.id === "sofa") {
        applyBothMaterials(selectedFrameRef.current, selectedCushionRef.current);
      }
    }

    activeObject = obj;
    activeObjectRef.current = obj;
    return setObjectOnFloor(obj, clientX, clientY);
  };

  const syncActive = () => {
    const obj = placedObjects.get(selectedModelRef.current);
    if (obj) { activeObject = obj; activeObjectRef.current = obj; }
  };

  // ── Touch / pointer handlers ─────────────────────────────────────────────

  const placeModel = (e) => {
    if (Date.now() < suppressPlacementUntil) return;
    if (e.pointerType === "touch") return;
    addSelectedObject(e.clientX, e.clientY);
  };

  const handleTouchStart = (e) => {
    syncActive();
    if (e.touches.length === 1) {
      const [t] = e.touches;
      lastSingleTouch = { startX: t.clientX, startY: t.clientY, x: t.clientX, y: t.clientY, moved: false, startedAt: Date.now() };
      gestureStart = null;
    }
    if (e.touches.length === 2) {
      if (!activeObject?.root.visible) return;
      e.preventDefault();
      lastSingleTouch = null;
      suppressPlacementUntil = Date.now() + 350;
      gestureStart = {
        distance:  getTouchDistance(e.touches),
        angle:     getTouchAngle(e.touches),
        scale:     activeObject.scale,
        rotationY: activeObject.root.rotation.y,
      };
    }
  };

  const handleTouchMove = (e) => {
    syncActive();
    if (e.touches.length === 1 && lastSingleTouch && activeObject) {
      e.preventDefault();
      const [t] = e.touches;
      if (Math.hypot(t.clientX - lastSingleTouch.startX, t.clientY - lastSingleTouch.startY) > 8) {
        lastSingleTouch.moved = true;
        setObjectOnFloor(activeObject, t.clientX, t.clientY);
      }
      lastSingleTouch = { ...lastSingleTouch, x: t.clientX, y: t.clientY };
    }
    if (e.touches.length === 2 && gestureStart && activeObject) {
      e.preventDefault();
      suppressPlacementUntil = Date.now() + 350;
      const dist  = getTouchDistance(e.touches);
      const angle = getTouchAngle(e.touches);
      const next  = THREE.MathUtils.clamp(gestureStart.scale * (dist / gestureStart.distance), 0.35, 2.5);
      activeObject.scale = next;
      activeObject.root.scale.setScalar(next);
      activeObject.root.rotation.y = gestureStart.rotationY + (angle - gestureStart.angle);
    }
  };

  const handleTouchEnd = (e) => {
    if (e.touches.length === 0) {
      if (lastSingleTouch && !lastSingleTouch.moved && Date.now() - lastSingleTouch.startedAt < 450 && Date.now() >= suppressPlacementUntil) {
        addSelectedObject(lastSingleTouch.startX, lastSingleTouch.startY);
      }
      lastSingleTouch = null;
      gestureStart    = null;
      suppressPlacementUntil = Date.now() + 350;
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

  canvas.addEventListener("pointerup",    placeModel);
  canvas.addEventListener("touchstart",   handleTouchStart, { passive: false });
  canvas.addEventListener("touchmove",    handleTouchMove,  { passive: false });
  canvas.addEventListener("touchend",     handleTouchEnd);
  canvas.addEventListener("touchcancel",  handleTouchEnd);

  return {
    name: "furniture-scene",

    onStart: () => {
      const { scene, camera: xrCamera, renderer } = window.XR8.Threejs.xrScene();
      camera  = xrCamera;
      sceneRef = scene;

      if ("outputColorSpace" in renderer) renderer.outputColorSpace = THREE.SRGBColorSpace;

      scene.add(new THREE.HemisphereLight(0xffffff, 0x5d5d66, 1.3));
      const dLight = new THREE.DirectionalLight(0xffffff, 1.2);
      dLight.position.set(1, 4, 2);
      scene.add(dLight);

      floorMarker = new THREE.Mesh(
        new THREE.RingGeometry(0.42, 0.46, 48),
        new THREE.MeshBasicMaterial({ color: 0xf5f3ef, transparent: true, opacity: 0.75, side: THREE.DoubleSide }),
      );
      floorMarker.rotation.x = -Math.PI / 2;
      floorMarker.visible = false;
      scene.add(floorMarker);

      const texLoader = new THREE.TextureLoader();

      // Load fabric textures
      loadTextureSet(texLoader, FABRIC_URLS, (result) => {
        fabricTextures = result;
        const placed = placedObjects.get("sofa");
        if (placed) applyCushionToSofa(selectedCushionRef.current);
      });

      // Load wood textures (if WOOD_URLS is configured)
      if (WOOD_URLS) {
        loadTextureSet(texLoader, WOOD_URLS, (result) => {
          woodTextures = result;
          const placed = placedObjects.get("sofa");
          if (placed) applyFrameToSofa(selectedFrameRef.current);
        });
      }

      // Load sofa model
      const loader = new GLTFLoader();
      models.forEach((item) => {
        loader.load(
          item.modelUrl,
          (gltf) => {
            // Debug: cek nama mesh di browser console → lalu isi SOFA_FRAME_MESHES / SOFA_CUSHION_MESHES
            console.group(`[ProductAR] Mesh list — ${item.label}`);
            gltf.scene.traverse((node) => {
              if (node.isMesh) console.log(`  "${node.name}"  part→${getMeshPart(node)}  parent:"${node.parent?.name}"`);
            });
            console.groupEnd();

            gltf.scene.visible = false;
            loadedModels.set(item.id, gltf.scene);
            onStatusChange("scanning");
          },
          undefined,
          (err) => { onError(`${item.label} gagal dimuat: ${formatError(err)}`); onStatusChange("failed"); },
        );
      });
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

// ─── Component ─────────────────────────────────────────────────────────────────

export default function ProductAR() {
  const { slug }   = useParams();
  const navigate   = useNavigate();
  const product    = getProductBySlug(slug);
  const canvasRef  = useRef(null);

  const [arStatus,          setArStatus]          = useState("loading");
  const [errorDetail,       setErrorDetail]        = useState("");
  const [browserBottomOffset, setBrowserBottomOffset] = useState(0);
  const [inAppBrowser]    = useState(() => isInAppBrowser());
  const [isMobile]        = useState(() => isMobileBrowser());
  const [selectedModel,   setSelectedModel]   = useState(AR_MODELS[0].id);
  const [selectedFrame,   setSelectedFrame]   = useState(FRAME_OPTIONS[0].id);
  const [selectedCushion, setSelectedCushion] = useState(CUSHION_OPTIONS[0].id);

  const selectedModelRef  = useRef(AR_MODELS[0].id);
  const selectedFrameRef  = useRef(FRAME_OPTIONS[0].id);
  const selectedCushionRef = useRef(CUSHION_OPTIONS[0].id);
  const activeObjectRef   = useRef(null);
  const applyFrameRef     = useRef(null);
  const applyCushionRef   = useRef(null);

  useEffect(() => { selectedModelRef.current   = selectedModel;   }, [selectedModel]);
  useEffect(() => { selectedFrameRef.current   = selectedFrame;   }, [selectedFrame]);
  useEffect(() => { selectedCushionRef.current = selectedCushion; }, [selectedCushion]);

  useEffect(() => {
    if (!isMobile) return undefined;

    document.body.style.overflow            = "hidden";
    document.documentElement.style.overflow = "hidden";

    let cancelled = false, startTimer;
    const canvas = canvasRef.current;
    const obs = canvas ? new MutationObserver(() => keepCanvasBehindUi(canvas)) : null;
    if (canvas && obs) obs.observe(canvas, { attributes: true, attributeFilter: ["style", "class"] });

    const handleResize = () => {
      if (canvas) { resizeCanvasToViewport(canvas); keepCanvasBehindUi(canvas); }
      const vp = window.visualViewport;
      if (vp) {
        setBrowserBottomOffset(Math.ceil(Math.max(0, window.innerHeight - vp.height - vp.offsetTop)));
      } else {
        setBrowserBottomOffset(0);
      }
    };

    handleResize();
    window.addEventListener("resize",            handleResize);
    window.visualViewport?.addEventListener("resize", handleResize);
    window.addEventListener("orientationchange", handleResize);

    const start8thWall = async () => {
      const XR8 = window.XR8;
      if (!canvas) return;
      if (!XR8) {
        setErrorDetail("window.XR8 belum ada. Cek apakah /external/xr/xr.js berhasil dimuat.");
        setArStatus("unsupported");
        return;
      }
      try {
        window.THREE = THREE;
        setErrorDetail("");
        resizeCanvasToViewport(canvas);
        keepCanvasBehindUi(canvas);
        XR8.stop?.();
        XR8.clearCameraPipelineModules?.();
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
                setErrorDetail(
                  window.isSecureContext
                    ? "Browser menolak akses kamera. Cek permission kamera untuk situs ini."
                    : "Bukan secure context. Buka dari HTTPS ngrok, bukan localhost/IP biasa di mobile.",
                );
                setArStatus("failed");
              }
            },
            onException: (err) => {
              console.error("8th Wall exception", err);
              setErrorDetail(formatError(err));
              setArStatus("failed");
            },
          },
          buildFurnitureScene({
            canvas, models: AR_MODELS,
            selectedModelRef, activeObjectRef,
            onStatusChange: setArStatus, onError: setErrorDetail,
            selectedFrameRef, selectedCushionRef,
            applyFrameRef, applyCushionRef,
          }),
        ]);

        const mob = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
        XR8.run({
          canvas, allowFront: true,
          cameraConfig: { direction: mob ? XR8.XrConfig.camera().BACK : XR8.XrConfig.camera().FRONT },
          allowedDevices: XR8.XrConfig.device().ANY,
        });
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
        cancelled = true;
        window.clearTimeout(startTimer);
        window.removeEventListener("resize",            handleResize);
        window.visualViewport?.removeEventListener("resize", handleResize);
        window.removeEventListener("orientationchange", handleResize);
        window.removeEventListener("xrloaded",          onLoaded);
        obs?.disconnect();
        document.body.style.overflow = document.documentElement.style.overflow = "";
        stop8thWall(canvas);
      };
    }

    const onPageExit = () => stop8thWall(canvas);
    window.addEventListener("pagehide",  onPageExit);
    window.addEventListener("popstate",  onPageExit);

    return () => {
      cancelled = true;
      window.clearTimeout(startTimer);
      window.removeEventListener("resize",            handleResize);
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

  // ── Desktop fallback ─────────────────────────────────────────────────────

  if (!isMobile) {
    return (
      <div className="min-h-screen bg-[#11100f] font-dmsans text-[#f5f3ef]">
        <main className="mx-auto flex min-h-screen max-w-6xl flex-col px-4 py-6 sm:px-6">
          <Link
            to={product ? `/products/${product.slug}` : "/products"}
            onClick={exitAR}
            className="inline-flex w-fit items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-3 text-[11px] font-medium uppercase tracking-[0.16em] text-white transition-colors hover:bg-white hover:text-[#171513]"
          >
            <ArrowLeft size={16} />
            Product
          </Link>
          <section className="grid flex-1 items-center gap-8 py-10 lg:grid-cols-[minmax(0,1fr)_360px]">
            <div className="overflow-hidden rounded-[28px] border border-white/10 bg-white/5">
              <img src={product?.image} alt={product?.name ?? "Furniture preview"} className="h-[62vh] min-h-[420px] w-full object-cover" />
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-[0.24em] text-white/45">Mobile AR Required</p>
              <h1 className="mt-3 font-cormorant text-5xl leading-none text-white">{product?.name ?? "Furniture Preview"}</h1>
              <p className="mt-5 text-sm leading-relaxed text-white/68">
                8th Wall camera AR is intended for mobile Safari/Chrome. Open this route from your phone through the ngrok HTTPS URL to place the furniture in your room.
              </p>
            </div>
          </section>
        </main>
      </div>
    );
  }

  // ── AR overlay ───────────────────────────────────────────────────────────

  const arOverlay = (
    <>
      {/* Top bar */}
      <div className="pointer-events-none fixed inset-x-0 top-0 px-4 pt-[calc(env(safe-area-inset-top)+0.85rem)] sm:px-6" style={{ zIndex: 2147483647 }}>
        <div className="pointer-events-auto mx-auto flex max-w-6xl items-center justify-between gap-3">
          <div className="flex min-w-0 items-center gap-3 rounded-full border border-white/18 bg-black/35 p-1.5 pr-4 text-white shadow-[0_14px_35px_rgba(0,0,0,0.22)] backdrop-blur-md">
            <Link
              to={product ? `/products/${product.slug}` : "/products"}
              onClick={exitAR}
              className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-white/15 bg-white/10 text-white transition-colors hover:bg-white hover:text-[#171513]"
              aria-label="Back to product"
            >
              <ArrowLeft size={18} />
            </Link>
            <div className="min-w-0">
              <p className="text-[8px] font-medium uppercase tracking-[0.2em] text-white/55">8th Wall WebAR</p>
              <p className="max-w-[58vw] truncate text-sm font-medium text-white">{product?.name ?? "Furniture Preview"}</p>
            </div>
          </div>
          {inAppBrowser && (
            <div className="hidden rounded-full border border-amber-200/35 bg-amber-950/55 px-4 py-3 text-xs font-medium text-amber-50 shadow-[0_14px_35px_rgba(0,0,0,0.2)] backdrop-blur-md sm:block">
              Open in Safari/Chrome for correct AR layout
            </div>
          )}
        </div>
        {inAppBrowser && (
          <div className="pointer-events-auto mt-2 rounded-2xl border border-amber-200/35 bg-amber-950/60 px-4 py-3 text-xs leading-relaxed text-amber-50 shadow-[0_14px_35px_rgba(0,0,0,0.2)] backdrop-blur-md sm:hidden">
            Buka link ini di Safari/Chrome. WhatsApp browser sering menutup UI AR dan salah menghitung tinggi layar.
          </div>
        )}
      </div>

      {/* Bottom controls */}
      <div
        className="pointer-events-none fixed inset-x-0 bg-gradient-to-t from-black/70 via-black/25 to-transparent px-4 pb-[calc(env(safe-area-inset-bottom)+0.85rem)] pt-20 sm:px-6 sm:pt-24"
        style={{
          bottom: inAppBrowser ? `calc(${Math.max(browserBottomOffset, 72)}px + env(safe-area-inset-bottom))` : `${browserBottomOffset}px`,
          zIndex: 2147483647,
        }}
      >
        <div className="pointer-events-auto mx-auto flex max-w-6xl flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">

          {/* Material picker card */}
          <div className="overflow-hidden rounded-2xl border border-white/14 bg-black/38 text-white shadow-[0_18px_45px_rgba(0,0,0,0.22)] backdrop-blur-md">

            {/* Model switcher */}
            <div className="flex gap-1 border-b border-white/10 p-2">
              {AR_MODELS.map((m) => (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => {
                    setSelectedModel(m.id);
                    selectedModelRef.current = m.id;
                  }}
                  className={`flex-1 rounded-lg px-3 py-1.5 text-[9px] font-medium uppercase tracking-[0.16em] transition-all ${
                    selectedModel === m.id
                      ? "bg-white text-[#171513]"
                      : "text-white/55 hover:text-white"
                  }`}
                >
                  {m.label}
                </button>
              ))}
            </div>

            {/* Material rows — only for sofa */}
            {selectedModel === "sofa" && (
              <>
                {/* Rangka / Frame row */}
                <div className="flex items-center gap-3 px-4 py-3">
                  <span className="w-12 shrink-0 text-[9px] font-medium uppercase tracking-[0.18em] text-white/50">
                    Rangka
                  </span>
                  <div className="flex gap-2">
                    {FRAME_OPTIONS.map((opt) => {
                      const isSelected = selectedFrame === opt.id;
                      const hexStr = `#${opt.hex.toString(16).padStart(6, "0")}`;
                      return (
                        <button
                          key={opt.id}
                          type="button"
                          title={opt.label}
                          onClick={() => {
                            setSelectedFrame(opt.id);
                            selectedFrameRef.current = opt.id;
                            applyFrameRef.current?.(opt.id);
                          }}
                          className={`h-8 w-8 rounded-full transition-all ${
                            isSelected
                              ? "scale-110 ring-2 ring-white ring-offset-2 ring-offset-black/50"
                              : "ring-1 ring-white/25 hover:ring-white/55"
                          }`}
                          style={{
                            backgroundColor: hexStr,
                            boxShadow: opt.type === "metal"
                              ? "inset 0 2px 5px rgba(255,255,255,0.3), inset 0 -1px 3px rgba(0,0,0,0.5)"
                              : undefined,
                          }}
                        />
                      );
                    })}
                  </div>
                </div>

                <div className="mx-4 h-px bg-white/10" />

                {/* Kain / Cushion row */}
                <div className="flex items-center gap-3 px-4 py-3">
                  <span className="w-12 shrink-0 text-[9px] font-medium uppercase tracking-[0.18em] text-white/50">
                    Kain
                  </span>
                  <div className="flex gap-2">
                    {CUSHION_OPTIONS.map((opt) => {
                      const isSelected = selectedCushion === opt.id;
                      const hexStr = `#${opt.hex.toString(16).padStart(6, "0")}`;
                      return (
                        <button
                          key={opt.id}
                          type="button"
                          title={opt.label}
                          onClick={() => {
                            setSelectedCushion(opt.id);
                            selectedCushionRef.current = opt.id;
                            applyCushionRef.current?.(opt.id);
                          }}
                          className={`h-8 w-8 rounded-full transition-all ${
                            isSelected
                              ? "scale-110 ring-2 ring-white ring-offset-2 ring-offset-black/50"
                              : "ring-1 ring-white/25 hover:ring-white/55"
                          }`}
                          style={{ backgroundColor: hexStr }}
                        />
                      );
                    })}
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Status */}
          <div className="rounded-2xl border border-white/14 bg-black/38 px-4 py-3 text-white/86 shadow-[0_18px_45px_rgba(0,0,0,0.22)] backdrop-blur-md sm:max-w-[460px]">
            <div className="flex items-start gap-3">
              <AlertCircle className="mt-0.5 shrink-0" size={16} />
              <p className="text-sm leading-relaxed">{STATUS_TEXT[arStatus]}</p>
            </div>
            {errorDetail && (
              <p className="mt-2 break-words pl-7 text-xs leading-relaxed text-white/60">{errorDetail}</p>
            )}
          </div>

          {/* Hint */}
          <div className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-[#f5f3ef] px-6 py-3 text-[10px] font-medium uppercase tracking-[0.16em] text-[#171513] shadow-[0_18px_50px_rgba(0,0,0,0.35)]">
            <RotateCcw size={16} />
            Tap Floor To Add
          </div>
        </div>
      </div>
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
