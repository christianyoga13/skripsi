import { useState } from "react";
import { Link } from "react-router-dom";
import Header from "../components/Header";
import CategoryCard from "../components/CategoryCard";
import ProductCard from "../components/ProductCard";
import { products } from "../data/products";
import interiorImg from "../assets/interior design.webp";

export default function Home() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email.trim()) { setSubscribed(true); setEmail(""); }
  };

  return (
    <div className="min-h-screen bg-[#f5f3ef]">
      <Header />

      <main>
        {/* ── Hero ───────────────────────────────────────────── */}
        <section className="relative mt-16 h-[85vh] min-h-[480px] overflow-hidden sm:mt-20 sm:h-[90vh]">
          <img
            src={interiorImg}
            alt="Interior Design"
            className="absolute inset-0 h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-black/45" />
          <div className="absolute inset-0 flex items-center px-6 text-white sm:px-10 lg:px-16">
            <div className="relative flex max-w-2xl flex-col justify-center text-white">
              <span className="mb-4 block font-cormorant text-4xl font-medium leading-tight sm:text-5xl lg:text-6xl lg:leading-none">
                The Art of Living: Where Design Meets Lifestyle
              </span>
              <p className="text-base font-dmsans leading-relaxed sm:text-lg">
                Discover the perfect blend of aesthetics and functionality in our
                curated collection of home furnishings.
              </p>
            </div>
          </div>
        </section>

        {/* ── Categories ─────────────────────────────────────── */}
        <section className="py-12 sm:py-16">
          <div className="mx-auto max-w-7xl space-y-4 px-4 sm:space-y-6 sm:px-6 lg:px-8">
            <div className="grid gap-4 sm:gap-6 lg:grid-cols-[1.7fr_0.5fr]">
              <CategoryCard title="Living Room" subtitle="Elevate your relaxation space" image={interiorImg} />
              <CategoryCard title="Bedroom"     subtitle="Create your sanctuary"        image={interiorImg} />
            </div>
            <div className="grid gap-4 sm:gap-6 lg:grid-cols-[0.8fr_1.4fr]">
              <CategoryCard title="Dining Room" subtitle="Gather in style"              image={interiorImg} />
              <CategoryCard title="Office"      subtitle="Boost your productivity"      image={interiorImg} />
            </div>
          </div>
        </section>

        {/* ── Measures with Light ────────────────────────────── */}
        <section className="w-full bg-[#1f1f1f] py-16 text-white sm:py-20">
          <div className="mx-auto flex max-w-6xl flex-col items-center gap-10 px-6 sm:px-10 lg:flex-row lg:gap-16 lg:px-8">
            <div className="w-full lg:flex-1">
              <p className="mb-3 text-[11px] uppercase tracking-[0.28em] text-[#9a9389]">Innovation</p>
              <h2 className="font-cormorant text-4xl font-medium leading-tight sm:text-5xl">
                Measures with Light
              </h2>
              <p className="mt-4 max-w-md text-sm leading-relaxed text-[#b0a89e] sm:text-base">
                Experience our collection in your space before it arrives. Our proprietary 3D
                visualization and AR technology allow for millimeter-perfect placement and
                lighting simulation.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <button className="rounded-full bg-blue-600 px-6 py-3 text-[11px] font-medium uppercase tracking-[0.18em] text-white transition-colors hover:bg-blue-700">
                  Try AR
                </button>
                <button className="rounded-full border border-white/40 px-6 py-3 text-[11px] font-medium uppercase tracking-[0.18em] text-white transition-colors hover:border-white hover:bg-white/10">
                  Learn More
                </button>
              </div>
            </div>
            <div className="w-full max-w-sm lg:max-w-none lg:w-auto lg:flex-shrink-0">
              <img src={interiorImg} alt="Interior Design" className="w-full rounded-2xl object-cover lg:h-96 lg:w-auto" />
            </div>
          </div>
        </section>

        {/* ── Permanent Collection ───────────────────────────── */}
        <section className="py-12 sm:py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <h2 className="font-cormorant text-4xl font-medium text-[#1a1a1a] sm:text-5xl">
              The Permanent Collection
            </h2>
            <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm text-[#736c63]">Foundational pieces built to endure generations</p>
              <Link to="/products" className="border-b border-[#1a1a1a] pb-1 text-sm text-[#1a1a1a] self-start sm:self-auto">
                Shop All Products
              </Link>
            </div>
            <div className="mt-10 grid grid-cols-2 gap-4 sm:gap-8 xl:grid-cols-4">
              {products.slice(0, 4).map((product) => (
              <ProductCard
                  key={product.id}
                  title={product.name}
                  image={product.image}
                  to={`/products/${product.slug}`}
                />
              ))}
            </div>
          </div>
        </section>

        {/* ── About Us ────────────────────────────────────────── */}
        <section className="overflow-hidden bg-[#f5f3ef] py-12 sm:py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col lg:flex-row lg:min-h-[480px] lg:gap-16 xl:gap-20">

              {/* Image — full-width mobile, half desktop */}
              <div className="relative h-72 w-full flex-shrink-0 overflow-hidden rounded-2xl sm:h-96 lg:h-auto lg:w-1/2">
                <img
                  src={interiorImg}
                  alt="Archetype Studio"
                  className="absolute inset-0 h-full w-full object-cover"
                />
                <div className="absolute inset-0 bg-[#1a1a1a]/10" />
              </div>

              {/* Text — aligned with container, no extra padding needed */}
              <div className="flex flex-col justify-center py-10 lg:w-1/2 lg:py-0">
                <p className="mb-4 font-dmsans text-[10px] uppercase tracking-[0.28em] text-[#9a9389]">
                  About Us
                </p>
                <h2 className="font-cormorant text-3xl font-medium leading-tight text-[#1a1a1a] sm:text-4xl lg:text-[3.25rem] lg:leading-[1.15]">
                  Crafted With Intention,<br className="hidden lg:block" /> Built to Last
                </h2>
                <p className="mt-6 text-sm leading-relaxed text-[#736c63] sm:text-base">
                  Archetype was founded on a singular belief — that the objects we surround
                  ourselves with should be as meaningful as the moments we live in them.
                  Each piece is designed in collaboration with master craftspeople, sourcing
                  only the finest sustainable materials from around the world.
                </p>
                <p className="mt-4 text-sm leading-relaxed text-[#736c63] sm:text-base">
                  From our Jakarta atelier, we blend timeless European design principles
                  with the warmth of Southeast Asian craft traditions — creating furniture
                  that tells a story with every grain and seam.
                </p>
                <Link
                  to="/about"
                  className="group mt-10 inline-flex items-center gap-2 self-start border-b border-[#1a1a1a] pb-0.5 font-dmsans text-sm text-[#1a1a1a] transition-all hover:gap-3"
                >
                  Read more
                  <svg width="14" height="10" viewBox="0 0 14 10" fill="none">
                    <path d="M8.5 1L13 5M13 5L8.5 9M13 5H1" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* ── Footer ──────────────────────────────────────────────── */}
      <footer className="bg-[#2a2620] text-[#c8bfb4]">

        {/* Main body */}
        <div className="mx-auto max-w-7xl px-6 py-16 sm:px-10 sm:py-20 lg:px-16 lg:py-20">

          {/* Mobile: center stack | Desktop: brand left + 3 link cols right */}
          <div className="flex flex-col items-center gap-14 lg:flex-row lg:items-start lg:gap-20">

            {/* Brand column — fixed width on desktop */}
            <div className="flex flex-col items-center text-center lg:w-80 lg:flex-shrink-0 lg:items-start lg:text-left">
              <span className="font-cormorant text-4xl font-light tracking-[0.18em] text-[#f5f3ef] sm:text-5xl">
                Archetype
              </span>
              <p className="mt-5 max-w-[220px] text-[13px] leading-relaxed text-[#6a6258] lg:max-w-none">
                Where design meets intention.<br className="hidden lg:block" />
                Furniture crafted for spaces that endure.
              </p>
            </div>

            {/* Nav columns — equal width, evenly spaced */}
            <div className="grid w-full grid-cols-1 gap-10 text-center sm:grid-cols-3 lg:flex-1 lg:gap-16 lg:text-left">

              <div>
                <p className="mb-5 font-dmsans text-[10px] uppercase tracking-[0.22em] text-[#9a9389]">
                  Collection
                </p>
                <ul className="space-y-4">
                  {["Living Room", "Bedroom", "Dining Room", "Office & Study"].map((item) => (
                    <li key={item}>
                      <Link to="/products" className="font-dmsans text-[13px] text-[#c8bfb4] transition-colors hover:text-[#f5f3ef]">
                        {item}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <p className="mb-5 font-dmsans text-[10px] uppercase tracking-[0.22em] text-[#9a9389]">
                  Company
                </p>
                <ul className="space-y-4">
                  {["About Us", "Our Story", "Sustainability", "Careers"].map((item) => (
                    <li key={item}>
                      <Link to="/" className="font-dmsans text-[13px] text-[#c8bfb4] transition-colors hover:text-[#f5f3ef]">
                        {item}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <p className="mb-5 font-dmsans text-[10px] uppercase tracking-[0.22em] text-[#9a9389]">
                  Support
                </p>
                <ul className="space-y-4">
                  {["Contact Us", "Shipping & Returns", "Care Guide", "FAQ"].map((item) => (
                    <li key={item}>
                      <Link to="/" className="font-dmsans text-[13px] text-[#c8bfb4] transition-colors hover:text-[#f5f3ef]">
                        {item}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Newsletter — full-width strip below columns */}
          <div className="mt-14 border-t border-[#3d3830] pt-12">
            <div className="flex flex-col items-center gap-8 lg:flex-row lg:items-center lg:justify-between">
              <div className="text-center lg:text-left">
                <p className="font-dmsans text-[10px] uppercase tracking-[0.22em] text-[#9a9389]">
                  Newsletter
                </p>
                <p className="mt-2 text-[13px] leading-relaxed text-[#6a6258]">
                  New arrivals and exclusive offers, delivered quietly.
                </p>
              </div>

              {subscribed ? (
                <p className="font-dmsans text-sm text-[#9a9389]">✓ You're on the list.</p>
              ) : (
                <form
                  onSubmit={handleSubscribe}
                  className="flex w-full max-w-md items-stretch overflow-hidden rounded-full border border-[#3d3830] bg-[#221f1b] lg:w-[400px]"
                >
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Email Address"
                    required
                    className="flex-1 min-w-0 bg-transparent px-6 py-3.5 font-dmsans text-[13px] text-[#c8bfb4] placeholder-[#4a4540] outline-none"
                  />
                  <button
                    type="submit"
                    className="flex-shrink-0 rounded-full bg-[#f5f3ef] px-6 py-3.5 font-dmsans text-[11px] font-medium uppercase tracking-[0.18em] text-[#1a1a1a] transition-colors hover:bg-white"
                  >
                    Subscribe
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-[#3d3830]">
          <div className="mx-auto flex max-w-7xl flex-col items-center gap-2 px-6 py-5 text-center sm:flex-row sm:justify-between sm:text-left lg:px-8">
            <p className="font-dmsans text-[11px] text-[#4a4540]">
              © {new Date().getFullYear()} Archetype. All rights reserved.
            </p>
            <div className="flex gap-5">
              {["Privacy Policy", "Terms of Use"].map((item) => (
                <Link key={item} to="/" className="font-dmsans text-[11px] text-[#4a4540] transition-colors hover:text-[#7a7068]">
                  {item}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
