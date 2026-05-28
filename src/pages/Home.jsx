import Header from "../components/Header";
import interiorImg from "../assets/interior design.webp";
import CategoryCard from "../components/CategoryCard";
import ProductCard from "../components/ProductCard";
import { products } from "../data/products";
import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div className="min-h-screen bg-[#f5f3ef]">
      <Header />

      <main>
        <section className="relative mt-20 h-[90vh] overflow-hidden">
          <img
            src={interiorImg}
            alt="Interior Design"
            className="absolute inset-0 h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-black/40" />
          <div className="absolute inset-0 flex items-center p-4 text-center text-white">
            <div className="relative flex h-full max-w-2xl flex-col justify-center px-12 text-white">
              <span className="mb-4 block text-start font-cormorant text-6xl font-medium leading-none">
                The Art of Living: Where Design Meets Lifestyle
              </span>
              <p className="text-start text-lg font-dmsans">
                Discover the perfect blend of aesthetics and functionality in our
                curated collection of home furnishings.
              </p>
            </div>
          </div>
        </section>
        <section className="py-16">
          <div className="mx-auto max-w-7xl space-y-6 px-2">
            <div className="grid gap-6 lg:grid-cols-[1.7fr_0.5fr]">
              <CategoryCard
                title="Living Room"
                subtitle="Elevate your relaxation space"
                image={interiorImg}
              />
              <CategoryCard
                title="Bedroom"
                subtitle="Create your sanctuary"
                image={interiorImg}
              />
            </div>
            <div className="grid gap-6 lg:grid-cols-[0.8fr_1.4fr]">
              <CategoryCard
                title="Dining Room"
                subtitle="Gather in style"
                image={interiorImg}
              />
              <CategoryCard
                title="Office"
                subtitle="Boost your productivity"
                image={interiorImg}
              />
            </div>
          </div>
        </section>
        <section className="flex h-[60vh] w-full items-center justify-center bg-[#1f1f1f] py-16 text-white">
          <div className="flex flex-row items-center gap-16">
            <div>
              <p>Innovation</p>
              <h1 className="font-cormorant text-5xl font-medium">
                Measures with Light
              </h1>
              <p className="w-80">
                Experience our collection in your space before it arrives. Our
                proprietary 3D visualization and AR technology allow for
                millimeter-perfect placement and lighting simulation.
              </p>
              <div className="mt-8 flex flex-row">
                <button className="bg-blue-600 px-6">Test</button>
                <button className="ml-4 border border-white px-6">
                  Learn More
                </button>
              </div>
            </div>
            <div>
              <img src={interiorImg} alt="Interior Design" className="h-96" />
            </div>
          </div>
        </section>
        <section className="py-16">
          <div className="mx-auto max-w-7xl">
            <h1 className="font-cormorant text-5xl font-medium text-[#1a1a1a]">
              The Permanent Collection
            </h1>
            <div className="flex w-full flex-row items-center justify-between">
              <p className="mt-2">
                Foundational pieces build to endure generations
              </p>
              <Link to="/products" className="border-b border-[#1a1a1a] pb-1">
                Shop All Products
              </Link>
            </div>
            <div className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-2 xl:grid-cols-4">
              {products.slice(0, 4).map((product) => (
                <ProductCard
                  key={product.id}
                  title={product.name}
                  price={`$${product.price.toLocaleString()}.00`}
                  image={product.image}
                  to={`/products/${product.slug}`}
                />
              ))}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
