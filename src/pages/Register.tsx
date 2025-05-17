import { useEffect, useState } from 'react';
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getGroups } from "../api/groups";

type Group = {
    id: number;
    name: string;
};

export default function Register() {
    const { user, loading, setUser } = useAuth();
    const navigate = useNavigate();

    const [groups, setGroups] = useState<Group[]>([]);
    const [formData, setFormData] = useState({
        username: "",
        password: "",
        confirmPassword: "",
        full_name: "",
        email: "",
        group_id: "",
    });

    useEffect(() => {
        if (!loading && user) {
            navigate("/queues");
        }
    }, [user, loading, navigate]);

    useEffect(() => {
        getGroups().then(setGroups).catch(console.error);
    }, []);

    const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [event.target.name]: event.target.value });
    };

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        if (formData.password !== formData.confirmPassword) {
            alert("Пароли не совпадают");
            return;
        }

        try {
            const registerRes = await fetch("/api/register", {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({
                    username: formData.username,
                    password: formData.password,
                    full_name: formData.full_name,
                    email: formData.email,
                    group_id: Number(formData.group_id),
                }),
            });

            if (!registerRes.ok) {
                const err = await registerRes.json();
                alert("Ошибка регистрации: " + err.detail);
                return;
            }

            // автоматический вход
            const data = new URLSearchParams();
            data.append("username", formData.username);
            data.append("password", formData.password);

            const res = await fetch("/api/login", {
                method: "POST",
                headers: {"Content-Type": "application/x-www-form-urlencoded"},
                body: data.toString(),
            });

            if (!res.ok) {
                alert("Регистрация успешна, но вход не выполнен.");
                navigate("/login");
                return;
            }

            const {access_token} = await res.json();
            localStorage.setItem("token", access_token);

            const meRes = await fetch("/api/me", {
                headers: {Authorization: `Bearer ${access_token}`},
            });

            const me = await meRes.json();
            setUser(me);
            navigate("/queues");

        } catch (err) {
            console.error(err);
            alert("Ошибка регистрации")
        }
    };

    return (
        <>
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-sky-50 via-white to-purple-50 px-4">
                <div className="bg-white shadow-xl rounded-2xl p-8 w-full max-w-md border border-gray-100">
                    <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Регистрация</h2>
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
                        <input
                            type="password"
                            name="confirmPassword"
                            placeholder="Повторите пароль"
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-sky-400 outline-none transition"
                        />
                        <input
                            type="text"
                            name="full_name"
                            placeholder="Фамилия, имя"
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-sky-400 outline-none transition"
                        />
                        <input
                            type="email"
                            name="email"
                            placeholder="Email"
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-sky-400 outline-none transition"
                        />
                        <select
                            name="group_id"
                            onChange={handleChange}
                            value={formData.group_id}
                            required
                            className="w-full px-4 py-3 rounded-xl border border-gray-300 bg-white text-gray-700 focus:ring-2 focus:ring-sky-400 outline-none transition"
                        >
                            <option value="">Выберите группу</option>
                            {groups.map((g) => (
                                <option key={g.id} value={g.id}>
                                    {g.name}
                                </option>
                            ))}
                        </select>
                        <button
                            type="submit"
                            className="w-full bg-sky-600 hover:bg-sky-700 text-white font-medium py-3 rounded-xl shadow transition"
                        >
                            Зарегистрироваться
                        </button>
                    </form>
                    <p className="text-center text-sm text-gray-500 mt-6">
                        Уже есть аккаунт?{" "}
                        <Link to="/login" className="text-sky-600 hover:underline">
                            Войти
                        </Link>
                    </p>
                </div>
            </div>
        </>
    );
}