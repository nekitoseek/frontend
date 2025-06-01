import {useEffect, useState} from "react";
import {Queue} from "../../types/Queue.ts";
import {Link} from "react-router-dom";
import EditQueueModal from "../../components/Queue/EditQueueModal.tsx";
import {SearchInput} from "../../components/Queue/SearchInput.tsx";
import {fetchAdminQueues} from "../../api/queues.ts";
import toast from "react-hot-toast";

export default function AdminQueues() {
    const [queues, setQueues] = useState<Queue[]>([]);
    const [editingQueue, setEditingQueue] = useState<Queue | null>(null);
    const [search, setSearch] = useState("");
    const token = localStorage.getItem("token");

    const fetchQueues = async () => {
        const params = new URLSearchParams();
        if (search) params.append("search", search);

        const res = await fetch("/api/admin/queues", {
            headers: {Authorization: `Bearer ${token}`},
        });

        if (!res.ok) return toast.error("Ошибка загрузки очередей");
        const data = await res.json();
        setQueues(data);
    };

    useEffect(() => {
        fetchAdminQueues(search).then(setQueues).catch(() => setQueues([]));
    }, [search]);

    const handleDelete = async (id: number) => {
        toast.custom((t) => (
                <div
                    className={`bg-white border border-gray-200 rounded-xl shadow-xl p-6 w-full max-w-sm text-sm text-gray-800 ${
                        t.visible ? "animate-fade-in-up" : "opacity-0"
                    }`}
                >
                    <p className="mb-4">Удалить очередь?</p>
                    <div className="flex justify-end gap-3">
                        <button onClick={() => {
                            toast.dismiss(t.id);
                        }} className="text-gray-500 hover:text-gray-700 transition text-sm">Отмена
                        </button>
                        <button onClick={async () => {
                            toast.dismiss(t.id);
                            try {
                                const res = await fetch(`/api/admin/queues/${id}`, {
                                    method: "DELETE",
                                    headers: {Authorization: `Bearer ${token}`},
                                });
                                if (!res.ok) {
                                    const err = await res.json();
                                    toast.error("Ошибка: " + err.detail);
                                    return;
                                }
                                toast.success("Очередь удалена");
                                fetchQueues();
                            } catch {
                                toast.error("Ошибка удаления очереди");
                            }
                        }} className="text-red-600 hover:text-red-800 font-medium transition text-sm">
                            Удалить
                        </button>
                    </div>
                </div>
            ), {position: "top-center", duration: 10000}
        );
    };

    const handleForceClose = async (id: number) => {
        toast.custom((t) => (
                <div
                    className={`bg-white border border-gray-200 rounded-xl shadow-xl p-6 w-full max-w-sm text-sm text-gray-800 ${
                        t.visible ? "animate-fade-in-up" : "opacity-0"
                    }`}
                >
                    <p className="mb-4">Завершить очередь принудительно?</p>
                    <div className="flex justify-end gap-3">
                        <button onClick={() => toast.dismiss(t.id)}
                                className="text-gray-500 hover:text-gray-700 transition text-sm">Отмена
                        </button>
                        <button onClick={async () => {
                            toast.dismiss(t.id);
                            try {
                                const res = await fetch(`/api/admin/queues/${id}/force-close`, {
                                    method: "POST",
                                    headers: {Authorization: `Bearer ${token}`},
                                });
                                if (!res.ok) {
                                    const err = await res.json();
                                    toast.error("Ошибка: " + err.detail);
                                    return;
                                }
                                toast.success("Очередь завершена");
                                fetchQueues();
                            } catch {
                                toast.error("Ошибка завершения очереди");
                            }
                        }} className="text-red-600 hover:text-red-800 font-medium transition text-sm">
                            Завершить
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
                <div className="w-full max-w-5xl bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
                    <h1 className="text-2xl font-bold text-gray-800 mb-6 text-center">Управление очередями</h1>
                    <SearchInput value={search} onChange={setSearch} placeholder="Поиск по очередям..."
                                 className="mb-8"/>
                    {queues.length === 0 ? (
                        <p className="text-center text-gray-500">Очередей нет</p>
                    ) : (
                        <ul className="space-y-6">
                            {queues.map((q) => (
                                <li key={q.id}
                                    className="bg-gray-50 rounded-xl border border-gray-200 shadow-sm p-6 space-y-2">
                                    <h2 className="text-xl font-semibold text-gray-800">{q.title}</h2>
                                    <p className="text-sm text-gray-600"><span
                                        className="font-medium">Описание:</span> {q.description || "–"}</p>
                                    <p className="text-sm text-gray-600"><span
                                        className="font-medium">Создана:</span> {new Date(q.created_at).toLocaleString("ru-RU")}
                                    </p>
                                    <p className="text-sm text-gray-600"><span
                                        className="font-medium">Начало:</span> {new Date(q.scheduled_date).toLocaleString("ru-RU")}
                                    </p>
                                    <p className="text-sm text-gray-600"><span
                                        className="font-medium">Окончание:</span> {new Date(q.scheduled_end).toLocaleString("ru-RU")}
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
                                    <p className="text-sm text-gray-600"><span
                                        className="font-medium">Создатель:</span> {q.creator?.username || "–"}</p>
                                    <p className="text-sm text-gray-600"><span
                                        className="font-medium">Дисциплина:</span> {q.discipline?.name || "–"}</p>
                                    <p className="text-sm text-gray-600">
                                        <span className="font-medium">Группы:</span>{" "}
                                        {q.groups.map((g) => g.name).join(", ")}
                                    </p>
                                    <div className="flex gap-4 pt-4 flex-wrap">
                                        <Link to={`/queues/${q.id}`}
                                              className="bg-sky-600 hover:bg-sky-700 text-white font-medium px-4 py-2 rounded-xl shadow-sm transition">Перейти
                                            к очереди</Link>
                                        {q.status !== "closed" && (
                                            <button onClick={() => handleForceClose(q.id)}
                                                    className="bg-yellow-100 hover:bg-yellow-200 text-yellow-800 font-medium px-4 py-2 rounded-xl shadow-sm transition">
                                                Завершить очередь
                                            </button>
                                        )}
                                        <button onClick={() => handleDelete(q.id)}
                                                className="bg-red-100 hover:bg-red-200 text-red-700 font-medium px-4 py-2 rounded-xl shadow-sm transition">
                                            Удалить
                                        </button>
                                        <button
                                            onClick={() => setEditingQueue(q)}
                                            className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium px-4 py-2 rounded-xl shadow-sm transition"
                                        >
                                            Редактировать
                                        </button>
                                        {editingQueue && (
                                            <EditQueueModal queue={editingQueue} onClose={() => setEditingQueue(null)}
                                                            onUpdated={fetchQueues}/>
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