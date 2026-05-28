import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { ShoppingBag, User } from "lucide-react";

const menuItems = [
  { label: "Collections", to: "/" },
  { label: "Living Collection", to: "/products" },
];

export default function Header() {
  const [showHeader, setShowHeader] = useState(true);

  useEffect(() => {
    let lastScrollY = 0;

    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const isScrollingDown = currentScrollY > lastScrollY;

      setShowHeader(!(isScrollingDown && currentScrollY > 120));
      lastScrollY = currentScrollY;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 bg-[#f5f3ef]/92 backdrop-blur-xl transition-transform duration-300 ${
        showHeader ? "translate-y-0" : "-translate-y-full"
      }`}
    >
      <nav className="mx-auto flex h-20 w-full max-w-7xl items-center gap-6 px-4 sm:px-6 lg:px-8">
        <NavLink
          to="/"
          className="font-cormorant text-3xl font-medium tracking-[0.14em] text-[#1a1a1a]"
        >
          Archetype
        </NavLink>

        <ul className="hidden items-center gap-8 md:flex">
          {menuItems.map((item) => (
            <li key={item.to}>
              <NavLink
                to={item.to}
                end={item.to === "/"}
                className={({ isActive }) =>
                  `header-link ${isActive ? "header-link-active" : ""}`
                }
              >
                {item.label}
              </NavLink>
            </li>
          ))}
        </ul>

        <div className="ml-auto flex items-center gap-3">
          <span className="hidden border-b border-[#1a1a1a] pb-1 text-[11px] uppercase tracking-[0.28em] text-[#5f5a53] lg:inline-block">
            Crafted Interiors
          </span>
          <button
            type="button"
            className="rounded-full border border-[#d8d0c4] p-2 text-[#1a1a1a] transition-colors duration-200 hover:bg-[#1a1a1a] hover:text-[#f5f3ef]"
            aria-label="Shopping bag"
          >
            <ShoppingBag size={18} strokeWidth={1.8} />
          </button>
          <button
            type="button"
            className="rounded-full border border-[#d8d0c4] p-2 text-[#1a1a1a] transition-colors duration-200 hover:bg-[#1a1a1a] hover:text-[#f5f3ef]"
            aria-label="Account"
          >
            <User size={18} strokeWidth={1.8} />
          </button>
        </div>
      </nav>
    </header>
  );
}
