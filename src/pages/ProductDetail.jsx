import { Link, useParams } from "react-router-dom";
import { ArrowLeft, Box, Maximize2, ScanSearch, Sparkles } from "lucide-react";
import Header from "../components/Header";
import { getProductBySlug } from "../data/products";

function ColorSwatches({ colors }) {
  return (
    <div className="flex gap-3">
      {colors.map((color) => (
        <span
          key={color}
          className="h-10 w-10 rounded-sm border border-[#d9d1c6]"
          style={{ backgroundColor: color }}
        />
      ))}
    </div>
  );
}

export default function ProductDetail() {
  const { slug } = useParams();
  const product = getProductBySlug(slug);

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

      <main className="mx-auto max-w-7xl px-4 pb-12 pt-28 sm:px-6 lg:px-8">
        <div className="mb-6 flex flex-wrap items-center gap-3 text-[11px] uppercase tracking-[0.22em] text-[#8d877d]">
          <Link to="/products" className="inline-flex items-center gap-2 hover:text-[#1a1a1a]">
            <ArrowLeft size={14} />
            Living Collection
          </Link>
          <span>/</span>
          <span>{product.category}</span>
        </div>

        <section className="grid gap-8 rounded-[30px] border border-[#e4ddd2] bg-[#f8f6f2] p-5 shadow-[0_24px_60px_rgba(26,26,26,0.05)] lg:grid-cols-[minmax(0,1fr)_320px] lg:p-8">
          <div className="rounded-[26px] bg-[#f4f1eb] p-5 sm:p-8">
            <p className="text-[11px] uppercase tracking-[0.28em] text-[#9a9389]">
              {product.series}
            </p>
            <div className="mt-2 flex flex-col gap-3 border-b border-[#e0dbd2] pb-5 sm:flex-row sm:items-end sm:justify-between">
              <h1 className="font-cormorant text-5xl leading-none text-[#1a1a1a] sm:text-6xl">
                {product.name}
              </h1>
              <span className="rounded-full bg-white px-4 py-2 text-[10px] font-medium uppercase tracking-[0.18em] text-[#1a1a1a]">
                {product.badge}
              </span>
            </div>

            <div className="mt-8 rounded-[28px] bg-white p-6 shadow-[0_18px_45px_rgba(26,26,26,0.08)]">
              <div className="flex min-h-[520px] items-center justify-center overflow-hidden rounded-[22px] bg-[radial-gradient(circle_at_top,_#faf7f0,_#f0ece5_65%,_#ece6db)] p-6 sm:p-10">
                <img
                  src={product.image}
                  alt={product.name}
                  className="max-h-[460px] w-full object-contain"
                />
              </div>
            </div>

            <div className="mt-5 flex flex-wrap items-center gap-3">
              <button
                type="button"
                className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-3 text-[11px] uppercase tracking-[0.18em] text-[#1a1a1a] shadow-[0_10px_20px_rgba(26,26,26,0.06)]"
              >
                <ScanSearch size={14} />
                Zoom
              </button>
              <button
                type="button"
                className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-3 text-[11px] uppercase tracking-[0.18em] text-[#1a1a1a] shadow-[0_10px_20px_rgba(26,26,26,0.06)]"
              >
                <Sparkles size={14} />
                Alternate View
              </button>
              <button
                type="button"
                className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-3 text-[11px] uppercase tracking-[0.18em] text-[#1a1a1a] shadow-[0_10px_20px_rgba(26,26,26,0.06)]"
              >
                <Maximize2 size={14} />
                Fullscreen
              </button>
            </div>
          </div>

          <aside className="rounded-[26px] bg-white p-6 shadow-[0_18px_45px_rgba(26,26,26,0.06)]">
            <div className="border-b border-[#ece5db] pb-5">
              <p className="text-[10px] uppercase tracking-[0.2em] text-[#9a9389]">
                Starting From
              </p>
              <div className="mt-2 flex items-end gap-2">
                <p className="font-cormorant text-5xl leading-none text-[#1a1a1a]">
                  ${product.price.toLocaleString()}
                </p>
                <span className="pb-1 text-[11px] uppercase tracking-[0.18em] text-[#9a9389]">
                  USD
                </span>
              </div>
            </div>

            <div className="space-y-6 py-6">
              <div>
                <div className="mb-3 flex items-center justify-between">
                  <p className="text-[10px] uppercase tracking-[0.2em] text-[#9a9389]">
                    Frame Finish
                  </p>
                  <p className="text-[10px] uppercase tracking-[0.18em] text-[#b2aa9f]">
                    {product.material.split(" / ")[0]}
                  </p>
                </div>
                <ColorSwatches colors={product.frameFinishes} />
              </div>

              <div>
                <div className="mb-3 flex items-center justify-between">
                  <p className="text-[10px] uppercase tracking-[0.2em] text-[#9a9389]">
                    Upholstery
                  </p>
                  <p className="text-[10px] uppercase tracking-[0.18em] text-[#b2aa9f]">
                    {product.material.split(" / ")[1] ?? product.material}
                  </p>
                </div>
                <ColorSwatches colors={product.upholstery} />
              </div>
            </div>

            <div className="rounded-[22px] bg-[#f5f2ec] p-5">
              <div className="flex items-start gap-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-[#1a1a1a]">
                  <Box size={18} />
                </div>
                <div>
                  <p className="font-medium text-[#1a1a1a]">View in your space</p>
                  <p className="mt-1 text-sm leading-relaxed text-[#7d766d]">
                    Scan the piece in AR and check how scale and tone feel in your
                    room before ordering.
                  </p>
                </div>
              </div>

              <Link
                to={`/products/${product.slug}/ar`}
                className="mt-5 inline-flex w-full items-center justify-center rounded-full border border-[#1a1a1a] px-4 py-3 text-[11px] font-medium uppercase tracking-[0.18em] text-[#1a1a1a] transition-colors hover:bg-[#1a1a1a] hover:text-[#f5f3ef]"
              >
                Enter AR Mode
              </Link>
            </div>

            <div className="mt-6 border-t border-[#ece5db] pt-6">
              <p className="text-sm leading-relaxed text-[#736c63]">
                {product.summary}
              </p>
            </div>

            <div className="mt-6 space-y-4 border-t border-[#ece5db] pt-6">
              <div className="flex items-center justify-between text-sm">
                <span className="uppercase tracking-[0.18em] text-[#9a9389]">
                  Dimensions
                </span>
                <span className="text-right text-[#1a1a1a]">{product.dimensions}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="uppercase tracking-[0.18em] text-[#9a9389]">
                  Weight
                </span>
                <span className="text-[#1a1a1a]">{product.weight}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="uppercase tracking-[0.18em] text-[#9a9389]">
                  Lead Time
                </span>
                <span className="text-[#1a1a1a]">{product.leadTime}</span>
              </div>
            </div>
          </aside>
        </section>
      </main>
    </div>
  );
}
