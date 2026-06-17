import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { Layers, LogOut, Menu, ShoppingBag, User, X } from "lucide-react";
import { useAuth } from "../context/useAuth";

const menuItems = [
  { label: "The Edit", to: "/" },
  { label: "Atelier", to: "/products" },
  { label: "Studio", to: "/workspaces", icon: Layers },
];

export default function Header() {
  const [showHeader, setShowHeader] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { signOut, user } = useAuth();

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

  // Close mobile menu on route change / scroll
  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-50 bg-[#f5f3ef]/92 backdrop-blur-xl transition-transform duration-300 ${
          showHeader ? "translate-y-0" : "-translate-y-full"
        }`}
      >
        <nav className="mx-auto flex h-16 w-full max-w-7xl items-center gap-6 px-4 sm:h-20 sm:px-6 lg:px-8">
          <NavLink
            to="/"
            className="font-cormorant text-2xl font-medium tracking-[0.14em] text-[#1a1a1a] sm:text-3xl"
            onClick={() => setMobileOpen(false)}
          >
            Archetype
          </NavLink>

          {/* Desktop nav */}
          <ul className="hidden items-center gap-8 md:flex">
            {menuItems.map((item) => (
              <li key={item.to}>
                <NavLink
                  to={item.to}
                  end={item.to === "/"}
                  className={({ isActive }) =>
                    `header-link inline-flex items-center gap-1.5 ${isActive ? "header-link-active" : ""}`
                  }
                >
                  {item.icon && <item.icon size={13} strokeWidth={1.8} />}
                  {item.label}
                </NavLink>
              </li>
            ))}
          </ul>

          {/* Right actions */}
          <div className="ml-auto flex items-center gap-2 sm:gap-3">
            <span className="hidden border-b border-[#1a1a1a] pb-1 text-[11px] uppercase tracking-[0.28em] text-[#5f5a53] lg:inline-block">
              Crafted Interiors
            </span>
            {!user && (
              <NavLink
                to="/login"
                className={({ isActive }) =>
                  `hidden rounded-full border px-4 py-2 text-[10px] font-medium uppercase tracking-[0.18em] transition-colors duration-200 sm:inline-flex ${
                    isActive
                      ? "border-[#1a1a1a] bg-[#1a1a1a] text-[#f5f3ef]"
                      : "border-[#d8d0c4] text-[#1a1a1a] hover:bg-[#1a1a1a] hover:text-[#f5f3ef]"
                  }`
                }
              >
                Login
              </NavLink>
            )}
            <button
              type="button"
              className="rounded-full border border-[#d8d0c4] p-2 text-[#1a1a1a] transition-colors duration-200 hover:bg-[#1a1a1a] hover:text-[#f5f3ef]"
              aria-label="Shopping bag"
            >
              <ShoppingBag size={17} strokeWidth={1.8} />
            </button>
            <NavLink
              to={user ? "/account" : "/login"}
              className="rounded-full border border-[#d8d0c4] p-2 text-[#1a1a1a] transition-colors duration-200 hover:bg-[#1a1a1a] hover:text-[#f5f3ef]"
              aria-label="Account"
            >
              <User size={17} strokeWidth={1.8} />
            </NavLink>
            {user && (
              <button
                type="button"
                onClick={() => signOut()}
                className="hidden rounded-full border border-[#d8d0c4] p-2 text-[#1a1a1a] transition-colors duration-200 hover:bg-[#1a1a1a] hover:text-[#f5f3ef] md:flex"
                aria-label="Logout"
              >
                <LogOut size={17} strokeWidth={1.8} />
              </button>
            )}

            {/* Hamburger – mobile only */}
            <button
              type="button"
              onClick={() => setMobileOpen((v) => !v)}
              className="rounded-full border border-[#d8d0c4] p-2 text-[#1a1a1a] transition-colors duration-200 hover:bg-[#1a1a1a] hover:text-[#f5f3ef] md:hidden"
              aria-label={mobileOpen ? "Tutup menu" : "Buka menu"}
            >
              {mobileOpen ? <X size={17} strokeWidth={1.8} /> : <Menu size={17} strokeWidth={1.8} />}
            </button>
          </div>
        </nav>
      </header>

      {/* Mobile drawer */}
      <div
        className={`fixed inset-0 z-40 md:hidden transition-all duration-300 ${
          mobileOpen ? "pointer-events-auto" : "pointer-events-none"
        }`}
      >
        {/* Backdrop */}
        <div
          className={`absolute inset-0 bg-black/30 backdrop-blur-sm transition-opacity duration-300 ${
            mobileOpen ? "opacity-100" : "opacity-0"
          }`}
          onClick={() => setMobileOpen(false)}
        />

        {/* Drawer panel */}
        <div
          className={`absolute right-0 top-0 h-full w-72 bg-[#f5f3ef] shadow-2xl transition-transform duration-300 ${
            mobileOpen ? "translate-x-0" : "translate-x-full"
          }`}
        >
          <div className="flex h-16 items-center justify-between border-b border-[#e0dbd2] px-6">
            <span className="font-cormorant text-xl font-medium tracking-[0.12em] text-[#1a1a1a]">
              Archetype
            </span>
            <button
              type="button"
              onClick={() => setMobileOpen(false)}
              className="rounded-full p-2 text-[#1a1a1a] hover:bg-[#1a1a1a]/10 transition-colors"
              aria-label="Tutup menu"
            >
              <X size={18} strokeWidth={1.8} />
            </button>
          </div>

          <nav className="flex flex-col gap-1 px-4 py-6">
            {menuItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === "/"}
                onClick={() => setMobileOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-2xl px-4 py-3.5 text-sm font-medium transition-colors duration-200 ${
                    isActive
                      ? "bg-[#1a1a1a] text-[#f5f3ef]"
                      : "text-[#4a4540] hover:bg-[#1a1a1a]/6 hover:text-[#1a1a1a]"
                  }`
                }
              >
                {item.icon && <item.icon size={15} strokeWidth={1.8} />}
                {item.label}
              </NavLink>
            ))}
          </nav>

          <div className="border-t border-[#e0dbd2] px-4 py-6 space-y-3">
            {!user ? (
              <>
                <NavLink
                  to="/login"
                  onClick={() => setMobileOpen(false)}
                  className="flex w-full items-center justify-center rounded-full border border-[#1a1a1a] bg-[#1a1a1a] px-5 py-3 text-[11px] font-medium uppercase tracking-[0.18em] text-[#f5f3ef] transition-colors hover:bg-transparent hover:text-[#1a1a1a]"
                >
                  Login
                </NavLink>
                <NavLink
                  to="/register"
                  onClick={() => setMobileOpen(false)}
                  className="flex w-full items-center justify-center rounded-full border border-[#d8d0c4] px-5 py-3 text-[11px] font-medium uppercase tracking-[0.18em] text-[#1a1a1a] transition-colors hover:bg-[#1a1a1a] hover:text-[#f5f3ef]"
                >
                  Register
                </NavLink>
              </>
            ) : (
              <button
                type="button"
                onClick={() => { signOut(); setMobileOpen(false); }}
                className="flex w-full items-center justify-center gap-2 rounded-full border border-[#d8d0c4] px-5 py-3 text-[11px] font-medium uppercase tracking-[0.18em] text-[#1a1a1a] transition-colors hover:bg-[#1a1a1a] hover:text-[#f5f3ef]"
              >
                <LogOut size={14} />
                Logout
              </button>
            )}
          </div>

          <p className="px-8 text-[10px] uppercase tracking-[0.28em] text-[#9f9790]">
            Crafted Interiors
          </p>
        </div>
      </div>
    </>
  );
}
