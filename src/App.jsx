import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import LivingCollections from "./pages/LivingCollection";
import ProductAR from "./pages/ProductAR";
import ProductDetail from "./pages/ProductDetail";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/products" element={<LivingCollections />} />
        <Route path="/products/:slug/ar" element={<ProductAR />} />
        <Route path="/products/:slug" element={<ProductDetail />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
