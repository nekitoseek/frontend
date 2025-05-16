import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { login } from "../api/auth";
import { useAuth } from "../context/AuthContext";
import { getCurrentUser } from "../api/auth";

export default function Login() {
    const [formData, setFormData] = useState({username: '', password: ''});
    const navigate = useNavigate();
    const { setUser } = useAuth();

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({...formData, [event.target.name]: event.target.value});
    };

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();

        const data = new URLSearchParams();
        data.append('username', formData.username);
        data.append('password', formData.password);

        try {
            const res = await login(data);
            localStorage.setItem('token', res.data.access_token);
            const me = await getCurrentUser();
            setUser(me);
            navigate('/queues');
        } catch (err: unknown) {
            alert("Ошибка входа");
            console.error(err);
        }
    };

    return (
        <>
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-sky-50 via-white to-purple-50 px-4">
                <div className="bg-white shadow-xl rounded-2xl p-8 w-full max-w-md border border-gray-100">
                    <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Вход в систему</h2>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <input
                            type="text"
                            name="username"
                            placeholder="Логин"
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-sky-400 outline-none transition"
                        />
                        <input
                            type="password"
                            name="password"
                            placeholder="Пароль"
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-sky-400 outline-none transition"
                        />
                        <button
                            type="submit"
                            className="w-full bg-sky-600 hover:bg-sky-700 text-white font-medium py-3 rounded-xl shadow transition"
                        >
                            Войти
                        </button>
                    </form>
                    <p className="text-center text-sm text-gray-500 mt-6">
                        Еще не зарегистрированы? {" "}
                        <Link to="/register" className="text-sky-600 hover:underline">
                            Зарегистрироваться
                        </Link>
                    </p>
                </div>
            </div>
        </>
    );
}