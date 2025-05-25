import {Link, useLocation, useNavigate} from "react-router-dom";
import {useAuth} from "../context/AuthContext.tsx";

export default function Header() {
    const {user, setUser} = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const handleLogout = () => {
        localStorage.removeItem("token");
        setUser(null);
        navigate("/");
    };

    return (
        <>
            <header className="bg-white/60 backdrop-blur-md shadow-sm inset-x-0">
                <div className="max-w-7xl mx-auto px-4 py-5 flex justify-between items-center">
                    <Link to="/" className="text-xl font-semibold text-gray-800 hover:text-gray-900 transition">
                        Электронные очереди
                    </Link>
                    {user ? (
                        <nav className="flex items-center space-x-4 text-sm sm:text-base text-gray-700">
                            {location.pathname !== "/queues" && (
                                <Link to="/queues" className="hover:text-gray-900 transition">Очереди</Link>
                            )}
                            {location.pathname !== "/admin" && user?.username === "admin" && (
                                <Link to="/admin" className="hover:text-gray-900 transition">Админ-панель</Link>
                            )}
                            <Link to="/profile"
                                  className="font-medium text-sky-700 hover:underline underline-offset-4 transition">
                                {user?.full_name}
                            </Link>
                            <button
                                onClick={handleLogout}
                                className="bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium py-1.5 px-4 rounded-xl transition shadow-sm"
                            >
                                Выйти
                            </button>
                        </nav>
                    ) : (
                        <nav className="space-x-4 text-sm sm:text-base font-medium text-gray-700">
                            <Link to="/login">
                                <button
                                    className="bg-sky-600 hover:bg-sky-700 text-white py-2 px-4 rounded-xl transition">Войти
                                </button>
                            </Link>
                            <Link to="/register">
                                <button
                                    className="bg-white hover:bg-gray-100 border border-gray-300 shadow-sm py-2 px-4 rounded-xl transition">Зарегистрироваться
                                </button>
                            </Link>
                        </nav>
                    )}
                </div>
            </header>
        </>
    );
}