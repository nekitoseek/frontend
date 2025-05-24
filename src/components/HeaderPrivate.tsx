import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function HeaderPrivate() {
    const { user, setUser } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const handleLogout = () => {
        localStorage.removeItem("token");
        setUser(null);
        navigate("/");
    };

    return (
        <>
            <header className="bg-white/60 backdrop-blur-md border-b border-gray-200 shadow-sm inset-x-0 z-50">
                <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
                    <Link to="/" className="text-xl font-semibold text-gray-800 hover:text-gray-900 transition">Электронные очереди</Link>
                    <nav className="flex items-center space-x-4 text-sm sm:text-base text-gray-700">
                        {location.pathname !== "/queues" && (
                            <Link to="/queues" className="hover:text-gray-900 transition">Очереди</Link>
                        )}
                        {location.pathname !== "/admin" && user?.username === "admin" && (
                            <Link to="/admin" className="hover:text-gray-900 transition">Админ-панель</Link>
                        )}
                        <Link to="/profile" className="font-medium text-sky-700 hover:underline underline-offset-4 transition">
                            {user?.full_name}
                        </Link>
                        <button
                            onClick={handleLogout}
                            className="bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium py-1.5 px-4 rounded-xl transition shadow-sm"
                        >
                            Выйти
                        </button>
                    </nav>
                </div>
            </header>
        </>
    );
}