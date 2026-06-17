import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/useAuth";

export default function ProtectedRoute({ children }) {
  const { loading, user } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f5f3ef] text-[#1a1a1a]">
        <div className="h-10 w-10 animate-spin rounded-full border border-[#d8d0c4] border-t-[#1a1a1a]" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return children;
}
