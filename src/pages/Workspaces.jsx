import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Layers, Trash2, Edit3, Check, X, Camera, Clock, Package, ArrowRight, Plus } from "lucide-react";
import Header from "../components/Header";
import { loadWorkspaces, deleteWorkspace, renameWorkspace } from "../lib/workspaceStorage";

// ─── Model labels ──────────────────────────────────────────────────────────────

const MODEL_LABELS = {
  sofa:      "Sofa",
  table:     "Meja Makan",
  coffeetbl: "Meja Kopi",
  bed:       "Kasur 1",
  bed1:      "Kasur 2",
  desk:      "Meja Belajar",
  desk1:     "Meja Kerja",
  cupboard:  "Lemari",
  cupboard1: "Lemari 2",
  wardrobe:  "Wardrobe",
  wardrobe1: "Wardrobe 2",
  dining1:   "Meja Makan 1",
  dining2:   "Meja Makan 2",
  dining3:   "Meja Makan 3",
  table1:    "Meja Makan Alt",
};

// ─── Relative date ─────────────────────────────────────────────────────────────

function relativeDate(iso) {
  const diff = Date.now() - new Date(iso).getTime();
  const min  = Math.floor(diff / 60000);
  const hr   = Math.floor(diff / 3600000);
  const day  = Math.floor(diff / 86400000);
  if (min < 1)  return "Baru saja";
  if (min < 60) return `${min} menit lalu`;
  if (hr  < 24) return `${hr} jam lalu`;
  if (day < 30) return `${day} hari lalu`;
  return new Date(iso).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" });
}

// ─── Object summary pills ──────────────────────────────────────────────────────

function ObjectPills({ objects }) {
  const counts = {};
  objects.forEach(({ modelId }) => { counts[modelId] = (counts[modelId] || 0) + 1; });
  return (
    <div className="flex flex-wrap gap-1.5">
      {Object.entries(counts).map(([id, n]) => (
        <span
          key={id}
          className="rounded-full border border-[#e0dbd2] bg-[#f5f3ef] px-2.5 py-0.5 text-[9px] font-medium uppercase tracking-[0.14em] text-[#7d766d]"
        >
          {n}× {MODEL_LABELS[id] ?? id}
        </span>
      ))}
    </div>
  );
}

// ─── Empty state ───────────────────────────────────────────────────────────────

function EmptyState({ onGoToProducts }) {
  return (
    <div className="flex flex-col items-center gap-6 rounded-[28px] border border-dashed border-[#d9d1c6] bg-white/60 px-8 py-16 text-center">
      <div className="flex h-20 w-20 items-center justify-center rounded-full border border-[#e0dbd2] bg-[#f5f3ef]">
        <Layers size={32} strokeWidth={1.4} className="text-[#b5ad9f]" />
      </div>
      <div>
        <h2 className="font-cormorant text-3xl text-[#1a1a1a]">Belum ada layout tersimpan</h2>
        <p className="mt-2 text-sm leading-relaxed text-[#7d766d]">
          Buka mode AR di halaman produk, tata furniture, lalu tekan tombol{" "}
          <span className="font-medium text-[#1a1a1a]">Save</span> untuk menyimpan layout ruangan kamu.
        </p>
      </div>
      <button
        onClick={onGoToProducts}
        className="inline-flex items-center gap-2 rounded-full border border-[#1a1a1a] bg-[#1a1a1a] px-6 py-3 text-[11px] font-medium uppercase tracking-[0.18em] text-[#f5f3ef] transition-colors hover:bg-transparent hover:text-[#1a1a1a]"
      >
        <Plus size={14} />
        Lihat Produk
      </button>
    </div>
  );
}

// ─── Workspace Card ────────────────────────────────────────────────────────────

function WorkspaceCard({ ws, onOpen, onDelete, onRename }) {
  const [editing,   setEditing]   = useState(false);
  const [nameVal,   setNameVal]   = useState(ws.name);
  const [confirming, setConfirming] = useState(false);

  const submitRename = () => {
    const trimmed = nameVal.trim();
    if (trimmed && trimmed !== ws.name) onRename(ws.id, trimmed);
    setEditing(false);
  };

  return (
    <article className="group relative flex flex-col overflow-hidden rounded-[22px] border border-[#e4ddd2] bg-white shadow-[0_8px_30px_rgba(26,26,26,0.06)] transition-all duration-300 hover:shadow-[0_16px_48px_rgba(26,26,26,0.12)] hover:-translate-y-0.5">
      {/* Visual banner */}
      <div
        className="relative flex h-[140px] items-center justify-center overflow-hidden bg-gradient-to-br from-[#f0ece5] to-[#e8e2da]"
        onClick={onOpen}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => e.key === "Enter" && onOpen()}
        aria-label={`Buka layout ${ws.name} di AR`}
      >
        {/* Decorative 3D room silhouette */}
        <div className="pointer-events-none select-none opacity-20">
          <svg width="120" height="80" viewBox="0 0 120 80" fill="none">
            <rect x="10" y="40" width="45" height="30" rx="3" fill="#1a1a1a" />
            <rect x="65" y="50" width="45" height="22" rx="3" fill="#1a1a1a" />
            <rect x="20" y="30" width="30" height="12" rx="2" fill="#1a1a1a" opacity="0.6" />
          </svg>
        </div>

        {/* Object count badge */}
        <div className="absolute top-3 left-3 flex items-center gap-1.5 rounded-full border border-white/60 bg-white/80 px-2.5 py-1 text-[9px] font-medium uppercase tracking-[0.14em] text-[#555] backdrop-blur-sm">
          <Package size={10} />
          {ws.objects.length} objek
        </div>

        {/* Open AR overlay hover */}
        <div className="absolute inset-0 flex items-center justify-center bg-[#1a1a1a]/0 transition-all duration-300 group-hover:bg-[#1a1a1a]/12">
          <div className="flex translate-y-2 items-center gap-2 rounded-full bg-[#1a1a1a] px-4 py-2 text-[10px] font-medium uppercase tracking-[0.16em] text-white opacity-0 shadow-xl transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
            <Camera size={12} />
            Buka di AR
          </div>
        </div>
      </div>

      {/* Info */}
      <div className="flex flex-1 flex-col gap-3 p-4">
        {/* Name row */}
        <div className="flex items-start gap-2">
          {editing ? (
            <div className="flex flex-1 items-center gap-1.5">
              <input
                autoFocus
                value={nameVal}
                onChange={(e) => setNameVal(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter") submitRename(); if (e.key === "Escape") setEditing(false); }}
                className="flex-1 rounded-lg border border-[#d0cbc3] bg-[#f8f6f2] px-2.5 py-1 text-sm text-[#1a1a1a] outline-none focus:border-[#1a1a1a] transition-colors"
              />
              <button onClick={submitRename} className="text-emerald-600 hover:text-emerald-800 transition-colors"><Check size={14} /></button>
              <button onClick={() => { setEditing(false); setNameVal(ws.name); }} className="text-[#bbb] hover:text-[#666] transition-colors"><X size={14} /></button>
            </div>
          ) : (
            <>
              <h3 className="flex-1 font-cormorant text-xl leading-snug text-[#1a1a1a]">{ws.name}</h3>
              <button
                onClick={() => setEditing(true)}
                className="shrink-0 rounded-lg p-1 text-[#ccc] opacity-0 transition-all group-hover:opacity-100 hover:text-[#555]"
                aria-label="Rename"
              >
                <Edit3 size={13} />
              </button>
            </>
          )}
        </div>

        {/* Object pills */}
        <ObjectPills objects={ws.objects} />

        {/* Date + Actions */}
        <div className="mt-auto flex items-center justify-between gap-2 pt-1">
          <div className="flex items-center gap-1.5 text-[10px] text-[#aaa]">
            <Clock size={10} />
            {relativeDate(ws.createdAt)}
          </div>
          <div className="flex items-center gap-1">
            {confirming ? (
              <>
                <span className="text-[10px] text-[#d44]">Hapus?</span>
                <button onClick={() => { onDelete(ws.id); setConfirming(false); }} className="rounded-lg px-2 py-1 text-[10px] font-medium text-red-600 hover:bg-red-50 transition-colors">Ya</button>
                <button onClick={() => setConfirming(false)} className="rounded-lg px-2 py-1 text-[10px] font-medium text-[#999] hover:bg-[#f5f3ef] transition-colors">Batal</button>
              </>
            ) : (
              <button
                onClick={() => setConfirming(true)}
                className="rounded-lg p-1.5 text-[#ccc] opacity-0 transition-all group-hover:opacity-100 hover:text-red-400"
                aria-label="Delete"
              >
                <Trash2 size={13} />
              </button>
            )}
            <button
              onClick={onOpen}
              className="inline-flex items-center gap-1.5 rounded-full border border-[#1a1a1a] bg-[#1a1a1a] px-3 py-1.5 text-[9px] font-medium uppercase tracking-[0.14em] text-[#f5f3ef] transition-colors hover:bg-transparent hover:text-[#1a1a1a]"
            >
              Buka AR
              <ArrowRight size={10} />
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}

// ─── Page ──────────────────────────────────────────────────────────────────────

export default function Workspaces() {
  const navigate  = useNavigate();
  const [workspaces, setWorkspaces] = useState(() => loadWorkspaces());

  // Reload on focus (in case saved from AR in another tab)
  useEffect(() => {
    const refresh = () => setWorkspaces(loadWorkspaces());
    window.addEventListener("focus", refresh);
    return () => window.removeEventListener("focus", refresh);
  }, []);

  const handleOpen = (ws) => {
    // Navigate to AR with a generic slug (uses first product for back-link)
    // Pass workspace id as ?load= query param
    navigate(`/products/sofa/ar?load=${ws.id}`);
  };

  const handleDelete = (id) => {
    setWorkspaces(deleteWorkspace(id));
  };

  const handleRename = (id, newName) => {
    setWorkspaces(renameWorkspace(id, newName));
  };

  return (
    <div className="min-h-screen bg-[#f5f3ef] font-dmsans text-[#1a1a1a]">
      <Header />

      <div className="mx-auto w-full max-w-7xl px-4 pb-16 pt-24 sm:px-6 sm:pt-28 lg:px-8">

        {/* Page header */}
        <div className="mb-10 flex flex-col gap-4 border-b border-[#e0dbd2] pb-8 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="mb-2 text-[10px] font-medium uppercase tracking-[0.3em] text-[#8f877c]">
              AR Furniture
            </p>
            <h1 className="font-cormorant text-[42px] font-light leading-tight tracking-[-0.01em] text-[#1a1a1a] sm:text-[52px]">
              My Layouts
            </h1>
            <p className="mt-2 text-sm leading-relaxed text-[#7d766d]">
              Layout ruangan yang telah kamu simpan dari sesi AR.
            </p>
          </div>

          <div className="flex items-center gap-3">
            {/* Count badge */}
            <div className="rounded-2xl border border-[#e5dfd5] bg-white/70 px-5 py-4 text-center">
              <p className="text-[10px] uppercase tracking-[0.2em] text-[#9a9389]">Tersimpan</p>
              <p className="mt-1 font-cormorant text-3xl text-[#1a1a1a]">
                {String(workspaces.length).padStart(2, "0")}
              </p>
            </div>

            {/* Go to products button */}
            <button
              onClick={() => navigate("/products")}
              className="inline-flex items-center gap-2 rounded-full border border-[#1a1a1a] bg-[#1a1a1a] px-5 py-3 text-[10px] font-medium uppercase tracking-[0.18em] text-[#f5f3ef] transition-colors hover:bg-transparent hover:text-[#1a1a1a]"
            >
              <Plus size={13} />
              Layout Baru
            </button>
          </div>
        </div>

        {/* Grid or empty */}
        {workspaces.length === 0 ? (
          <EmptyState onGoToProducts={() => navigate("/products")} />
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {workspaces.map((ws) => (
              <WorkspaceCard
                key={ws.id}
                ws={ws}
                onOpen={() => handleOpen(ws)}
                onDelete={handleDelete}
                onRename={handleRename}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
