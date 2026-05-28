export default function CategoryCard({ title, subtitle, image }) {
  return (
    <div className="group overflow-hidden rounded-[28px] border border-[#e4ddd2] bg-[#f8f6f2] shadow-[0_24px_60px_rgba(26,26,26,0.05)]">
      <img
        src={image}
        alt={title}
        className="h-72 w-full object-cover transition duration-500 group-hover:scale-105"
      />
      <div className="p-6 text-left">
        <p className="text-[11px] uppercase tracking-[0.24em] text-[#9a9389]">
          Curated Space
        </p>
        <h3 className="mt-3 font-cormorant text-4xl leading-none text-[#1a1a1a]">
          {title}
        </h3>
        <p className="mt-3 text-sm text-[#736c63]">{subtitle}</p>
      </div>
    </div>
  );
}
