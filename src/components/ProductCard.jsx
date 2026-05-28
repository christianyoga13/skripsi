import { Link } from "react-router-dom";

export default function ProductCard({ title, price, image, to }) {
  const content = (
    <>
      <div className="card-img-wrap relative overflow-hidden rounded-[24px] bg-[#ede9e3]">
        <span className="absolute left-3 top-3 z-10 rounded-full bg-white/90 px-3 py-1 text-[10px] font-medium uppercase tracking-[0.16em] text-[#1a1a1a]">
          3D Ready
        </span>
        <img
          src={image}
          alt={title}
          className="aspect-[4/5] w-full object-cover transition-transform duration-300"
        />
      </div>
      <div className="mt-4 flex items-start justify-between gap-3">
        <h3 className="font-cormorant text-[28px] leading-none text-[#1a1a1a]">
          {title}
        </h3>
        <p className="whitespace-nowrap pt-1 text-sm font-medium text-[#1a1a1a]">
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
