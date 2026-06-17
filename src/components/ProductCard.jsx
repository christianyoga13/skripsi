import { Link } from "react-router-dom";

export default function ProductCard({ title, price, image, to }) {
  const content = (
    <>
      <div className="card-img-wrap relative overflow-hidden rounded-[18px] bg-[#ede9e3] sm:rounded-[24px]">
        <span className="absolute left-2.5 top-2.5 z-10 rounded-full bg-white/90 px-2 py-0.5 text-[9px] font-medium uppercase tracking-[0.14em] text-[#1a1a1a] sm:left-3 sm:top-3 sm:px-3 sm:py-1 sm:text-[10px]">
          3D Ready
        </span>
        <img
          src={image}
          alt={title}
          className="aspect-[4/5] w-full object-cover transition-transform duration-300"
        />
      </div>
      <div className="mt-3 flex items-start justify-between gap-2 sm:mt-4 sm:gap-3">
        <h3 className="min-w-0 truncate font-cormorant text-[22px] leading-none text-[#1a1a1a] sm:text-[28px]">
          {title}
        </h3>
        <p className="shrink-0 whitespace-nowrap pt-1 text-[13px] font-medium text-[#1a1a1a] sm:text-sm">
          {price}
        </p>
      </div>
    </>
  );

  return (
    <article className="product-card min-w-0 cursor-pointer">
      {to ? (
        <Link to={to} className="block">
          {content}
        </Link>
      ) : (
        content
      )}
    </article>
  );
}
