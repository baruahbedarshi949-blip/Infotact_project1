import { useStore } from "../store/useStore";
import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children }) {
  const { user } = useStore();

  if (!user) {
    return <Navigate to="/login" />;
  }

  return children;
}