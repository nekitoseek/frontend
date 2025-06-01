import {useEffect, useState} from "react";
import {useParams, useNavigate} from "react-router-dom";
import toast from "react-hot-toast";
import {Group} from "../../types/Queue.ts";
import {getGroups} from "../../api/groups.ts";

export default function AdminUserProfile() {
    const {userId} = useParams();
    const navigate = useNavigate();
    const [user, setUser] = useState<any>(null);
    const [groups, setGroups] = useState<Group[]>([]);
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
        const fetchUser = async () => {
            const token = localStorage.getItem("token");
            const res = await fetch(`/api/admin/users?search=`, {
                headers: {Authorization: `Bearer ${token}`},
            });
            const allUsers = await res.json();
            const found = allUsers.find((u: any) => u.id === Number(userId));
            if (found) {
                setUser(found);
                setFormData({
                    full_name: found.full_name,
                    email: found.email,
                    password: "",
                    group_id: found.group?.id?.toString() || "",
                });
            } else {
                toast.error("Пользователь не найден");
                navigate("/admin/users");
            }
        };
        fetchUser();
    }, [userId]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const {name, value} = e.target;
        setFormData((prev) => ({...prev, [name]: value}));
    };

    const updateUser = async () => {
        const token = localStorage.getItem("token");
        const payload: any = {
            full_name: formData.full_name,
            email: formData.email,
        };
        if (formData.password.trim()) payload.password = formData.password;
        if (formData.group_id) payload.group_id = Number(formData.group_id);

        const res = await fetch(`/api/admin/users/${userId}`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(payload),
        });

        if (res.ok) {
            toast.success("Профиль обновлен");
        } else {
            toast.error("Ошибка при обновлении");
        }
    };

    const setAdmin = async () => {
        const token = localStorage.getItem("token");
        const res = await fetch(`/api/admin/users/${userId}/set-admin`, {
            method: "POST",
            headers: {Authorization: `Bearer ${token}`},
        });
        res.ok ? toast.success("Назначен администратором") : toast.error("Ошибка");
    };

    const toggleActive = async () => {
        const token = localStorage.getItem("token");
        const endpoint = user.is_active ? "ban" : "unban";
        const res = await fetch(`/api/admin/users/${userId}/${endpoint}`, {
            method: "POST",
            headers: {Authorization: `Bearer ${token}`},
        });

        if (res.ok) {
            setUser((prev: any) => ({
                ...prev,
                is_active: !prev.is_active,
            }));
            toast.success(user.is_active ? "Пользователь заблокирован" : "Пользователь разблокирован");
        } else {
            toast.error("Ошибка изменения статуса");
        }
    };

    if (!user) return <div className="p-6">Загрузка...</div>;

    return (
        <div
            className="min-h-screen flex items-center justify-center bg-gradient-to-br from-sky-50 via-white to-purple-50 px-4 py-12">
            <div className="w-full max-w-xl bg-white border border-gray-100 rounded-2xl shadow-xl p-8">
                <h1 className="text-2xl font-bold text-gray-800 mb-6 text-center">Профиль пользователя</h1>

                <div className="space-y-5">
                    <div>
                        <label className="block mb-1 text-sm font-medium text-gray-600">Логин</label>
                        <input
                            type="text"
                            value={user.username}
                            disabled
                            className="w-full bg-gray-100 text-gray-500 px-4 py-3 rounded-xl border border-gray-200 outline-none cursor-not-allowed"
                        />
                    </div>
                    <div>
                        <label className="block mb-1 text-sm font-medium text-gray-600">ФИО</label>
                        <input
                            type="text"
                            name="full_name"
                            value={formData.full_name}
                            onChange={handleChange}
                            className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-sky-400 outline-none transition"
                        />
                    </div>
                    <div>
                        <label className="block mb-1 text-sm font-medium text-gray-600">Email</label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-sky-400 outline-none transition"
                        />
                    </div>
                    <div>
                        <label className="block mb-1 text-sm font-medium text-gray-600">Новый пароль</label>
                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            placeholder="Оставьте пустым, чтобы не менять"
                            className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-sky-400 outline-none transition"
                        />
                    </div>
                    <div>
                        <label className="block mb-1 text-sm font-medium text-gray-600">Группа</label>
                        <select
                            name="group_id"
                            value={formData.group_id}
                            onChange={handleChange}
                            className="w-full px-4 py-2 rounded-xl border border-gray-300"
                        >
                            <option value="">Не выбрана</option>
                            {groups.map((g) => (
                                <option key={g.id} value={g.id}>
                                    {g.name}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                <div className="mt-8 space-y-4">
                    <button
                        onClick={updateUser}
                        className="w-full bg-sky-600 hover:bg-sky-700 text-white font-medium py-3 rounded-xl shadow transition"
                    >
                        Сохранить изменения
                    </button>

                    {!user.is_admin && (
                        <button
                            onClick={setAdmin}
                            className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-medium py-3 rounded-xl shadow transition"
                        >
                            Назначить администратором
                        </button>
                    )}

                    <button
                        onClick={toggleActive}
                        className={`w-full ${
                            user.is_active
                                ? "bg-red-600 hover:bg-red-700"
                                : "bg-green-600 hover:bg-green-700"
                        } text-white font-medium py-3 rounded-xl shadow transition`}
                    >
                        {user.is_active ? "Заблокировать" : "Разблокировать"}
                    </button>
                </div>
            </div>
        </div>
    );
}