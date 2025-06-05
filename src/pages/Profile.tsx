import {useEffect, useState} from "react";
import {useAuth} from "../context/AuthContext";
import {getGroups} from "../api/groups";
import {Group} from "../types/Queue";
import toast from "react-hot-toast";

export default function Profile() {
    const {user, setUser} = useAuth();
    const [groups, setGroups] = useState<Group[]>([]);
    const [isEditing, setIsEditing] = useState(false);

    const [formData, setFormData] = useState({
        full_name: "",
        email: "",
        password: "",
        group_id: "",
    });

    useEffect(() => {
        getGroups().then(setGroups).catch(() => setGroups([]));
    }, []);

    useEffect(() => {
        if (user) {
            setFormData({
                full_name: user.full_name,
                email: user.email,
                password: "",
                group_id: user.group_id?.toString() || "",
            });
        }
    }, [user]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const {name, value} = e.target;
        setFormData((prev) => ({...prev, [name]: value}));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const token = localStorage.getItem("token");

        const payload: any = {};
        if (formData.full_name !== user?.full_name) payload.full_name = formData.full_name;
        if (formData.email !== user?.email) payload.email = formData.email;
        if (formData.password.trim() !== "") payload.password = formData.password;

        if (formData.group_id && formData.group_id !== user?.group_id?.toString())
            payload.group_id = Number(formData.group_id);

        try {
            const res = await fetch("/api/me", {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(payload),
            });

            if (!res.ok) {
                const error = await res.json();
                throw new Error(error.detail || "Ошибка обновления профиля");
            }

            const updated = await res.json();
            setUser(updated);
            toast.success("Профиль обновлен");
        } catch (err) {
            toast.error("Ошибка при обновлении профиля");
            console.error(err);
        }
    };

    return (
        <>
            <div
                className="min-h-screen flex items-center justify-center bg-gradient-to-br from-sky-50 via-white to-purple-50 px-4 py-12">
                <div className="bg-white shadow-xl rounded-2xl p-8 w-full max-w-lg border border-gray-100">
                    <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Мой профиль</h2>
                    {!isEditing ? (
                        <>
                            <div className="space-y-4 text-sm text-gray-700">
                                <div className="flex justify-between border-b border-gray-100 pb-2">
                                    <span className="text-gray-500">Логин:</span>
                                    <span className="font-medium">{user?.username}</span>
                                </div>
                                <div className="flex justify-between border-b border-gray-100 pb-2">
                                    <span className="text-gray-500">ФИО:</span>
                                    <span className="font-medium">{user?.full_name}</span>
                                </div>
                                <div className="flex justify-between border-b border-gray-100 pb-2">
                                    <span className="text-gray-500">Email:</span>
                                    <span className="font-medium">{user?.email}</span>
                                </div>
                                <div className="flex justify-between border-b border-gray-100 pb-2">
                                    <span className="text-gray-500">Группа:</span>
                                    <span
                                        className="font-medium">
                                        {/*{groups.find((g) => g.id === Number(user?.group_id))?.name || "–"}*/}
                                        {user?.group?.name}
                                    </span>
                                </div>
                            </div>

                            <button
                                onClick={() => setIsEditing(true)}
                                className="mt-6 w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-2.5 rounded-xl shadow-sm transition"
                            >
                                Изменить данные
                            </button>
                        </>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-5">
                            <div>
                                <label className="block text-sm font-medium text-gray-600 mb-1">Логин</label>
                                <input
                                    type="text"
                                    value={user?.username || ""}
                                    disabled
                                    className="w-full px-4 py-3 rounded-xl bg-gray-100 text-gray-500 border border-gray-200 outline-none cursor-not-allowed"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-600 mb-1">Фамилия, имя</label>
                                <input
                                    type="text"
                                    name="full_name"
                                    value={formData.full_name}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-sky-400 outline-none transition"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-600 mb-1">Email</label>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-sky-400 outline-none transition"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-600 mb-1">Password</label>
                                <input
                                    type="password"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    placeholder="Оставьте пустым, если менять пароль не требуется"
                                    className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-sky-400 outline-none transition"
                                />
                            </div>
                            <div>
                                <label className="block text-gray-600 mb-1">Группа</label>
                                <select
                                    name="group_id"
                                    value={formData.group_id}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 rounded border border-gray-300"
                                >
                                    <option value="">Выберите группу</option>
                                    {groups.map((g) => (
                                        <option key={g.id} value={g.id}>{g.name}</option>
                                    ))}

                                </select>
                            </div>
                            <div className="flex gap-3">
                                <button
                                    type="button"
                                    onClick={() => setIsEditing(false)}
                                    className="w-1/2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-3 rounded-xl shadow transition"
                                >
                                    Назад
                                </button>
                                <button type="submit"
                                        className="w-full bg-sky-600 hover:bg-sky-700 text-white font-medium py-3 rounded-xl shadow transition">
                                    Сохранить изменения
                                </button>
                            </div>
                        </form>
                    )}
                    {/*<div className="mt-10 bg-sky-50 border border-sky-200 rounded-xl p-5 text-center">*/}
                    {/*    <h3 className="text-lg font-semibold text-sky-700 mb-2">Telegram-бот</h3>*/}
                    {/*    <p className="text-gray-600 text-sm mb-3">*/}
                    {/*        Получайте уведомления об очередях и записывайтесь напрямую через Telegram.*/}
                    {/*    </p>*/}
                    {/*    <a*/}
                    {/*        href="https://t.me/ElectronicQueuesBot"*/}
                    {/*        target="_blank"*/}
                    {/*        rel="noopener noreferrer"*/}
                    {/*        className="inline-block bg-sky-600 hover:bg-sky-700 text-white text-sm font-medium px-5 py-2 rounded-xl shadow transition"*/}
                    {/*    >*/}
                    {/*        Перейти в бота*/}
                    {/*    </a>*/}
                    {/*</div>*/}
                    <div className="mt-10 bg-sky-50 border border-sky-200 rounded-xl p-5 text-center">
                        <h3 className="text-lg font-semibold text-sky-700 mb-2">Интеграция с Telegram</h3>
                        {user?.telegram_id ? (
                            <>
                                <p className="text-green-700 text-sm mb-3">
                                    Telegram подключён ✅<br/>
                                    <span className="text-gray-500 text-xs">(ID: {user.telegram_id})</span>
                                </p>
                                <p className="text-gray-600 text-sm">
                                    Вы будете получать уведомления и сможете управлять очередями через бота.
                                </p>
                            </>
                        ) : (
                            <>
                                <p className="text-gray-600 text-sm mb-3">
                                    Подключите Telegram, чтобы получать уведомления и управлять очередями.
                                </p>
                                <a
                                    href="https://t.me/ElectronicQueuesBot"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-block bg-sky-600 hover:bg-sky-700 text-white text-sm font-medium px-5 py-2 rounded-xl shadow transition"
                                >
                                    Подключить Telegram
                                </a>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}