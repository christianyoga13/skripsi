import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { Heart, Trash2, ArrowLeft, ArrowRight } from "lucide-react";
import Header from "../components/Header";
import { products } from "../data/products";
import { useWishlist } from "../context/WishlistContext";

export default function Wishlist() {
  const navigate = useNavigate();
  const { wishlist, toggleWishlist, clearWishlist, isInWishlist } = useWishlist();

  // Filter products that are in the wishlist
  const wishlistedProducts = products.filter((product) => isInWishlist(product.id));

  return (
    <div className="min-h-screen bg-[#f5f3ef] font-dmsans text-[#1a1a1a]">
      <Header />

      <main className="mx-auto max-w-7xl px-4 pb-20 pt-24 sm:px-6 sm:pt-28 lg:px-8">
        {/* Header Block */}
        <div className="mb-10 flex flex-col gap-6 border-b border-[#e0dbd2] pb-8 md:flex-row md:items-end md:justify-between">
          <div data-tour="wishlist-title">
            <p className="mb-3 text-[11px] uppercase tracking-[0.3em] text-[#8f877c]">
              Saved Treasures
            </p>
            <h1 className="mb-3 font-cormorant text-[36px] font-light leading-tight tracking-[-0.01em] text-[#1a1a1a] sm:text-[52px]">
              My Wishlist
            </h1>
            <p className="max-w-[540px] text-[14px] leading-relaxed text-[#777]">
              A curated collection of your favorite pieces. Explore them in 3D or AR, customize their finishes, and make them yours when you are ready.
            </p>
          </div>

          {wishlistedProducts.length > 0 && (
            <button
              type="button"
              onClick={clearWishlist}
              className="inline-flex items-center gap-2 rounded-full border border-[#d0cbc3] bg-white/40 px-5 py-2.5 text-[11px] font-medium uppercase tracking-[0.16em] text-[#555] transition-colors hover:border-rose-500 hover:bg-rose-50 hover:text-rose-600 active:bg-rose-100"
            >
              <Trash2 size={13} />
              Clear Wishlist
            </button>
          )}
        </div>

        {/* Empty State or Grid container */}
        <div data-tour="wishlist-grid">
          {wishlistedProducts.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-[28px] border border-dashed border-[#d9d1c6] bg-[#f8f6f2] px-6 py-20 text-center shadow-[0_24px_60px_rgba(26,26,26,0.02)]">
            <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-white text-[#bbb]">
              <Heart size={28} strokeWidth={1.5} className="text-[#a39386]" />
            </div>
            <h2 className="font-cormorant text-3xl font-light text-[#1a1a1a] sm:text-4xl">
              Your wishlist is empty
            </h2>
            <p className="mt-3 max-w-sm text-sm leading-relaxed text-[#7d766d]">
              Explore our permanent collection to discover refined, slow-crafted furniture that grounds your space in serene luxury.
            </p>
            <Link
              to="/products"
              className="mt-8 inline-flex items-center gap-2.5 rounded-full bg-[#1a1a1a] px-8 py-4 text-[11px] font-medium uppercase tracking-[0.2em] text-[#f5f3ef] transition-transform duration-200 hover:scale-[1.02] hover:bg-[#333]"
            >
              Explore Collection
              <ArrowRight size={13} />
            </Link>
          </div>
        ) : (
          /* Grid of Items */
          <div className="grid grid-cols-2 gap-x-4 gap-y-8 sm:gap-x-6 sm:gap-y-10 xl:grid-cols-4">
            {wishlistedProducts.map((product) => (
              <article
                key={product.id}
                className="group relative cursor-pointer flex flex-col justify-between"
                onClick={() => navigate(`/products/${product.slug}`)}
              >
                <div>
                  <div
                    className="relative mb-3.5 overflow-hidden rounded-[22px] bg-[#ede9e3] shadow-sm transition-all duration-300 group-hover:shadow-md"
                    style={{ aspectRatio: "1 / 0.95" }}
                  >
                    <img
                      src={product.image}
                      alt={product.name}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />

                    {/* Badge */}
                    <span className="absolute left-3 top-3 rounded-full bg-white/95 px-2.5 py-0.5 text-[9px] font-medium uppercase tracking-[0.14em] text-[#1a1a1a] backdrop-blur-sm shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
                      {product.badge}
                    </span>

                    {/* Wishlist Button */}
                    <button
                      type="button"
                      onClick={(event) => {
                        event.stopPropagation();
                        toggleWishlist(product.id);
                      }}
                      className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-white text-rose-500 shadow-md transition-transform duration-200 hover:scale-110 active:scale-95"
                      aria-label={`Remove ${product.name} from wishlist`}
                    >
                      <Heart size={15} strokeWidth={1.8} className="fill-current" />
                    </button>
                  </div>

                  <div className="mt-1 px-1">
                    <p className="mb-0.5 truncate font-cormorant text-[20px] leading-tight text-[#1a1a1a] sm:text-[24px]">
                      {product.name}
                    </p>
                    <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-[0.12em] text-[#999]">
                      <span>{product.category}</span>
                      <span>·</span>
                      <span className="text-[#8f877c]">{product.material.split(" / ")[0]}</span>
                    </div>
                  </div>
                </div>

                <div className="mt-3.5 px-1">
                  <div className="flex items-center justify-end border-t border-[#e0dbd2]/60 pt-3">
                    <span className="text-[10px] font-medium uppercase tracking-[0.16em] text-[#5f5a53] group-hover:text-[#1a1a1a] transition-colors duration-200 underline underline-offset-4 decoration-transparent group-hover:decoration-current">
                      View Details
                    </span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
        </div>
      </main>
    </div>
  );
}
