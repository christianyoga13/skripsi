import { HashRouter, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import LivingCollections from "./pages/LivingCollection";
import ProductAR from "./pages/ProductAR";
import ProductDetail from "./pages/ProductDetail";
import Wishlist from "./pages/Wishlist";
import { WishlistProvider } from "./context/WishlistContext";
import OnboardingTour from "./components/OnboardingTour";

function App() {
  return (
    <WishlistProvider>
      <HashRouter>
        <OnboardingTour />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/products" element={<LivingCollections />} />
          <Route path="/products/:slug/ar" element={<ProductAR />} />
          <Route path="/products/:slug" element={<ProductDetail />} />
          <Route path="/wishlist" element={<Wishlist />} />
        </Routes>
      </HashRouter>
    </WishlistProvider>
  );
}

export default App;
