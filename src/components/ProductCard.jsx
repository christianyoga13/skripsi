import { Link } from "react-router-dom";

export default function ProductCard({ title, image, to }) {
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
      <div className="mt-3 sm:mt-4">
        <h3 className="truncate font-cormorant text-[22px] leading-none text-[#1a1a1a] sm:text-[28px]">
          {title}
        </h3>
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
