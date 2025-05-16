import { useAuth } from "../context/AuthContext";
import { Navigate, useLocation } from "react-router-dom";
import { JSX } from "react";

export default function RequireAuth({ children }: { children: JSX.Element }) {
    const { user, loading } = useAuth();
    const location = useLocation();

    if (loading) return null;

    const guestPaths = ["/", "/login", "/register"];

    if (!user && !guestPaths.includes(location.pathname)) {
        return <Navigate to="/" state={{ from: location }} replace />
    }
    return children;
}