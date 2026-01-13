import { useWebAppStore } from "@/store";
import { Navigate, Outlet } from "react-router-dom";

export const AuthenticatedRoute = () => {
  const { user } = useWebAppStore();
  return user && user.isRegister ? <Outlet /> : <Navigate to="/registration" replace />;
};
