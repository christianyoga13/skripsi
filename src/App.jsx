import { BrowserRouter, Route, Routes } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";
import { AuthProvider } from "./context/AuthContext";
import Account from "./pages/Account";
import Home from "./pages/Home";
import LivingCollections from "./pages/LivingCollection";
import Login from "./pages/Login";
import ProductAR from "./pages/ProductAR";
import ProductDetail from "./pages/ProductDetail";
import Register from "./pages/Register";
import Workspaces from "./pages/Workspaces";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/products" element={<LivingCollections />} />
          <Route path="/products/:slug/ar" element={<ProductAR />} />
          <Route path="/products/:slug" element={<ProductDetail />} />
          <Route path="/workspaces" element={<Workspaces />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/account"
            element={
              <ProtectedRoute>
                <Account />
              </ProtectedRoute>
            }
          />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
