import {useAuth} from "../context/AuthContext";
import {Navigate, useLocation} from "react-router-dom";
import {JSX} from "react";

export default function RequireAuth({children}: { children: JSX.Element }) {
    const {user, loading} = useAuth();
    const location = useLocation();

    if (loading) return null;

    const isAdminRoute = location.pathname.startsWith("/admin");

    if (!user) {
        return <Navigate to="/" state={{from: location}} replace/>
    }

    if (isAdminRoute && !user.is_admin) {
        return <Navigate to="/" replace/>;
    }
    return children;
}