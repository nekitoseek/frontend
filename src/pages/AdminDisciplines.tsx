import {useEffect, useState} from "react";
import toast from "react-hot-toast";

export default function AdminDisciplines() {
    const [disciplines, setDisciplines] = useState<{ id: number; name: string }[]>([]);
    const [newDiscipline, setNewDiscipline] = useState("");
    const token = localStorage.getItem("token");

    const fetchDisciplines = async () => {
        try {
            const res = await fetch("/api/disciplines", {
                headers: {Authorization: `Bearer ${token}`},
            });
            const data = await res.json();
            setDisciplines(data);
        } catch {
            toast.error("Ошибка загрузки дисциплин");
        }
    };

    useEffect(() => {
        fetchDisciplines();
    }, []);

    const handleAdd = async () => {
        if (!newDiscipline.trim()) return toast.error("Введите название дисциплины");

        const res = await fetch("/api/admin/disciplines", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(newDiscipline),
        });

        if (!res.ok) {
            const err = await res.json();
            toast.error("Ошибка: " + err.detail);
            return;
        }
        toast.success("Дисциплина добавлена")
        setNewDiscipline("");
        fetchDisciplines();
    };

    const handleDelete = async (id: number) => {
        toast.custom((t) => (
                <div
                    className={`bg-white border border-gray-200 rounded-xl shadow-xl p-6 w-full max-w-sm text-sm text-gray-800 ${
                        t.visible ? "animate-fade-in-up" : "opacity-0"
                    }`}
                >
                    <p className="mb-4">Удалить дисциплину?</p>
                    <div className="flex justify-end gap-3">
                        <button onClick={() => {
                            toast.dismiss(t.id);
                        }} className="text-gray-500 hover:text-gray-700 transition text-sm">Отмена
                        </button>
                        <button onClick={async () => {
                            toast.dismiss(t.id);
                            try {
                                const res = await fetch(`/api/admin/disciplines/${id}`, {
                                    method: "DELETE",
                                    headers: {Authorization: `Bearer ${token}`},
                                });

                                if (!res.ok) {
                                    const err = await res.json();
                                    toast.error("Ошибка: " + err.detail);
                                    return;
                                }
                                toast.success("Дисциплина удалена")
                                fetchDisciplines();
                            } catch {
                                toast.error("Ошибка удаления дисциплины");
                            }
                        }} className="text-red-600 hover:text-red-800 font-medium transition text-sm">
                            Удалить
                        </button>
                    </div>
                </div>
            ), {position: "top-center", duration: 10000}
        );
    };

    return (
        <div
            className="min-h-screen flex items-center justify-center bg-gradient-to-br from-sky-50 via-white to-purple-50 px-4 py-12">
            <div className="w-full max-w-3xl bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
                <h1 className="text-2xl font-bold text-gray-800 mb-6 text-center">Управление дисциплинами</h1>

                <div className="flex flex-col sm:flex-row gap-4 mb-8">
                    <input
                        type="text"
                        value={newDiscipline}
                        onChange={(e) => setNewDiscipline(e.target.value)}
                        placeholder="Новая дисциплина"
                        className="flex-1 px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-sky-400 outline-none transition"
                    />
                    <button onClick={handleAdd}
                            className="bg-sky-600 hover:bg-sky-700 text-white font-medium px-5 py-3 rounded-xl shadow transition">
                        Добавить
                    </button>
                </div>
                <ul className="space-y-3">
                    {disciplines.map((d) => (
                        <li key={d.id}
                            className="flex justify-between items-center px-5 py-4 bg-gray-50 rounded-xl border border-gray-200 shadow-sm">
                            <span className="text-gray-800 font-medium">{d.name}</span>
                            <button onClick={() => handleDelete(d.id)}
                                    className="text-red-600 hover:text-red-800 text-sm font-medium transition">
                                Удалить
                            </button>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );

}