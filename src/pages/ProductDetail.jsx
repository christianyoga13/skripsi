import { useEffect, useRef, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Box, ChevronRight, Heart, RotateCcw, Star } from "lucide-react";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";
import Header from "../components/Header";
import { getProductBySlug, products } from "../data/products";
import { useWishlist } from "../context/WishlistContext";
import {
  FABRIC_URLS,
  TABLECLOTH_URLS,
  WOOD_URLS,
  PLASTIC_URLS,
  WOOD47_URLS,
  MODEL_SLOTS,
  loadTextureSet,
  buildMaterialFromOption,
  applySlotToModel
} from "../lib/customizer";

// GLB model imports
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

const MODEL_MAP = {
  sofa:      couchModel,
  sofa2:     couch2Model,
  table:     tableModel,
  table1:    table1Model,
  coffeetbl: coffeeTableModel,
  bed:       bedModel,
  bed1:      bed1Model,
  desk:      studydeskModel,
  desk1:     studydesk1Model,
  cupboard:  cupboardModel,
  cupboard1: cupboard1Model,
  wardrobe:  wardrobeModel,
  wardrobe1: wardrobe1Model,
  dining1:   diningTableModel,
  dining2:   diningTable1Model,
  dining3:   diningTable2Model,
};

/* ─────────────────────────────────────────
   INLINE 3D VIEWER
   Shows the GLB with its original embedded materials — no overrides.
───────────────────────────────────────── */

function Model3DViewer({ modelId, activePrimaryId, activeSecondaryId, className = "" }) {
  const mountRef = useRef(null);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState(false);
  const [modelRoot, setModelRoot] = useState(null);
  const [allTextures, setAllTextures] = useState({ woodTextures: null, fabricTextures: null, tableclothTextures: null, plasticTextures: null, wood47Textures: null });
  const [texturesLoaded, setTexturesLoaded] = useState(false);

  // Load textures once on mount
  useEffect(() => {
    const texLoader = new THREE.TextureLoader();
    const textures = { woodTextures: null, fabricTextures: null, tableclothTextures: null, plasticTextures: null, wood47Textures: null };
    let loadedSets = 0;
    const checkAllLoaded = () => {
      loadedSets += 1;
      if (loadedSets === 5) {
        setAllTextures(textures);
        setTexturesLoaded(true);
      }
    };

    loadTextureSet(texLoader, FABRIC_URLS, (result) => {
      textures.fabricTextures = result;
      checkAllLoaded();
    });
    loadTextureSet(texLoader, WOOD_URLS, (result) => {
      textures.woodTextures = result;
      checkAllLoaded();
    });
    loadTextureSet(texLoader, TABLECLOTH_URLS, (result) => {
      textures.tableclothTextures = result;
      checkAllLoaded();
    });
    loadTextureSet(texLoader, PLASTIC_URLS, (result) => {
      textures.plasticTextures = result;
      checkAllLoaded();
    });
    loadTextureSet(texLoader, WOOD47_URLS, (result) => {
      textures.wood47Textures = result;
      checkAllLoaded();
    });
  }, []);

  // Apply customizations dynamically in real-time
  useEffect(() => {
    if (!modelRoot || !texturesLoaded) return;

    const slots = MODEL_SLOTS[modelId];
    if (!slots) return;

    if (slots.primarySlot && activePrimaryId) {
      const { options, matTarget, textureSet, defaultId } = slots.primarySlot;
      const isDefault = activePrimaryId === defaultId;
      const opt = options.find((o) => o.id === activePrimaryId) ?? options.find(o => o.id === defaultId) ?? options[0];
      const mat = buildMaterialFromOption(opt, textureSet, allTextures);
      applySlotToModel(modelRoot, matTarget, mat, isDefault);
      mat.dispose();
    }

    if (slots.secondarySlot && activeSecondaryId) {
      const { options, matTarget, textureSet, defaultId } = slots.secondarySlot;
      const isDefault = activeSecondaryId === defaultId;
      const opt = options.find((o) => o.id === activeSecondaryId) ?? options.find(o => o.id === defaultId) ?? options[0];
      const mat = buildMaterialFromOption(opt, textureSet, allTextures);
      applySlotToModel(modelRoot, matTarget, mat, isDefault);
      mat.dispose();
    }
  }, [modelId, activePrimaryId, activeSecondaryId, modelRoot, texturesLoaded, allTextures]);

  useEffect(() => {
    const container = mountRef.current;
    if (!container || !modelId) return;

    const modelUrl = MODEL_MAP[modelId];
    if (!modelUrl) { setError(true); setLoading(false); return; }

    // ── Renderer ──────────────────────────────────────────────────
    const w = container.clientWidth  || 800;
    const h = container.clientHeight || 600;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, logarithmicDepthBuffer: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(w, h);
    renderer.outputColorSpace    = THREE.SRGBColorSpace;
    renderer.toneMapping         = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.0;
    renderer.shadowMap.enabled   = true;
    renderer.shadowMap.type      = THREE.PCFSoftShadowMap;
    renderer.sortObjects         = true;   // ensure transparent meshes render after opaque
    container.appendChild(renderer.domElement);

    // ── Scene + RoomEnvironment ────────────────────────────────────
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xf0ede7);
    // RoomEnvironment: gives PBR materials proper IBL reflections
    // without this, roughness/metalness in GLB look flat
    const pmrem = new THREE.PMREMGenerator(renderer);
    pmrem.compileEquirectangularShader();
    const envTexture = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
    scene.environment = envTexture;
    pmrem.dispose();

    // ── Camera ─────────────────────────────────────────────────────
    const camera = new THREE.PerspectiveCamera(42, w / h, 0.01, 100);
    camera.position.set(0, 1.2, 3);

    // ── Lighting — identical to AR buildFurnitureScene ──────────────
    scene.add(new THREE.HemisphereLight(0xffffff, 0x5d5d66, 1.3));
    const dirLight = new THREE.DirectionalLight(0xffffff, 1.2);
    dirLight.position.set(1, 4, 2);
    dirLight.castShadow = true;
    dirLight.shadow.mapSize.set(1024, 1024);
    dirLight.shadow.camera.near   = 0.1;
    dirLight.shadow.camera.far    = 20;
    dirLight.shadow.camera.left   = dirLight.shadow.camera.bottom = -5;
    dirLight.shadow.camera.right  = dirLight.shadow.camera.top    =  5;
    scene.add(dirLight);
    const fillLight = new THREE.DirectionalLight(0xe8eeff, 0.35);
    fillLight.position.set(-3, 3, -3);
    scene.add(fillLight);

    // ── Ground shadow catcher ───────────────────────────────────
    const ground = new THREE.Mesh(
      new THREE.PlaneGeometry(30, 30),
      new THREE.ShadowMaterial({ opacity: 0.18 }),
    );
    ground.rotation.x = -Math.PI / 2;
    ground.receiveShadow = true;
    scene.add(ground);

    // ── OrbitControls ─────────────────────────────────────────
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping   = true;
    controls.dampingFactor   = 0.07;
    controls.minDistance     = 0.3;
    controls.maxDistance     = 14;
    controls.maxPolarAngle   = Math.PI / 1.85;
    controls.autoRotate      = true;
    controls.autoRotateSpeed = 1.0;
    controls.enablePan       = false;

    // ── Load GLB — use embedded materials, do NOT override anything ───
    const loader = new GLTFLoader();
    let animId;

    loader.load(
      modelUrl,
      (gltf) => {
        const model = gltf.scene;

        // Enable shadows + fix material issues from GLB
        model.traverse((node) => {
          if (!node.isMesh) return;
          node.castShadow    = true;
          node.receiveShadow = true;

          const fixMaterial = (mat, index) => {
            if (!mat) return mat;

            // ── Known broken material: GWC_Cupboard_05 ─────────────────────
            // This material has alphaMode=BLEND with a grayscale roughness PNG
            // as baseColorTexture → renders as TV static noise in Three.js.
            // Fix: keep texture, just disable the broken BLEND alpha mode.
            if (mat.name === "GWC_Cupboard_05") {
              mat.transparent = false;
              mat.alphaTest   = 0;
              mat.depthWrite  = true;
              mat.side        = THREE.FrontSide;
              mat.needsUpdate = true;
              return mat;
            }

            // ── Glass materials: replace with MeshPhysicalMaterial ──────────
            // MeshPhysicalMaterial with transmission=1 renders real physically-
            // based glass (refraction + transmission), just like Blender's
            // glass BSDF shader.
            const nameLC = (mat.name || "").toLowerCase();
            const isNamedGlass =
              nameLC.includes("glass") ||
              nameLC.includes("kaca") ||
              nameLC.includes("crystal") ||
              nameLC.includes("window");

            const isAlphaTransparent =
              (mat.transparent && mat.opacity < 0.99) ||
              (mat.alphaTest && mat.alphaTest > 0);

            if (isNamedGlass || isAlphaTransparent) {
              const glassMat = new THREE.MeshPhysicalMaterial({
                transmission:      1.0,        // fully transmissive — real glass
                roughness:         0.04,        // very smooth glass surface
                ior:               1.5,         // standard glass index of refraction
                thickness:         0.12,        // thin glass panel (affects depth)
                transparent:       true,
                opacity:           1.0,
                color:             0xffffff,    // clear glass
                side:              THREE.DoubleSide,
                depthWrite:        false,
                envMapIntensity:   1.5,         // strong environment reflections
              });
              // Dispose old material to avoid memory leak
              mat.dispose();
              return glassMat;
            }

            return mat;
          };

          if (Array.isArray(node.material)) {
            node.material = node.material.map(fixMaterial);
          } else {
            const fixed = fixMaterial(node.material, 0);
            if (fixed !== node.material) node.material = fixed;
          }
        });

        // Auto-fit: normalize largest dim to 1 world unit
        const box    = new THREE.Box3().setFromObject(model);
        const size   = box.getSize(new THREE.Vector3());
        const center = box.getCenter(new THREE.Vector3());
        const maxDim = Math.max(size.x, size.y, size.z);
        const sc     = 1.0 / maxDim;

        model.scale.setScalar(sc);
        model.position.set(-center.x * sc, -box.min.y * sc, -center.z * sc);

        // Camera: pull back to show full model in view
        const ss      = size.clone().multiplyScalar(sc);
        const fovRad  = camera.fov * (Math.PI / 180);
        const aspect  = w / h;
        const hFovRad = 2 * Math.atan(Math.tan(fovRad / 2) * aspect);
        const effFov  = Math.min(fovRad, hFovRad);
        const fitDist = Math.max(ss.x, ss.y, ss.z) / (2 * Math.tan(effFov / 2));
        const camDist = fitDist * 2.5;
        camera.position.set(camDist * 0.5, ss.y * 0.5, camDist);
        controls.target.set(0, ss.y * 0.28, 0);
        controls.update();

        scene.add(model);
        setModelRoot(model);
        setLoading(false);

        const animate = () => {
          animId = requestAnimationFrame(animate);
          controls.update();
          renderer.render(scene, camera);
        };
        animate();
      },
      undefined,
      () => { setError(true); setLoading(false); },
    );

    // ── Resize observer ───────────────────────────────────────
    const ro = new ResizeObserver(() => {
      const nw = container.clientWidth;
      const nh = container.clientHeight;
      if (!nw || !nh) return;
      camera.aspect = nw / nh;
      camera.updateProjectionMatrix();
      renderer.setSize(nw, nh);
    });
    ro.observe(container);

    return () => {
      cancelAnimationFrame(animId);
      ro.disconnect();
      controls.dispose();
      envTexture.dispose();
      renderer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [modelId]);

  return (
    <div className={`relative h-full w-full ${className}`}>
      <div ref={mountRef} className="h-full w-full" />

      {/* Loading overlay */}
      {loading && !error && (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-[#f0ede7]">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#1a1a1a]/20 border-t-[#1a1a1a]" />
          <p className="text-[10px] uppercase tracking-[0.24em] text-[#9a9389]">Loading 3D…</p>
        </div>
      )}

      {/* Error state */}
      {error && (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-[#f0ede7]">
          <p className="text-[11px] uppercase tracking-[0.2em] text-[#9a9389]">3D not available</p>
        </div>
      )}

      {/* Controls hint */}
      {!loading && !error && (
        <div className="pointer-events-none absolute bottom-4 left-1/2 -translate-x-1/2">
          <span className="rounded-full bg-black/30 px-3 py-1.5 text-[10px] text-white/80 backdrop-blur-sm">
            Drag to rotate · Scroll to zoom
          </span>
        </div>
      )}
    </div>
  );
}

/* ─────────────────────────────────────────
   SHARED HELPERS
───────────────────────────────────────── */

function StarRating({ rating = 4.5, count = 128 }) {
  return (
    <div className="flex items-center gap-2">
      <div className="flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map((i) => (
          <Star
            key={i}
            size={13}
            strokeWidth={1.5}
            className={
              i <= Math.floor(rating)
                ? "fill-[#c8a96e] text-[#c8a96e]"
                : i - 0.5 <= rating
                  ? "fill-[#c8a96e]/50 text-[#c8a96e]"
                  : "fill-transparent text-[#d0c9be]"
            }
          />
        ))}
      </div>
      <span className="text-[11px] text-[#9a9389]">
        {rating} ({count} reviews)
      </span>
    </div>
  );
}

function SwatchBtn({ color, active, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={`Color ${color}`}
      className={`h-8 w-8 rounded-full border-2 transition-all duration-200 ${
        active
          ? "border-[#1a1a1a] scale-110 shadow-sm"
          : "border-transparent hover:border-[#aaa]"
      }`}
      style={{ backgroundColor: color }}
    />
  );
}



function RelatedCard({ product }) {
  const navigate = useNavigate();
  return (
    <button
      type="button"
      onClick={() => navigate(`/products/${product.slug}`)}
      className="group w-full text-left"
    >
      <div
        className="relative mb-3 overflow-hidden rounded-[18px] bg-[#ede9e3]"
        style={{ aspectRatio: "1 / 0.95" }}
      >
        <img
          src={product.image}
          alt={product.name}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <span className="absolute left-3 top-3 rounded-full bg-white/90 px-2.5 py-0.5 text-[9px] font-medium uppercase tracking-[0.14em] text-[#1a1a1a] backdrop-blur-sm">
          {product.badge}
        </span>
      </div>
      <p className="font-cormorant text-[20px] leading-tight text-[#1a1a1a] lg:text-[22px]">
        {product.name}
      </p>
      <p className="mt-0.5 text-[11px] uppercase tracking-[0.12em] text-[#9a9389]">
        {product.category}
      </p>
      <p className="mt-1 text-[11px] uppercase tracking-[0.12em] text-[#9a9389]">
        {product.material}
      </p>
    </button>
  );
}

/* ─────────────────────────────────────────
   PRODUCT INFO PANEL
   (shared between mobile & desktop right column)
───────────────────────────────────────── */
function ProductInfoPanel({
  product,
  activePrimaryId,
  setActivePrimaryId,
  activeSecondaryId,
  setActiveSecondaryId
}) {
  const { toggleWishlist, isInWishlist } = useWishlist();
  const wishlisted = isInWishlist(product.id);
  const slots = MODEL_SLOTS[product.modelId];
  const navigate = useNavigate();

  return (
    <div>
      {/* Series */}
      <p className="mb-1.5 text-[10px] uppercase tracking-[0.3em] text-[#9a9389]">
        {product.series}
      </p>

      {/* Name */}
      <h1 className="font-cormorant text-[38px] leading-none text-[#1a1a1a] sm:text-[48px] lg:text-[52px]">
        {product.name}
      </h1>

      {/* Rating */}
      <div className="mt-2.5">
        <StarRating rating={4.5} count={128} />
      </div>

      <div className="my-5 h-px bg-[#e4ddd2]" />

      {/* Frame finish (Primary Slot) */}
      {slots?.primarySlot && (
        <div className="mb-4">
          <div className="mb-2.5 flex items-center justify-between">
            <p className="text-[10px] uppercase tracking-[0.2em] text-[#9a9389]">{slots.primarySlot.label}</p>
            <p className="text-[10px] uppercase tracking-[0.14em] text-[#b2aa9f]">
              {slots.primarySlot.options.find((o) => o.id === (activePrimaryId || slots.primarySlot.defaultId))?.label || ""}
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            {slots.primarySlot.options.map((opt) => {
              const hex = `#${opt.hex.toString(16).padStart(6, "0")}`;
              const isActive = activePrimaryId
                ? activePrimaryId === opt.id
                : opt.id === slots.primarySlot.defaultId;
              return (
                <SwatchBtn
                  key={opt.id}
                  color={hex}
                  active={isActive}
                  onClick={() => setActivePrimaryId(opt.id)}
                />
              );
            })}
          </div>
        </div>
      )}

      {/* Upholstery (Secondary Slot) */}
      {slots?.secondarySlot && (
        <div className="mb-5">
          <div className="mb-2.5 flex items-center justify-between">
            <p className="text-[10px] uppercase tracking-[0.2em] text-[#9a9389]">{slots.secondarySlot.label}</p>
            <p className="text-[10px] uppercase tracking-[0.14em] text-[#b2aa9f]">
              {slots.secondarySlot.options.find((o) => o.id === (activeSecondaryId || slots.secondarySlot.defaultId))?.label || ""}
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            {slots.secondarySlot.options.map((opt) => {
              const hex = `#${opt.hex.toString(16).padStart(6, "0")}`;
              const isActive = activeSecondaryId
                ? activeSecondaryId === opt.id
                : opt.id === slots.secondarySlot.defaultId;
              return (
                <SwatchBtn
                  key={opt.id}
                  color={hex}
                  active={isActive}
                  onClick={() => setActiveSecondaryId(opt.id)}
                />
              );
            })}
          </div>
        </div>
      )}



      {/* CTAs */}
      <div className="flex flex-col gap-3">
        <button
          type="button"
          onClick={() => navigate(`/products/${product.slug}/ar?primary=${activePrimaryId || ""}&secondary=${activeSecondaryId || ""}`)}
          data-tour="detail-ar-btn"
          className="flex w-full items-center justify-center gap-2 rounded-full bg-[#1a1a1a] px-6 py-4 text-[11px] font-medium uppercase tracking-[0.22em] text-[#f5f3ef] transition-colors hover:bg-[#333]"
        >
          <Box size={15} />
          Enter AR Mode
        </button>
        <button
          type="button"
          onClick={() => toggleWishlist(product.id)}
          data-tour="detail-wishlist-btn"
          className={`flex w-full items-center justify-center rounded-full border border-[#1a1a1a] px-6 py-4 text-[11px] font-medium uppercase tracking-[0.22em] transition-colors ${
            wishlisted
              ? "bg-[#1a1a1a] text-[#f5f3ef] hover:bg-transparent hover:text-[#1a1a1a]"
              : "bg-transparent text-[#1a1a1a] hover:bg-[#1a1a1a] hover:text-[#f5f3ef]"
          }`}
        >
          {wishlisted ? "Remove from Wishlist" : "Add to Wishlist"}
        </button>
      </div>

      {/* Specs */}
      <div data-tour="detail-specs" className="mt-6 grid grid-cols-3 gap-3 rounded-[16px] border border-[#e4ddd2] bg-white p-4">
        <div className="text-center">
          <p className="text-[9px] uppercase tracking-[0.16em] text-[#9a9389]">Dimensions</p>
          <p className="mt-1 text-[11px] font-medium text-[#1a1a1a]">
            {product.dimensions.split("x")[0].trim()}
          </p>
        </div>
        <div className="border-x border-[#f0ece5] text-center">
          <p className="text-[9px] uppercase tracking-[0.16em] text-[#9a9389]">Weight</p>
          <p className="mt-1 text-[11px] font-medium text-[#1a1a1a]">{product.weight}</p>
        </div>
        <div className="text-center">
          <p className="text-[9px] uppercase tracking-[0.16em] text-[#9a9389]">Lead Time</p>
          <p className="mt-1 text-[11px] font-medium text-[#1a1a1a]">{product.leadTime}</p>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────
   MAIN COMPONENT
───────────────────────────────────────── */
export default function ProductDetail() {
  const { slug } = useParams();
  const product = getProductBySlug(slug);

  const [activeThumb, setActiveThumb] = useState(0);
  const [activePrimaryId, setActivePrimaryId] = useState(null);
  const [activeSecondaryId, setActiveSecondaryId] = useState(null);

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }, [slug]);

  useEffect(() => {
    if (product) {
      const params = new URLSearchParams(window.location.search);
      const prim = params.get("primary");
      const sec = params.get("secondary");
      setActivePrimaryId(prim || null);
      setActiveSecondaryId(sec || null);
    }
  }, [product]);

  const { toggleWishlist, isInWishlist } = useWishlist();
  const wishlisted = product ? isInWishlist(product.id) : false;

  const related = products
    .filter((p) => p.slug !== slug && p.category === product?.category)
    .slice(0, 2)
    .concat(
      products
        .filter((p) => p.slug !== slug && p.category !== product?.category)
        .slice(0, 4)
    )
    .slice(0, 4);

  // thumbnails: product.images are used when available, otherwise fall back to legacy photo thumbnails
  const VIEWER_SLOT = "__3d__";
  const thumbnails = product
    ? [
        ...(product.images?.length ? product.images : [product.image, product.image, product.image]),
        VIEWER_SLOT,
      ]
    : [];

  /* ── not found ── */
  if (!product) {
    return (
      <div className="min-h-screen bg-[#f5f3ef] font-dmsans text-[#1a1a1a]">
        <Header />
        <div className="mx-auto max-w-5xl px-4 pb-12 pt-32 text-center sm:px-6 lg:px-8">
          <p className="text-[11px] uppercase tracking-[0.3em] text-[#9a9389]">
            Product Not Found
          </p>
          <h1 className="mt-4 font-cormorant text-5xl text-[#1a1a1a]">
            This piece is not available.
          </h1>
          <Link
            to="/products"
            className="mt-8 inline-flex items-center gap-2 rounded-full border border-[#d9d1c6] px-5 py-3 text-sm text-[#1a1a1a] transition-colors hover:bg-[#1a1a1a] hover:text-[#f5f3ef]"
          >
            <ArrowLeft size={16} />
            Back to collection
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f5f3ef] font-dmsans text-[#1a1a1a]">
      <Header />

      {/* ════════════════════════════════════════════════════════
          HERO + PRODUCT INFO
          Mobile  → stacked (image full-width → info below)
          Desktop → 2-column (image left | sticky info right)
      ════════════════════════════════════════════════════════ */}
      <div className="pt-16 sm:pt-20 lg:mx-auto lg:max-w-7xl lg:px-8">

        {/* Breadcrumb — desktop only (mobile breadcrumb is overlaid on image) */}
        <div className="hidden lg:flex lg:items-center lg:gap-2 lg:py-5 lg:text-[10px] lg:uppercase lg:tracking-[0.22em] lg:text-[#8d877d]">
          <Link
            to="/products"
            className="inline-flex items-center gap-1.5 transition-colors hover:text-[#1a1a1a]"
          >
            <ArrowLeft size={12} />
            Living Collection
          </Link>
          <ChevronRight size={10} />
          <span>{product.category}</span>
          <ChevronRight size={10} />
          <span className="text-[#1a1a1a]">{product.name}</span>
        </div>

        {/* Main content row */}
        <div className="lg:grid lg:grid-cols-[1fr_400px] lg:gap-10 lg:pb-16 xl:grid-cols-[1fr_440px]">

          {/* ── LEFT COLUMN: image gallery ── */}
          <div>
            {/* Main display — photo OR 3D viewer */}
            <div
              data-tour="detail-viewer"
              className="relative overflow-hidden bg-[#ede9e3] lg:rounded-[24px]"
              style={{ aspectRatio: "4 / 3" }}
            >
              {activeThumb === thumbnails.indexOf(VIEWER_SLOT) ? (
                /* ── 3D Interactive Viewer ── */
                <>
                  <Model3DViewer
                    modelId={product.modelId}
                    activePrimaryId={activePrimaryId}
                    activeSecondaryId={activeSecondaryId}
                  />
                  {/* 3D badge */}
                  <span className="absolute left-4 top-4 rounded-full bg-[#1a1a1a]/80 px-3 py-1 text-[10px] font-medium uppercase tracking-[0.18em] text-white backdrop-blur-sm">
                    3D View
                  </span>
                  {/* Reset rotation hint */}
                  <button
                    type="button"
                    onClick={() => {
                      // Re-mount viewer by briefly switching away then back
                      const prev = activeThumb;
                      setActiveThumb(0);
                      setTimeout(() => setActiveThumb(prev), 50);
                    }}
                    className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-white/90 text-[#1a1a1a] shadow-md backdrop-blur-sm transition-transform hover:scale-110"
                    aria-label="Reset 3D view"
                  >
                    <RotateCcw size={15} strokeWidth={1.8} />
                  </button>
                </>
              ) : (
                /* ── Regular photo ── */
                <>
                  <img
                    src={thumbnails[activeThumb]}
                    alt={product.name}
                    className="h-full w-full object-cover"
                  />

                  {/* Mobile breadcrumb overlay */}
                  <div className="absolute left-4 top-4 flex items-center gap-2 text-[10px] uppercase tracking-[0.22em] text-white/80 lg:hidden">
                    <Link
                      to="/products"
                      className="inline-flex items-center gap-1 hover:text-white"
                    >
                      <ArrowLeft size={12} />
                      Collection
                    </Link>
                    <ChevronRight size={10} />
                    <span>{product.category}</span>
                  </div>

                  {/* Wishlist */}
                  <button
                    type="button"
                    onClick={() => toggleWishlist(product.id)}
                    className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-white/90 text-[#1a1a1a] shadow-md backdrop-blur-sm transition-transform hover:scale-110"
                    aria-label="Toggle wishlist"
                  >
                    <Heart
                      size={16}
                      strokeWidth={1.8}
                      className={wishlisted ? "fill-current text-rose-500" : ""}
                    />
                  </button>

                  {/* Badge */}
                  <span className="absolute bottom-4 left-4 rounded-full bg-white/90 px-3 py-1 text-[10px] font-medium uppercase tracking-[0.18em] text-[#1a1a1a] backdrop-blur-sm">
                    {product.badge}
                  </span>
                </>
              )}
            </div>

            {/* Thumbnail strip */}
            <div data-tour="detail-thumbnails" className="flex gap-2.5 bg-[#f5f3ef] px-4 py-3 sm:px-6 lg:px-0 lg:pt-3">
              {thumbnails.map((src, i) => {
                const is3D = src === VIEWER_SLOT;
                const isActive = activeThumb === i;
                return (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setActiveThumb(i)}
                    className={`relative h-16 flex-1 overflow-hidden rounded-[10px] border-2 transition-all duration-200 lg:h-20 lg:rounded-[14px] ${
                      isActive
                        ? "border-[#1a1a1a]"
                        : "border-transparent opacity-55 hover:opacity-85"
                    }`}
                    aria-label={is3D ? "3D view" : `Thumbnail ${i + 1}`}
                  >
                    {is3D ? (
                      /* 3D thumbnail slot */
                      <div className="flex h-full w-full flex-col items-center justify-center gap-1 bg-[#1a1a1a]">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M12 2L2 7l10 5 10-5-10-5z" />
                          <path d="M2 17l10 5 10-5" />
                          <path d="M2 12l10 5 10-5" />
                        </svg>
                        <span className="text-[8px] font-medium uppercase tracking-[0.14em] text-white/80">3D</span>
                      </div>
                    ) : (
                      <img src={src} alt="" className="h-full w-full object-cover" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* ── RIGHT COLUMN: product info ──
               Mobile: rendered below image (not sticky)
               Desktop: sticky alongside image gallery */}
          <div className="bg-[#f5f3ef] px-4 py-6 sm:px-6 lg:sticky lg:top-24 lg:self-start lg:rounded-[24px] lg:border lg:border-[#e4ddd2] lg:bg-white lg:px-7 lg:py-8 lg:shadow-[0_20px_50px_rgba(26,26,26,0.06)]">
            <ProductInfoPanel
              product={product}
              activePrimaryId={activePrimaryId}
              setActivePrimaryId={setActivePrimaryId}
              activeSecondaryId={activeSecondaryId}
              setActiveSecondaryId={setActiveSecondaryId}
            />
          </div>
        </div>
      </div>

      {/* ════════════════════════════════════════════════════════
          SECTION: DESCRIPTION
          Mobile  → stacked, full-width white bg
          Desktop → constrained max-width, 2-column text + image
      ════════════════════════════════════════════════════════ */}
      <section className="bg-white px-4 py-10 sm:px-6 lg:py-16">
        <div className="lg:mx-auto lg:max-w-7xl lg:px-8">
          {/* Heading — centered mobile, left-aligned desktop */}
          <div className="mb-8 lg:mb-10">
            <p className="mb-2 text-center text-[10px] uppercase tracking-[0.3em] text-[#9a9389] lg:text-left">
              About this piece
            </p>
            <h2 className="text-center font-cormorant text-[32px] text-[#1a1a1a] lg:text-left lg:text-[42px]">
              Description
            </h2>
          </div>

          {/* Mobile: stacked. Desktop: 2-column */}
          <div className="lg:grid lg:grid-cols-2 lg:gap-12 lg:items-start">
            {/* Text column */}
            <div>
              <div className="mb-5 rounded-[18px] bg-[#f5f2ec] p-5 lg:rounded-[20px] lg:p-6">
                <p className="text-[13px] leading-relaxed text-[#736c63] lg:text-[14px]">
                  {product.summary}
                </p>
              </div>
              <p className="mb-4 text-[13px] leading-relaxed text-[#736c63] lg:text-[14px]">
                Crafted from responsibly sourced materials, every piece in the{" "}
                <strong className="font-medium text-[#1a1a1a]">{product.series}</strong> reflects
                our commitment to slow design — furniture built for decades, not seasons. Each joint
                is hand-fitted, each surface hand-finished.
              </p>
              <p className="text-[13px] leading-relaxed text-[#736c63] lg:text-[14px]">
                The <span className="font-medium text-[#1a1a1a]">{product.name}</span> ships fully
                assembled with white-glove delivery included. Our team will place, level, and
                inspect each piece before leaving your home.
              </p>
            </div>

            {/* Image column */}
            <div
              className="mt-6 overflow-hidden rounded-[18px] bg-[#ede9e3] lg:mt-0 lg:rounded-[20px]"
              style={{ aspectRatio: "4 / 3" }}
            >
              <img
                src={product.image}
                alt={`${product.name} detail`}
                className="h-full w-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════
          SECTION: SIZE & WALL CHART
          Mobile  → stacked
          Desktop → 2-column (specs left | image right)
      ════════════════════════════════════════════════════════ */}
      <section className="bg-[#f5f3ef] px-4 py-10 sm:px-6 lg:py-16">
        <div className="lg:mx-auto lg:max-w-7xl lg:px-8">
          <div className="lg:grid lg:grid-cols-2 lg:gap-12 lg:items-start">
            {/* Left: text + specs table */}
            <div>
              <p className="mb-1.5 text-[10px] uppercase tracking-[0.28em] text-[#9a9389]">
                Dimensions Guide
              </p>
              <h2 className="mb-4 font-cormorant text-[28px] leading-tight text-[#1a1a1a] lg:text-[36px]">
                Size &amp; Wall Chart
              </h2>
              <p className="mb-6 text-[13px] leading-relaxed text-[#736c63] lg:text-[14px]">
                Use our wall chart to visualise how the{" "}
                <span className="font-medium text-[#1a1a1a]">{product.name}</span> fits within your
                room. All measurements are in centimetres.
              </p>

              {/* Specs card */}
              <div className="space-y-0 rounded-[16px] border border-[#e4ddd2] bg-white overflow-hidden lg:rounded-[20px]">
                {product.dimensions.split(" x ").map((dim, i) => {
                  const labels = ["Width", "Depth", "Height"];
                  return (
                    <div
                      key={i}
                      className={`flex items-center justify-between px-5 py-4 ${
                        i > 0 ? "border-t border-[#f0ece5]" : ""
                      }`}
                    >
                      <span className="text-[10px] uppercase tracking-[0.18em] text-[#9a9389]">
                        {labels[i] ?? `Dimension ${i + 1}`}
                      </span>
                      <span className="text-[13px] font-medium text-[#1a1a1a]">{dim.trim()}</span>
                    </div>
                  );
                })}
                <div className="flex items-center justify-between border-t border-[#f0ece5] px-5 py-4">
                  <span className="text-[10px] uppercase tracking-[0.18em] text-[#9a9389]">Weight</span>
                  <span className="text-[13px] font-medium text-[#1a1a1a]">{product.weight}</span>
                </div>
                <div className="flex items-center justify-between border-t border-[#f0ece5] px-5 py-4">
                  <span className="text-[10px] uppercase tracking-[0.18em] text-[#9a9389]">Lead Time</span>
                  <span className="text-[13px] font-medium text-[#1a1a1a]">{product.leadTime}</span>
                </div>
              </div>
            </div>

            {/* Right: chart image */}
            <div
              className="relative mt-6 overflow-hidden rounded-[18px] bg-[#ede9e3] lg:mt-0 lg:rounded-[20px]"
              style={{ aspectRatio: "4 / 3" }}
            >
              <img
                src={product.image}
                alt={`${product.name} size chart`}
                className="h-full w-full object-cover opacity-80"
              />
              <div className="absolute bottom-4 right-4">
                <span className="rounded-lg bg-white/85 px-3 py-1.5 text-[11px] font-medium text-[#1a1a1a] backdrop-blur-sm shadow-sm">
                  {product.dimensions}
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════
          SECTION: TRY IT IN YOUR SPACE (dark)
          Mobile  → stacked, full-width
          Desktop → wide split layout (text left | image right)
      ════════════════════════════════════════════════════════ */}
      <section className="relative overflow-hidden bg-[#1f1e1c]">
        {/* Background texture */}
        <div className="absolute inset-0">
          <img
            src={product.image}
            alt=""
            className="h-full w-full object-cover opacity-15"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-[#1f1e1c]/90 via-[#1f1e1c]/70 to-[#1f1e1c]/95" />
        </div>

        <div className="relative px-4 py-14 sm:px-6 lg:mx-auto lg:max-w-7xl lg:px-8 lg:py-20">
          {/* Mobile: stacked. Desktop: 2-col */}
          <div className="lg:grid lg:grid-cols-[1fr_1fr] lg:gap-16 lg:items-center">
            {/* Text content */}
            <div>
              <p className="mb-2.5 text-[10px] uppercase tracking-[0.3em] text-[#9a9389]">
                Augmented Reality
              </p>
              <h2 className="mb-4 font-cormorant text-[32px] leading-tight text-white sm:text-[38px] lg:text-[48px]">
                Try It In Your Space
              </h2>
              <p className="mb-8 text-[13px] leading-relaxed text-[#b0a89e] lg:text-[15px] lg:max-w-md">
                Scan the {product.name} in AR and see how scale, proportion, and tone feel
                in your room before you order. Works on any modern smartphone — no app
                required.
              </p>

              {/* CTA */}
              <Link
                to={`/products/${product.slug}/ar`}
                className="mb-5 inline-flex w-full items-center justify-center gap-2 rounded-full bg-white px-8 py-4 text-[11px] font-medium uppercase tracking-[0.22em] text-[#1a1a1a] transition-colors hover:bg-[#f0ece5] lg:w-auto"
              >
                <Box size={15} />
                Launch AR Preview
              </Link>

              {/* Email notify */}
              <div className="flex overflow-hidden rounded-full border border-white/20 lg:max-w-sm">
                <input
                  type="email"
                  placeholder="Enter your email for updates"
                  className="flex-1 bg-transparent px-5 py-3 text-[12px] text-white placeholder-white/40 outline-none"
                />
                <button
                  type="button"
                  className="shrink-0 rounded-full bg-white/15 px-5 py-3 text-[11px] font-medium uppercase tracking-[0.16em] text-white transition-colors hover:bg-white/25"
                >
                  Notify
                </button>
              </div>
            </div>

            {/* Desktop: large product image on the right */}
            <div
              className="hidden overflow-hidden rounded-[24px] bg-[#2a2926] lg:block"
              style={{ aspectRatio: "4 / 3" }}
            >
              <img
                src={product.image}
                alt={`${product.name} in space`}
                className="h-full w-full object-cover opacity-90"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════
          SECTION: YOU MIGHT ALSO LIKE
          Mobile  → 2-col grid
          Desktop → 4-col grid, wider heading
      ════════════════════════════════════════════════════════ */}
      <section className="bg-[#f5f3ef] px-4 py-10 sm:px-6 lg:py-16">
        <div className="lg:mx-auto lg:max-w-7xl lg:px-8">
          <div className="mb-8 flex items-end justify-between">
            <div>
              <p className="mb-1.5 text-[10px] uppercase tracking-[0.28em] text-[#9a9389]">
                Discover More
              </p>
              <h2 className="font-cormorant text-[28px] leading-tight text-[#1a1a1a] lg:text-[38px]">
                You Might Also Like
              </h2>
            </div>
            <Link
              to="/products"
              className="text-[11px] uppercase tracking-[0.18em] text-[#736c63] underline underline-offset-4 transition-colors hover:text-[#1a1a1a]"
            >
              View All
            </Link>
          </div>

          {/* 2-col on mobile, 4-col on desktop */}
          <div className="grid grid-cols-2 gap-4 sm:gap-5 lg:grid-cols-4 lg:gap-6">
            {related.map((p) => (
              <RelatedCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════
          FOOTER
          Mobile  → centered / stacked
          Desktop → horizontal split (brand left | links right)
      ════════════════════════════════════════════════════════ */}
      <footer className="border-t border-[#e4ddd2] bg-[#f5f3ef]">
        <div className="px-4 py-10 sm:px-6 lg:mx-auto lg:max-w-7xl lg:px-8 lg:py-12">
          {/* Mobile: centered. Desktop: flex row */}
          <div className="flex flex-col items-center gap-8 lg:flex-row lg:items-start lg:justify-between">
            {/* Brand */}
            <div className="text-center lg:text-left">
              <p className="font-cormorant text-[36px] font-light tracking-[0.08em] text-[#1a1a1a] lg:text-[44px]">
                Archetype
              </p>
              <p className="mt-1 text-[10px] uppercase tracking-[0.28em] text-[#9a9389]">
                Crafted Interiors
              </p>
            </div>

            {/* Nav links — horizontal on desktop */}
            <nav className="flex flex-col items-center gap-3 lg:flex-row lg:gap-6">
              {[
                { label: "Collections", to: "/" },
                { label: "Living Collection", to: "/products" },
              ].map((item) => (
                <Link
                  key={item.to}
                  to={item.to}
                  className="text-[11px] uppercase tracking-[0.24em] text-[#736c63] transition-colors hover:text-[#1a1a1a]"
                >
                  {item.label}
                </Link>
              ))}
            </nav>

            {/* CTA button */}
            <Link
              to="/products"
              className="rounded-full border border-[#1a1a1a] px-8 py-3 text-[11px] font-medium uppercase tracking-[0.22em] text-[#1a1a1a] transition-colors hover:bg-[#1a1a1a] hover:text-[#f5f3ef]"
            >
              Explore Collection
            </Link>
          </div>

          {/* Legal */}
          <div className="mt-8 border-t border-[#e4ddd2] pt-6 lg:mt-10">
            <p className="text-center text-[10px] uppercase tracking-[0.2em] text-[#b2aa9f] lg:text-left">
              © {new Date().getFullYear()} Archetype. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
