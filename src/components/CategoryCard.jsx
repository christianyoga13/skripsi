export default function CategoryCard({ title, subtitle, image }) {
  return (
    <div className="group overflow-hidden rounded-[20px] border border-[#e4ddd2] bg-[#f8f6f2] shadow-[0_24px_60px_rgba(26,26,26,0.05)] sm:rounded-[28px]">
      <img
        src={image}
        alt={title}
        className="h-48 w-full object-cover transition duration-500 group-hover:scale-105 sm:h-72"
      />
      <div className="p-4 text-left sm:p-6">
        <p className="text-[10px] uppercase tracking-[0.24em] text-[#9a9389] sm:text-[11px]">
          Curated Space
        </p>
        <h3 className="mt-2 font-cormorant text-3xl leading-none text-[#1a1a1a] sm:mt-3 sm:text-4xl">
          {title}
        </h3>
        <p className="mt-2 text-sm text-[#736c63] sm:mt-3">{subtitle}</p>
      </div>
    </div>
  );
}
