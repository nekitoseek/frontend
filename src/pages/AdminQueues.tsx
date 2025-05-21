import {useEffect, useState} from "react";
import {Queue} from "../types/Queue";
import {Link} from "react-router-dom";
import EditQueueModal from "../components/EditQueueModal";

export default function AdminQueues() {
    const [queues, setQueues] = useState<Queue[]>([]);
    const [editingQueue, setEditingQueue] = useState<Queue | null>(null);
    const token = localStorage.getItem("token");

    const fetchQueues = async () => {
        const res = await fetch("/api/admin/queues", {
            headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) return alert("Ошибка загрузки очередей");
        const data = await res.json();
        setQueues(data);
    };

    useEffect(() => {
        fetchQueues();
    }, []);

    const handleDelete = async (id: number) => {
        if (!window.confirm("Удалить очередь?")) return;
        const res = await fetch(`/api/admin/queues/${id}`, {
            method: "DELETE",
            headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) {
            const err = await res.json();
            alert("Ошибка: " + err.detail);
            return;
        }
        fetchQueues();
    };

    const handleForceClose = async (id: number) => {
        if (!window.confirm("Завершить очередь принудительно?")) return;
        const res = await fetch(`/api/admin/queues/${id}/force-close`, {
            method: "POST",
            headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) {
            const err = await res.json();
            alert("Ошибка: " + err.detail);
            return;
        }
        fetchQueues();
    };

    return (
        <>
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-sky-50 via-white to-purple-50 px-4 py-12">
                <div className="w-full max-w-5xl bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
                    <h1 className="text-2xl font-bold text-gray-800 mb-6 text-center">Управление очередями</h1>

                    {queues.length === 0 ? (
                        <p className="text-center text-gray-500">Очередей нет</p>
                    ) : (
                        <ul className="space-y-6">
                            {queues.map((q) => (
                                <li key={q.id} className="bg-gray-50 rounded-xl border border-gray-200 shadow-sm p-6 space-y-2">
                                    <h2 className="text-xl font-semibold text-gray-800">{q.title}</h2>
                                    <p className="text-sm text-gray-600">
                                        <span className="font-medium">Даты:</span>{" "}
                                        {new Date(q.scheduled_date).toLocaleDateString("ru-RU")}
                                    </p>
                                    <p className="text-sm text-gray-600">
                                        <span className="font-medium">Статус:</span>{" "}
                                        <span className={
                                            q.status === "active" ? "text-green-600" :
                                            q.status === "closed" ? "text-red-600" :
                                            "text-yellow-600"
                                        }>
                                            {q.status}
                                        </span>
                                    </p>
                                    <p className="text-sm text-gray-600">
                                        <span className="font-medium">Группы:</span>{" "}
                                        {q.groups.map((g) => g.name).join(", ")}
                                    </p>
                                    <div className="flex gap-4 pt-4 flex-wrap">
                                        <Link to={`/queues/${q.id}`} className="bg-sky-600 hover:bg-sky-700 text-white font-medium px-4 py-2 rounded-xl shadow-sm transition">Перейти к очереди</Link>
                                        {q.status !== "closed" && (
                                            <button onClick={() => handleForceClose(q.id)} className="bg-yellow-100 hover:bg-yellow-200 text-yellow-800 font-medium px-4 py-2 rounded-xl shadow-sm transition">
                                                Завершить очередь
                                            </button>
                                        )}
                                        <button onClick={() => handleDelete(q.id)} className="bg-red-100 hover:bg-red-200 text-red-700 font-medium px-4 py-2 rounded-xl shadow-sm transition">
                                            Удалить
                                        </button>
                                        <button
                                            onClick={() => setEditingQueue(q)}
                                            className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium px-4 py-2 rounded-xl shadow-sm transition"
                                        >
                                            Редактировать
                                        </button>
                                        {editingQueue && (
                                            <EditQueueModal queue={editingQueue} onClose={() => setEditingQueue(null)} onUpdated={fetchQueues} />
                                        )}
                                    </div>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </div>
        </>
    );
}