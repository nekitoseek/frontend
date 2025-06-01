import {useEffect, useState} from "react";
import {Link} from "react-router-dom";
import {User} from "../../types/User.ts";

export default function AdminUsers() {
    const [users, setUsers] = useState<User[]>([]);
    const [search, setSearch] = useState("");

    const fetchUsers = async () => {
        const token = localStorage.getItem("token");
        const res = await fetch(`/api/admin/users?search=${search}`, {
            headers: {Authorization: `Bearer ${token}`},
        });
        const data = await res.json();
        setUsers(data);
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    return (
        <div
            className="min-h-screen bg-gradient-to-br from-sky-50 via-white to-purple-50 px-4 py-12 flex items-center justify-center">
            <div className="w-full max-w-5xl bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
                <h1 className="text-2xl font-bold text-gray-800 mb-6 text-center">Пользователи</h1>

                <input
                    type="text"
                    placeholder="Поиск по пользователям..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && fetchUsers()}
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-sky-400 outline-none transition mb-6"
                />

                {users.length === 0 ? (
                    <p className="text-center text-gray-500">Пользователи не найдены</p>
                ) : (
                    <ul className="space-y-4">
                        {users.map((user) => (
                            <li
                                key={user.id}
                                className="bg-gray-50 rounded-xl border border-gray-200 shadow-sm p-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4"
                            >
                                <div>
                                    <p className="text-gray-800 font-semibold">{user.full_name}</p>
                                    <p className="text-sm text-gray-500">{user.email}</p>
                                </div>
                                <div className="flex items-center gap-4">
                                    <span
                                        className={`text-sm font-medium ${
                                            user.is_active ? "text-green-600" : "text-red-600"
                                        }`}
                                    >
                                        {user.is_active ? "Активен" : "Заблокирован"}
                                    </span>
                                    <Link
                                        to={`/admin/users/${user.id}`}
                                        className="text-sm text-sky-600 hover:underline font-medium"
                                    >
                                        Профиль
                                    </Link>
                                </div>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
}
