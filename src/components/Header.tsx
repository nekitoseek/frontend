import {useState} from "react";
import {Link, useLocation, useNavigate} from "react-router-dom";
import {useAuth} from "../context/AuthContext";

export default function Header() {
    const {user, setUser} = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const [menuOpen, setMenuOpen] = useState(false);

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
                    <button
                        className="sm:hidden text-gray-800 focus:outline-none"
                        onClick={() => setMenuOpen(!menuOpen)}
                        aria-label="Открыть меню"
                    >
                        <svg
                            className="w-6 h-6"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth={2}
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            {menuOpen ? (
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"/>
                            ) : (
                                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16"/>
                            )}
                        </svg>
                    </button>
                    {user ? (
                        <nav className="hidden sm:flex items-center space-x-4 text-sm sm:text-base text-gray-700">
                            {location.pathname !== "/queues" && (
                                <Link to="/queues" className="hover:text-gray-900 transition">Очереди</Link>
                            )}
                            {location.pathname !== "/admin" && user?.is_admin && (
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
                        <nav className="hidden sm:flex space-x-4 text-sm sm:text-base font-medium text-gray-700">
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
                {menuOpen && (
                    <div
                        className="sm:hidden bg-white border-t border-gray-200 shadow-md px-4 py-4 space-y-3 text-sm text-gray-700">
                        {user ? (
                            <>
                                {location.pathname !== "/queues" && (
                                    <Link to="/queues" className="block"
                                          onClick={() => setMenuOpen(false)}>Очереди</Link>
                                )}
                                {location.pathname !== "/admin" && user?.is_admin && (
                                    <Link to="/admin" className="block"
                                          onClick={() => setMenuOpen(false)}>Админ-панель</Link>
                                )}
                                <Link to="/profile" className="block" onClick={() => setMenuOpen(false)}>
                                    {user?.full_name}
                                </Link>
                                <button
                                    onClick={() => {
                                        setMenuOpen(false);
                                        handleLogout();
                                    }}
                                    className="text-left text-red-600 hover:text-red-700 transition text-sm font-medium"
                                >
                                    Выйти
                                </button>
                            </>
                        ) : (
                            <>
                                <Link to="/login" className="block" onClick={() => setMenuOpen(false)}>
                                    <button
                                        className="w-full bg-sky-600 hover:bg-sky-700 text-white py-2 px-4 rounded-xl transition">Войти
                                    </button>
                                </Link>
                                <Link to="/register" className="block" onClick={() => setMenuOpen(false)}>
                                    <button
                                        className="w-full bg-white hover:bg-gray-100 border border-gray-300 shadow-sm py-2 px-4 rounded-xl transition">Зарегистрироваться
                                    </button>
                                </Link>
                            </>
                        )}
                    </div>
                )}
            </header>
        </>
    );
}