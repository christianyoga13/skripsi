import { useState } from "react";
import { ArrowLeft, ArrowRight, Heart, SlidersHorizontal, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import { products } from "../data/products";

const materials = ["#1a1a1a", "#c8b89a", "#8a9ba8", "#d4c5b0", "#6b7c6e"];
const finishes = ["MATTE", "OILED WOOD", "SATIN STEEL"];

export default function LivingCollections() {
  const navigate = useNavigate();
  const categories = [
    { name: "All Pieces", count: products.length },
    ...Array.from(new Set(products.map((product) => product.category))).map(
      (category) => ({
        name: category,
        count: products.filter((product) => product.category === category).length,
      })
    ),
  ];

  const [activeCategory, setActiveCategory] = useState("All Pieces");
  const [activeMaterial, setActiveMaterial] = useState(0);
  const [activeFinish, setActiveFinish] = useState("OILED WOOD");
  const [price, setPrice] = useState(4800);
  const [wishlisted, setWishlisted] = useState({});
  const [activePage, setActivePage] = useState(1);
  const [filterOpen, setFilterOpen] = useState(false);

  const toggleWishlist = (id) =>
    setWishlisted((prev) => ({ ...prev, [id]: !prev[id] }));

  const visibleProducts = products.filter((product) => {
    const matchesCategory =
      activeCategory === "All Pieces" || product.category === activeCategory;

    return matchesCategory && product.price <= price;
  });

  const sliderProgress = ((price - 500) / (6000 - 500)) * 100;

  // Sidebar inner content – reused in both desktop & mobile drawer
  function FilterContent({ onClose }) {
    return (
      <>
        {onClose && (
          <div className="mb-6 flex items-center justify-between">
            <p className="text-sm font-medium text-[#1a1a1a]">Filters</p>
            <button
              type="button"
              onClick={onClose}
              className="rounded-full p-1.5 text-[#888] hover:text-[#1a1a1a] transition-colors"
              aria-label="Tutup filter"
            >
              <X size={16} strokeWidth={1.8} />
            </button>
          </div>
        )}

        <div className="mb-8">
          <p className="mb-3 text-[10px] font-medium uppercase tracking-[0.15em] text-[#999]">
            Category
          </p>
          {categories.map((category) => (
            <button
              key={category.name}
              type="button"
              onClick={() => { setActiveCategory(category.name); onClose?.(); }}
              className={`flex w-full items-center justify-between border-none bg-transparent py-1.5 text-left text-[13px] transition-colors duration-200 ${
                activeCategory === category.name
                  ? "font-medium text-[#1a1a1a]"
                  : "text-[#555] hover:text-[#1a1a1a]"
              }`}
            >
              <span>{category.name}</span>
              <span className="text-[11px] text-[#bbb]">{category.count}</span>
            </button>
          ))}
        </div>

        <div className="mb-8">
          <p className="mb-3 text-[10px] font-medium uppercase tracking-[0.15em] text-[#999]">
            Material
          </p>
          <div className="flex flex-wrap gap-2">
            {materials.map((color, index) => (
              <button
                key={color}
                type="button"
                onClick={() => setActiveMaterial(index)}
                className={`h-5 w-5 rounded-full border-2 transition-all duration-200 ${
                  activeMaterial === index
                    ? "border-[#1a1a1a]"
                    : "border-transparent hover:border-[#1a1a1a]"
                }`}
                style={{ backgroundColor: color }}
                aria-label={`Material option ${index + 1}`}
              />
            ))}
          </div>
        </div>

        <div className="mb-8">
          <p className="mb-3 text-[10px] font-medium uppercase tracking-[0.15em] text-[#999]">
            Finish
          </p>
          <div className="flex flex-col gap-1.5">
            {finishes.map((finish) => (
              <button
                key={finish}
                type="button"
                onClick={() => setActiveFinish(finish)}
                className={`w-fit rounded-sm border px-2.5 py-1 text-[10px] font-medium tracking-[0.1em] transition-all duration-200 ${
                  activeFinish === finish
                    ? "border-[#1a1a1a] bg-[#1a1a1a] text-[#f5f3ef]"
                    : "border-[#d0cbc3] bg-transparent text-[#555] hover:border-[#1a1a1a] hover:bg-[#1a1a1a] hover:text-[#f5f3ef]"
                }`}
              >
                {finish}
              </button>
            ))}
          </div>
        </div>

        <div>
          <p className="mb-3 text-[10px] font-medium uppercase tracking-[0.15em] text-[#999]">
            Price
          </p>
          <div className="flex flex-col gap-2">
            <input
              type="range"
              className="price-slider"
              min={500}
              max={6000}
              value={price}
              onChange={(event) => setPrice(Number(event.target.value))}
              style={{
                background: `linear-gradient(to right, #1a1a1a ${sliderProgress}%, #d0cbc3 ${sliderProgress}%)`,
              }}
            />
            <div className="flex justify-between text-[11px] text-[#888]">
              <span>$500</span>
              <span>${price.toLocaleString()}</span>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <div className="min-h-screen bg-[#f5f3ef] font-dmsans text-[#1a1a1a]">
      <Header />

      {/* ── Mobile filter drawer ───────────────────────────── */}
      <div
        className={`fixed inset-0 z-40 lg:hidden transition-all duration-300 ${
          filterOpen ? "pointer-events-auto" : "pointer-events-none"
        }`}
      >
        <div
          className={`absolute inset-0 bg-black/30 backdrop-blur-sm transition-opacity duration-300 ${
            filterOpen ? "opacity-100" : "opacity-0"
          }`}
          onClick={() => setFilterOpen(false)}
        />
        <div
          className={`absolute left-0 top-0 h-full w-72 overflow-y-auto bg-[#f8f6f2] p-6 shadow-2xl transition-transform duration-300 ${
            filterOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <FilterContent onClose={() => setFilterOpen(false)} />
        </div>
      </div>

      <div className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-4 pb-12 pt-24 sm:px-6 sm:pt-28 lg:flex-row lg:px-8">
        {/* ── Desktop sidebar ─────────────────────────────── */}
        <aside className="collection-sidebar hidden lg:sticky lg:top-28 lg:block lg:w-[240px] lg:self-start">
          <FilterContent />
        </aside>

        {/* ── Main content ────────────────────────────────── */}
        <main className="flex-1 overflow-hidden rounded-[28px] border border-[#e4ddd2] bg-[#f8f6f2] px-5 py-6 shadow-[0_24px_60px_rgba(26,26,26,0.06)] sm:px-8 sm:py-8">
          <div className="mb-10 grid gap-6 border-b border-[#e0dbd2] pb-8 lg:grid-cols-[minmax(0,1fr)_240px] lg:items-end">
            <div>
              <p className="mb-3 text-[11px] uppercase tracking-[0.3em] text-[#8f877c]">
                Curated Interior Objects
              </p>
              <h1 className="mb-3 font-cormorant text-[36px] font-light leading-tight tracking-[-0.01em] text-[#1a1a1a] sm:text-[52px]">
                Living Collections
              </h1>
              <p className="max-w-[540px] text-[14px] leading-relaxed text-[#777]">
                Sculptural forms meet architectural precision. Discover our
                curated selection of seating, tables, and storage designed to
                ground your space in serene luxury.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 text-left">
              <div className="rounded-2xl border border-[#e5dfd5] bg-white/70 px-4 py-4">
                <p className="text-[10px] uppercase tracking-[0.2em] text-[#9a9389]">
                  Showing
                </p>
                <p className="mt-2 font-cormorant text-3xl text-[#1a1a1a]">
                  {String(visibleProducts.length).padStart(2, "0")}
                </p>
              </div>
              <div className="rounded-2xl border border-[#e5dfd5] bg-white/70 px-4 py-4">
                <p className="text-[10px] uppercase tracking-[0.2em] text-[#9a9389]">
                  Finish
                </p>
                <p className="mt-2 text-[12px] font-medium tracking-[0.18em] text-[#1a1a1a]">
                  {activeFinish}
                </p>
              </div>
            </div>
          </div>

          {/* Mobile filter toggle bar */}
          <div className="mb-5 flex items-center gap-3 lg:hidden">
            <button
              type="button"
              onClick={() => setFilterOpen(true)}
              className="inline-flex items-center gap-2 rounded-full border border-[#d0cbc3] bg-white px-4 py-2.5 text-[11px] font-medium uppercase tracking-[0.16em] text-[#555] transition-colors hover:border-[#1a1a1a] hover:text-[#1a1a1a]"
            >
              <SlidersHorizontal size={13} strokeWidth={1.8} />
              Filter
            </button>
            <span className="text-[11px] uppercase tracking-[0.2em] text-[#9a9389]">
              {activeCategory} · Under ${price.toLocaleString()}
            </span>
          </div>

          <div className="mb-6 hidden flex-col gap-3 border-b border-[#e0dbd2] pb-5 text-[12px] text-[#736c63] sm:flex-row sm:items-center sm:justify-between lg:flex">
            <p>
              Refined pieces for layered living spaces with warm woods, stone
              surfaces, and tailored silhouettes.
            </p>
            <p className="uppercase tracking-[0.24em] text-[#9a9389]">
              {activeCategory} / Under ${price.toLocaleString()}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-x-4 gap-y-6 sm:gap-x-6 sm:gap-y-8 xl:grid-cols-3">
            {visibleProducts.map((product) => (
              <article
                key={product.id}
                className="product-card cursor-pointer"
                onClick={() => navigate(`/products/${product.slug}`)}
              >
                <div
                  className="card-img-wrap relative mb-3 overflow-hidden rounded-[18px] bg-[#ede9e3] transition-transform duration-300 sm:mb-3.5 sm:rounded-[22px]"
                  style={{ aspectRatio: "1 / 0.92" }}
                >
                  <img
                    src={product.image}
                    alt={product.name}
                    className="h-full w-full object-cover transition-transform duration-500"
                  />
                  <span className="absolute left-2.5 top-2.5 rounded-full bg-white/90 px-2.5 py-0.5 text-[8px] font-medium uppercase tracking-[0.14em] text-[#1a1a1a] backdrop-blur-sm sm:left-3 sm:top-3 sm:px-3 sm:py-1 sm:text-[9px]">
                    {product.badge}
                  </span>
                  <button
                    type="button"
                    onClick={(event) => {
                      event.stopPropagation();
                      toggleWishlist(product.id);
                    }}
                    className="absolute right-2.5 top-2.5 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 text-[#1a1a1a] backdrop-blur-sm transition-transform duration-200 hover:scale-110 sm:right-3 sm:top-3 sm:h-9 sm:w-9"
                    aria-label={`Toggle wishlist for ${product.name}`}
                  >
                    <Heart
                      size={14}
                      strokeWidth={1.8}
                      className={wishlisted[product.id] ? "fill-current" : ""}
                    />
                  </button>
                </div>

                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <p className="mb-0.5 truncate font-cormorant text-[20px] leading-tight text-[#1a1a1a] sm:text-[24px]">
                      {product.name}
                    </p>
                    <p className="mb-1.5 text-[10px] uppercase tracking-[0.12em] text-[#999] sm:text-[11px]">
                      {product.category}
                    </p>
                    <p className="hidden text-[12px] font-light text-[#7d766d] sm:block">
                      {product.material}
                    </p>
                  </div>
                  <p className="mt-0.5 shrink-0 whitespace-nowrap text-[13px] font-medium text-[#1a1a1a] sm:text-[14px]">
                    ${product.price.toLocaleString()}
                  </p>
                </div>
              </article>
            ))}
          </div>

          {visibleProducts.length === 0 && (
            <div className="mt-10 rounded-3xl border border-dashed border-[#d9d1c6] bg-white/70 px-6 py-10 text-center">
              <p className="font-cormorant text-3xl text-[#1a1a1a]">
                No pieces match this filter yet.
              </p>
              <p className="mt-2 text-sm text-[#7d766d]">
                Try a broader category or increase the price range.
              </p>
            </div>
          )}

          <div className="mt-12 flex flex-wrap items-center justify-center gap-2 border-t border-[#e0dbd2] pt-5">
            <button
              type="button"
              className="flex items-center gap-2 rounded-full px-3 py-2 text-[10px] font-medium uppercase tracking-[0.16em] text-[#999] transition-colors duration-200 hover:text-[#1a1a1a]"
            >
              <ArrowLeft size={14} strokeWidth={1.8} />
              Previous
            </button>
            {[1, 2, 3].map((page) => (
              <button
                key={page}
                type="button"
                onClick={() => setActivePage(page)}
                className={`flex h-9 w-9 items-center justify-center rounded-full text-[12px] transition-all duration-200 ${
                  activePage === page
                    ? "bg-[#1a1a1a] text-[#f5f3ef]"
                    : "bg-transparent text-[#bbb] hover:bg-[#1a1a1a] hover:text-[#f5f3ef]"
                }`}
              >
                {String(page).padStart(2, "0")}
              </button>
            ))}
            <button
              type="button"
              className="flex items-center gap-2 rounded-full px-3 py-2 text-[10px] font-medium uppercase tracking-[0.16em] text-[#999] transition-colors duration-200 hover:text-[#1a1a1a]"
            >
              Next
              <ArrowRight size={14} strokeWidth={1.8} />
            </button>
          </div>
        </main>
      </div>
    </div>
  );
}
