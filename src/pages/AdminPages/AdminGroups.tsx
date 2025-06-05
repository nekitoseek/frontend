import {useEffect, useState} from "react";
import {getGroups} from "../../api/groups";
import {Link} from "react-router-dom";
import toast from "react-hot-toast";

export default function AdminGroups() {
    const [groups, setGroups] = useState<{ id: number; name: string }[]>([]);
    const [newGroup, setNewGroup] = useState("");
    const token = localStorage.getItem("token");

    const fetchGroups = async () => {
        try {
            const data = await getGroups();
            setGroups(data);
        } catch (err) {
            console.error(err);
            toast.error("Ошибка загрузки групп");
        }
    }

    useEffect(() => {
        fetchGroups();
    }, []);

    const handleAdd = async () => {
        if (!newGroup.trim()) return toast.error("Введите название группы");

        const res = await fetch("/api/admin/groups", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(newGroup),
        });

        if (!res.ok) {
            const err = await res.json();
            toast.error("Ошибка: " + err.detail);
            return;
        }
        toast.success("Группа добавлена")
        setNewGroup("");
        fetchGroups();
    };

    const handleDelete = async (id: number) => {
        toast.custom((t) => (
                <div
                    className={`bg-white border border-gray-200 rounded-xl shadow-xl p-6 w-full max-w-sm text-sm text-gray-800 ${
                        t.visible ? "animate-fade-in-up" : "opacity-0"
                    }`}
                >
                    <p className="mb-4">Удалить группу?</p>
                    <div className="flex justify-end gap-3">
                        <button onClick={() => {
                            toast.dismiss(t.id);
                        }} className="text-gray-500 hover:text-gray-700 transition text-sm">Отмена
                        </button>
                        <button onClick={async () => {
                            toast.dismiss(t.id);
                            try {
                                const res = await fetch(`/api/admin/groups/${id}`, {
                                    method: "DELETE",
                                    headers: {Authorization: `Bearer ${token}`},
                                });

                                if (!res.ok) {
                                    const err = await res.json();
                                    toast.error("Ошибка: " + err.detail);
                                    return;
                                }
                                toast.success("Группа удалена");
                                fetchGroups();
                            } catch {
                                toast.error("Ошибка удаления группы");
                            }
                        }} className="text-red-600 hover:text-red-800 font-medium transition text-sm"
                        >
                            Удалить
                        </button>
                    </div>
                </div>
            ), {position: "top-center", duration: 10000}
        );
    };

    return (
        <>
            <div
                className="min-h-screen flex items-center justify-center bg-gradient-to-br from-sky-50 via-white to-purple-50 px-4 py-12">
                <div className="w-full max-w-3xl bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
                    <div className="mb-4">
                        <Link
                            to="/admin"
                            className="inline-flex items-center text-sky-600 hover:text-sky-800 text-sm font-medium transition"
                        >
                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" strokeWidth="2"
                                 viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round"
                                      d="M15 19l-7-7 7-7"/>
                            </svg>
                            Назад в админку
                        </Link>
                    </div>
                    <h1 className="text-2xl font-bold text-gray-800 mb-6 text-center">Управление группами</h1>

                    <div className="flex flex-col sm:flex-row gap-4 mb-8">
                        <input
                            type="text"
                            value={newGroup}
                            onChange={(e) => setNewGroup(e.target.value)}
                            placeholder="Новая группа"
                            className="flex-1 px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-sky-400 outline-none transition"
                        />
                        <button onClick={handleAdd}
                                className="bg-sky-600 hover:bg-sky-700 text-white font-medium px-5 py-3 rounded-xl shadow transition">
                            Добавить
                        </button>
                    </div>
                    <ul className="space-y-3">
                        {groups.map((g) => (
                            <li key={g.id}
                                className="flex justify-between items-center px-5 py-4 bg-gray-50 rounded-xl border border-gray-200 shadow-sm">
                                <span className="text-gray-800 font-medium">{g.name}</span>
                                <button onClick={() => handleDelete(g.id)}
                                        className="text-red-600 hover:text-red-800 text-sm font-medium transition">
                                    Удалить
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </>
    );
}