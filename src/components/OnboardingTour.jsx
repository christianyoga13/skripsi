import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { ChevronLeft, ChevronRight, HelpCircle, X } from "lucide-react";

const getTourSteps = (isMobile) => ({
  "/": [
    {
      selector: '[data-tour="header-logo"]',
      title: "Selamat Datang di Archetype!",
      description: "Di sini Anda bisa menemukan furniture pilihan dengan perpaduan desain Eropa modern dan kerajinan lokal premium."
    },
    {
      selector: '[data-tour="home-ar-try"]',
      title: "Visualisasi Canggih 3D & AR",
      description: "Kami menyediakan simulasi 3D interaktif dan proyeksi Augmented Reality (AR) berakurasi milimeter untuk melihat kecocokan furniture di ruangan nyata Anda."
    },
    {
      selector: isMobile ? '[data-tour="header-atelier-mobile"]' : '[data-tour="header-atelier"]',
      title: "Jelajahi Atelier",
      description: "Silakan kunjungi halaman 'Atelier' untuk menjelajahi seluruh katalog furniture, menyaring material, dan melakukan kustomisasi warna."
    },
    {
      selector: '[data-tour="header-wishlist"]',
      title: "Simpan Favorit Anda",
      description: "Gunakan ikon hati ini untuk menandai barang yang Anda sukai agar tersimpan di Wishlist dan mudah dibuka kembali nanti."
    }
  ],
  "/products": [
    {
      selector: '[data-tour="collection-title"]',
      title: "Living Collections",
      description: "Halaman ini memuat seluruh katalog produk furniture premium kami seperti Seating, Table, dan Storage."
    },
    {
      selector: isMobile ? '[data-tour="collection-filters-btn"]' : '[data-tour="collection-filters"]',
      title: "Saring Sesuai Selera",
      description: isMobile
        ? "Ketuk tombol 'Filter' ini untuk membuka pilihan penyaringan produk berdasarkan kategori, warna material, dan jenis finishing kayu atau besi."
        : "Temukan furniture impian dengan menyaring produk berdasarkan kategori, warna material, dan jenis finishing kayu atau besi."
    },
    {
      selector: '[data-tour="collection-cards"]',
      title: "Katalog Furniture",
      description: "Klik pada kartu produk untuk melihat detail lengkap produk, memutar model 3D, atau masuk ke mode visualisasi AR."
    }
  ],
  "/products/:slug": [
    {
      selector: '[data-tour="detail-viewer"]',
      title: "Interactive 3D Visualizer",
      description: "Geser (drag) layar untuk memutar model 3D interaktif ini dari berbagai sudut, atau gunakan scroll untuk memperbesar detail material."
    },
    {
      selector: '[data-tour="detail-thumbnails"]',
      title: "Galeri Foto & 3D",
      description: "Pilih thumbnail gambar biasa, atau ketuk kotak berlabel '3D' untuk memuat model 3D interaktif pada panel visualizer utama."
    },
    {
      selector: '[data-tour="detail-customizer"]',
      title: "Kustomisasi Bebas",
      description: "Ubah warna dan material di sini! Setiap perubahan akan langsung terlihat pada model 3D interaktif di atas."
    },
    {
      selector: '[data-tour="detail-ar-btn"]',
      title: "Proyeksikan dengan AR",
      description: "Gunakan tombol ini di smartphone Anda untuk memproyeksikan furniture dalam ukuran nyata (1:1) ke dalam ruangan Anda menggunakan kamera."
    },
    {
      selector: '[data-tour="detail-specs"]',
      title: "Detail & Spesifikasi",
      description: "Cek dimensi produk (lebar, kedalaman, tinggi), berat bersih, serta estimasi waktu pengerjaan di panel ringkasan ini."
    }
  ],
  "/products/:slug/ar": [
    {
      selector: '[data-tour="ar-canvas"]',
      title: "Visualisasi AR Real-time",
      description: "Arahkan kamera ke permukaan lantai datar yang terang, lalu ketuk layar untuk menempatkan furniture di posisi tersebut."
    },
    {
      selector: '[data-tour="ar-tab-object"]',
      title: "Pilih Furniture",
      description: "Ketuk tab ini untuk mengganti model 3D furniture yang ingin Anda proyeksikan ke ruangan."
    },
    {
      selector: '[data-tour="ar-tab-material"]',
      title: "Ubah Material Rangka",
      description: "Sesuaikan jenis finishing kayu atau logam dari furniture agar serasi dengan nuansa interior Anda."
    },
    {
      selector: '[data-tour="ar-tab-warna"]',
      title: "Ganti Warna Kain",
      description: "Eksplorasi berbagai pilihan warna dan tekstur kain pelapis untuk mendapatkan kombinasi yang sempurna."
    }
  ],
  "/wishlist": [
    {
      selector: '[data-tour="wishlist-title"]',
      title: "Wishlist Saya",
      description: "Semua furniture pilihan Anda disimpan di sini. Anda dapat langsung membuka detailnya atau menghapusnya jika berubah pikiran."
    }
  ]
});

// Helper to match routes with parameters (e.g. /products/:slug)
const matchRoute = (pattern, path) => {
  const regexStr = "^" + pattern.replace(/:[a-zA-Z0-9_]+/g, "[^/]+") + "$";
  const regex = new RegExp(regexStr);
  return regex.test(path);
};

// Helper to check if screen is tablet or mobile, or user-agent matches
const isMobileDevice = () => {
  return (
    /Android|iPhone|iPad|iPod/i.test(navigator.userAgent) ||
    window.innerWidth < 1024
  );
};

export default function OnboardingTour() {
  const location = useLocation();
  const [isActive, setIsActive] = useState(false);
  const [activeStep, setActiveStep] = useState(0);
  const [highlightRect, setHighlightRect] = useState(null);
  const [isMobile, setIsMobile] = useState(isMobileDevice());
  const clickedStepRef = useRef(null);

  // Listen to resize events to update mobile status dynamically
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(isMobileDevice());
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const stepsData = getTourSteps(isMobile);

  // Find matching tour pattern
  const activePattern = Object.keys(stepsData).find((pattern) =>
    matchRoute(pattern, location.pathname)
  );
  const currentSteps = activePattern ? stepsData[activePattern] : [];

  // Check if tour should run automatically for the current page
  useEffect(() => {
    if (activePattern && currentSteps.length > 0) {
      // Disable AR visualizer tour on desktop devices
      if (activePattern === "/products/:slug/ar" && !isMobileDevice()) {
        setIsActive(false);
        return;
      }

      const isVisited = localStorage.getItem(`visited_tour_${activePattern}`);
      if (!isVisited) {
        // Delay slightly for content loading and transitions
        const timer = setTimeout(() => {
          // Force scroll to top to ensure header is visible before starting tour
          window.scrollTo({ top: 0, behavior: 'smooth' });
          
          setTimeout(() => {
            setIsActive(true);
            setActiveStep(0);
          }, 300);
        }, 1000);
        return () => clearTimeout(timer);
      }
    }
    setIsActive(false);
  }, [location.pathname, activePattern, currentSteps.length]);

  // Handle spotlight coordinate tracking
  useEffect(() => {
    if (!isActive || currentSteps.length === 0 || activeStep >= currentSteps.length) return;

    let animId;
    const updateCoords = () => {
      const step = currentSteps[activeStep];
      if (step?.selector) {
        const el = document.querySelector(step.selector);
        if (el) {
          const r = el.getBoundingClientRect();
          setHighlightRect({
            x: r.left,
            y: r.top,
            w: r.width,
            h: r.height
          });
        } else {
          setHighlightRect(null);
        }
      } else {
        setHighlightRect(null);
      }
      animId = requestAnimationFrame(updateCoords);
    };

    updateCoords();
    return () => cancelAnimationFrame(animId);
  }, [isActive, activeStep, currentSteps]);

  // Scroll element into view when active step changes
  useEffect(() => {
    if (!isActive || currentSteps.length === 0 || activeStep >= currentSteps.length) return;
    
    const step = currentSteps[activeStep];
    if (step?.selector) {
      setTimeout(() => {
        const el = document.querySelector(step.selector);
        if (el) {
          // Skip scrolling for the mobile drawer item since it's fixed and animating
          if (step.selector === '[data-tour="header-atelier-mobile"]') return;
          
          // If it's a header item, scroll to top instead of center to avoid hiding the header
          if (step.selector.includes('header-')) {
            window.scrollTo({ top: 0, behavior: "smooth" });
          } else {
            el.scrollIntoView({ behavior: "smooth", block: "center" });
          }
        }
      }, 50);
    }
  }, [activeStep, isActive, currentSteps]);

  // Control scroll and click inputs during active tour
  useEffect(() => {
    if (!isActive) return;

    document.body.classList.add("tour-active");

    const preventClicks = (e) => {
      // Allow clicks on the tooltip card
      const isTooltip = e.target.closest('[data-tour-tooltip="true"]');
      
      // Also allow clicks on the active highlighted element (if any)
      const step = currentSteps[activeStep];
      const isHighlighted = step?.selector && e.target.closest(step.selector);

      // Also allow clicks on the hamburger menu button and the mobile close button during the tour
      const isMenuToggle = e.target.closest('[data-tour="header-hamburger"]') || 
                           e.target.closest('[aria-label="Tutup menu"]');

      if (isTooltip || isHighlighted || isMenuToggle) {
        return;
      }

      e.preventDefault();
      e.stopPropagation();
    };

    // Intercept clicks at the window level (capturing phase) to prevent interaction with the page
    window.addEventListener("click", preventClicks, { capture: true });

    return () => {
      document.body.classList.remove("tour-active");
      window.removeEventListener("click", preventClicks, { capture: true });
    };
  }, [isActive, activeStep, currentSteps]);

  // Handle mobile drawer opening/closing automatically during the tour
  useEffect(() => {
    if (!isActive || !isMobile || currentSteps.length === 0 || activeStep >= currentSteps.length) {
      // If tour ends, make sure drawer is closed
      if (!isActive && isMobile) {
        const closeBtn = document.querySelector('[aria-label="Tutup menu"]');
        const atelierMobile = document.querySelector('[data-tour="header-atelier-mobile"]');
        const isDrawerOpen = atelierMobile && atelierMobile.getBoundingClientRect().left < window.innerWidth;
        if (isDrawerOpen && closeBtn) {
          closeBtn.click();
        }
      }
      return;
    }

    const step = currentSteps[activeStep];
    const isAtelierMobileStep = step?.selector === '[data-tour="header-atelier-mobile"]';
    const isArTab = step?.selector?.startsWith('[data-tour="ar-tab-');

    if (isAtelierMobileStep) {
      // Ensure drawer is open
      const atelierMobile = document.querySelector('[data-tour="header-atelier-mobile"]');
      const isDrawerOpen = atelierMobile && atelierMobile.getBoundingClientRect().left < window.innerWidth;
      
      if (!isDrawerOpen) {
        const hamburger = document.querySelector('[data-tour="header-hamburger"]');
        if (hamburger) {
          hamburger.click();
        }
      }
    } else if (isArTab) {
      if (clickedStepRef.current !== activeStep) {
        const tabBtn = document.querySelector(step.selector);
        if (tabBtn) tabBtn.click();
        clickedStepRef.current = activeStep;
      }
    } else {
      // Ensure drawer is closed for other steps
      const atelierMobile = document.querySelector('[data-tour="header-atelier-mobile"]');
      const isDrawerOpen = atelierMobile && atelierMobile.getBoundingClientRect().left < window.innerWidth;
      const closeBtn = document.querySelector('[aria-label="Tutup menu"]');
      
      if (isDrawerOpen && closeBtn) {
        closeBtn.click();
      }
    }
  }, [activeStep, isActive, isMobile, currentSteps]);

  const handleStartTour = () => {
    setIsActive(true);
    setActiveStep(0);
    clickedStepRef.current = null;
  };

  const handleNext = () => {
    if (activeStep < currentSteps.length - 1) {
      setActiveStep((prev) => prev + 1);
    } else {
      handleComplete();
    }
  };

  const handlePrev = () => {
    if (activeStep > 0) {
      setActiveStep((prev) => prev - 1);
    }
  };

  const handleSkip = () => {
    handleComplete();
  };

  const handleComplete = () => {
    if (activePattern) {
      localStorage.setItem(`visited_tour_${activePattern}`, "true");
    }
    setIsActive(false);
  };

  // Get absolute coords for placement of tooltip card
  const getTooltipStyle = () => {
    const viewportW = window.innerWidth;
    const viewportH = window.innerHeight;
    const tooltipWidth = Math.min(360, viewportW - 32);

    if (!highlightRect) {
      return {
        position: "fixed",
        top: "50%",
        bottom: "auto",
        left: "50%",
        transform: "translate(-50%, -50%)",
        width: `${tooltipWidth}px`
      };
    }

    const padding = 12;
    const targetX = highlightRect.x;
    const targetY = highlightRect.y;
    const targetW = highlightRect.w;
    const targetH = highlightRect.h;

    // Ideal left calculation (centered relative to target, clamped to viewport)
    const idealLeft = targetX + targetW / 2 - tooltipWidth / 2;
    const left = `${Math.max(16, Math.min(viewportW - tooltipWidth - 16, idealLeft))}px`;

    // Space checks
    const spaceBelow = viewportH - (targetY + targetH);
    const spaceAbove = targetY;

    // Estimated height of the tooltip (around 220px)
    const estTooltipHeight = 220;

    // If the target is very large or space is tight on both top and bottom
    if (targetH > viewportH * 0.6 || (spaceBelow < estTooltipHeight && spaceAbove < estTooltipHeight)) {
      // Position fixed at the bottom of the screen
      return {
        position: "fixed",
        top: "auto",
        bottom: "24px",
        left: "50%",
        transform: "translateX(-50%)",
        width: `${tooltipWidth}px`,
        zIndex: 10000
      };
    }

    let top;
    let transform = "";

    if (spaceBelow >= estTooltipHeight) {
      top = `${targetY + targetH + padding}px`;
    } else if (spaceAbove >= estTooltipHeight) {
      top = `${targetY - padding}px`;
      transform = "translateY(-100%)";
    } else {
      // Fallback: place where there is more space
      if (spaceBelow > spaceAbove) {
        top = `${targetY + targetH + padding}px`;
      } else {
        top = `${targetY - padding}px`;
        transform = "translateY(-100%)";
      }
    }

    return {
      position: "fixed",
      top,
      bottom: "auto",
      left,
      transform,
      width: `${tooltipWidth}px`,
      zIndex: 10000
    };
  };

  // Skip rendering if no tour pattern matched, or if it's the AR page on a non-mobile device
  const shouldShowTourSystem = activePattern && currentSteps.length > 0 && !(activePattern === "/products/:slug/ar" && !isMobileDevice());

  if (!shouldShowTourSystem) return null;

  return (
    <>
      {/* ── Floating Help/Replay Button ───────────────────────────────── */}
      {!isActive && (
        <button
          onClick={handleStartTour}
          style={{ bottom: "calc(1.5rem + var(--bottom-panel-height, 0px))" }}
          className="fixed right-6 z-40 flex items-center gap-2.5 rounded-full border border-[#e4ddd2] bg-[#f5f3ef]/95 backdrop-blur-md px-5 py-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#1a1a1a] shadow-xl transition-[bottom,transform,background-color] duration-500 ease-[cubic-bezier(0.2,0.8,0.2,1)] hover:bg-[#1a1a1a] hover:text-[#f5f3ef] hover:border-[#1a1a1a] hover:scale-105 active:scale-95 shadow-[#1a1a1a]/5"
          aria-label="Mulai Panduan Penggunaan"
        >
          <HelpCircle size={15} className="text-current transition-colors duration-300" />
          <span>Panduan</span>
        </button>
      )}

      {/* ── Tour Active Overlay + Dialog ───────────────────────────────── */}
      {isActive && (
        <div className="fixed inset-0 z-[9999] pointer-events-none">
          {/* Spotlight overlay using SVG mask (pointer-events-none so scrolling works) */}
          <svg className="absolute inset-0 h-full w-full pointer-events-none">
            <defs>
              <mask id="onboarding-cutout-mask">
                <rect x="0" y="0" width="100%" height="100%" fill="white" />
                {highlightRect && (
                  <rect
                    x={highlightRect.x - 8}
                    y={highlightRect.y - 8}
                    width={highlightRect.w + 16}
                    height={highlightRect.h + 16}
                    rx="12"
                    ry="12"
                    fill="black"
                  />
                )}
              </mask>
            </defs>
            <rect
              x="0"
              y="0"
              width="100%"
              height="100%"
              fill="rgba(26, 26, 26, 0.7)"
              mask="url(#onboarding-cutout-mask)"
            />
          </svg>

          {/* Dialog popup card */}
          <div
            data-tour-tooltip="true"
            style={getTooltipStyle()}
            className="pointer-events-auto flex flex-col rounded-3xl border border-[#e4ddd2] bg-white p-5 shadow-2xl transition-all duration-300 sm:p-6 md:p-7"
          >
            {/* Header / Step Progress */}
            <div className="mb-5 flex items-center justify-between">
              <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#9a9389]">
                Langkah {activeStep + 1} dari {currentSteps.length}
              </span>
              <button
                onClick={handleSkip}
                className="rounded-full p-1 text-[#8f877c] hover:bg-neutral-100 hover:text-[#1a1a1a] transition-colors cursor-pointer"
                title="Lewati panduan"
              >
                <X size={14} />
              </button>
            </div>

            {/* Title & Desc */}
            <h3 className="font-cormorant text-xl font-medium leading-tight text-[#1a1a1a] mb-3">
              {currentSteps[activeStep].title}
            </h3>
            <p className="font-dmsans text-[13px] leading-relaxed text-[#736c63] mb-6">
              {currentSteps[activeStep].description}
            </p>

            {/* Actions Footer */}
            <div className="flex items-center justify-between mt-auto flex-shrink-0">
              <button
                onClick={handleSkip}
                className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[#9a9389] hover:text-[#1a1a1a] transition-colors cursor-pointer mr-4 flex-shrink-0"
              >
                Lewati
              </button>
              
              <div className="flex items-center gap-2 flex-shrink-0">
                {activeStep > 0 && (
                  <button
                    onClick={handlePrev}
                    className="flex h-8 items-center gap-1 rounded-full border border-[#e4ddd2] bg-transparent px-4 text-[10px] font-semibold uppercase tracking-[0.16em] text-[#736c63] hover:text-[#1a1a1a] hover:bg-[#f5f3ef]/50 transition-colors cursor-pointer flex-shrink-0"
                  >
                    <ChevronLeft size={12} />
                    Kembali
                  </button>
                )}
                
                <button
                  onClick={handleNext}
                  className="flex h-8 items-center gap-1 rounded-full bg-[#1a1a1a] px-4 text-[10px] font-semibold uppercase tracking-[0.16em] text-[#f5f3ef] hover:bg-[#2c2722] transition-colors cursor-pointer shadow-md shadow-[#1a1a1a]/10 flex-shrink-0"
                >
                  <span>
                    {activeStep === currentSteps.length - 1 ? "Selesai" : "Lanjut"}
                  </span>
                  {activeStep < currentSteps.length - 1 && <ChevronRight size={12} />}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
