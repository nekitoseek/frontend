import {useEffect, useState} from "react";
import {useParams} from "react-router-dom";
import {Queue} from "../types/Queue";
import JoinButton from "../components/JoinButton";
import LeaveButton from "../components/LeaveButton";
import EditQueueModal from "../components/EditQueueModal";
import {fetchQueueStudents} from "../api/queues";
import {useAuth} from "../context/AuthContext";
import {Student} from "../types/Student";
import toast from "react-hot-toast";

export default function QueueDetails() {
    const {id} = useParams();
    const {user} = useAuth();
    const [queue, setQueue] = useState<Queue | null>(null);
    const [students, setStudents] = useState<Student[]>([]);
    const [editing, setEditing] = useState(false);
    const [loading, setLoading] = useState(true);
    const [joinVersion, setJoinVersion] = useState(0);
    const isJoined = students.some(s => s.id === user?.id);

    useEffect(() => {
        if (!id) return;
        const token = localStorage.getItem("token");
        if (!token) return;

        Promise.all([
            fetch(`/api/queues/${id}`, {
                headers: {Authorization: `Bearer ${token}`},
            }).then((res) => res.json()),
            fetchQueueStudents(Number(id)),
        ])
            .then(([queueData, studentsData]) => {
                setQueue(queueData);
                setStudents(studentsData);
            })
            .catch(console.error)
            .finally(() => setLoading(false));
    }, [id]);

    const loadStudents = async () => {
        if (!id) return;
        try {
            const data = await fetchQueueStudents(Number(id));
            setStudents(data);
            setJoinVersion(prev => prev + 1);
        } catch (err) {
            console.error(err);
        }
    }

    const handleManualClose = async () => {
        const token = localStorage.getItem("token");
        if (!queue) return;

        try {
            const res = await fetch(`/api/queues/${queue.id}/close`, {
                method: "POST",
                headers: {Authorization: `Bearer ${token}`},
            });
            if (!res.ok) throw new Error("Ошибка завершения очереди");

            toast.success("Очередь завершена");
            setQueue((prev) => prev ? {...prev, status: "closed"} : prev);
        } catch (err) {
            toast.error("Ошибка при завершении очереди");
            console.error(err);
        }
    };

    if (loading) return <p className="text-center py-8 text-gray-500">Загрузка...</p>;
    if (!queue) return <p className="text-center py-8 text-gray-500">Очередь не найдена</p>;

    const currentParticipant = students.find(s => s.id === user?.id);
    const isCurrent = currentParticipant?.status === "current";

    return (
        <>
            <div className="max-w-4xl mx-auto px-4 py-12">
                <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-100 mb-8">
                    <h1 className="text-3xl font-bold text-gray-800 mb-4">{queue.title}</h1>
                    <p className="text-gray-600 mb-2">
                        <span>Очередь:</span>{" "}
                        {queue.status === "active" && (
                            <span className="text-green-600 font-medium">Активна</span>
                        )}
                        {queue.status === "closed" && (
                            <span className="text-red-600 font-medium">Закрыта</span>
                        )}
                    </p>
                    <p className="text-gray-600 mb-2">
                        <span className="font-medium">Описание:</span> {queue.description || "Нет описания"}
                    </p>
                    <p className="text-gray-600 mb-2">
                        <span className="font-medium">Дата и время проведения:</span> {" "}
                        с {new Date(queue.scheduled_date).toLocaleString("ru-RU", {
                        hour: "2-digit",
                        minute: "2-digit"
                    })} до {new Date(queue.scheduled_end).toLocaleString("ru-RU", {
                        hour: "2-digit",
                        minute: "2-digit"
                    })}{" "}
                        {new Date(queue.scheduled_date).toLocaleDateString("ru-RU")}
                    </p>
                    {/*<p className="text-gray-600 mb-4">*/}
                    {/*    <span className="font-medium">Статус:</span> {queue.status}*/}
                    {/*</p>*/}
                    <p className="text-gray-600 mb-2">
                        <span className="font-medium">Дисциплина:</span> {queue.discipline.name}
                    </p>
                    {queue.groups && queue.groups.length > 0 && (
                        <p className="text-gray-600 mb-2">
                            <span className="font-medium">Группы:</span> {queue.groups.map((g) => g.name).join(", ")}
                        </p>
                    )}
                    <div className="flex gap-4 mt-6">
                        {isCurrent && (
                            <button
                                onClick={async () => {
                                    try {
                                        const token = localStorage.getItem("token");
                                        const res = await fetch(`/api/queues/${queue.id}/complete`, {
                                            method: "POST",
                                            headers: {Authorization: `Bearer ${token}`},
                                        });
                                        if (!res.ok) {
                                            const err = await res.json();
                                            throw new Error(err.detail || "Ошибка");
                                        }
                                        toast.success("Вы отметили сдачу, следующий сдающий назначен.");
                                        loadStudents();
                                    } catch (err) {
                                        console.error(err);
                                        toast.error("Не удалось завершить сдачу");
                                    }
                                }}
                                className="bg-green-600 hover:bg-green-700 text-white text-sm font-medium py-2 px-4 rounded-xl shadow transition"
                            >
                                Я сдал
                            </button>
                        )}

                        <JoinButton key={joinVersion} queueId={queue.id} autoCheck onChange={() => {
                            loadStudents();
                            setJoinVersion(prev => prev + 1);
                        }}/>
                        {isJoined && <LeaveButton queueId={queue.id} onChange={loadStudents}/>}
                        {(user?.id === queue.creator_id || user?.username === "admin") && queue.status !== "closed" && (
                            <>
                                <button onClick={handleManualClose}
                                        className="bg-red-600 hover:bg-red-700 text-white text-sm font-medium py-2 px-4 rounded-xl shadow transition">
                                    Завершить очередь
                                </button>
                                <button onClick={() => setEditing(true)}
                                        className="bg-sky-600 hover:bg-sky-700 text-white text-sm font-medium py-2 px-4 rounded-xl shadow transition">
                                    Редактировать
                                </button>
                            </>
                        )}
                    </div>
                </div>
                <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-100">
                    <h2 className="text-2xl font-semibold text-gray-800 mb-4">Студенты в очереди: {students.length}</h2>
                    {students.length === 0 ? (
                        <p className="text-gray-500">В очереди никого нет</p>
                    ) : (
                        <ol className="space-y-3">
                            {students.map((s, idx) => {
                                    const isCurrent = s.status === "current";
                                    const isDone = s.status === "done";

                                    return (
                                        <li key={s.id}
                                            className={`flex  justify-between items-center bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 shadow-sm
                                                ${isCurrent ? "bg-green-50 border-green-400 animate-pulse" :
                                                isDone ? "bg-gray-100 border-gray-200 opacity-80" :
                                                    "bg-gray-50 border-gray-200"}
                                            `}>
                                            <div className="flex items-center gap-3">
                                                <span className="text-gray-400 font-mono w-6 text-right">{idx + 1}.</span>
                                                <div>
                                                    <span
                                                        className={`font-medium ${isDone ? "text-gray-500" : "text-gray-800"}`}>
                                                        {s.full_name}
                                                    </span>{" "}
                                                    <span className="text-sm text-gray-500">({s.group})</span>
                                                    {isCurrent && (
                                                        <div className="text-xs text-green-700 font-semibold mt-0.5">
                                                            Сдает сейчас
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                            {user?.username === "admin" && (
                                                <div className="text-sm text-gray-400 text-right min-w-fit ml-4">
                                                    Присоединился: {new Date(s.joined_at).toLocaleString("ru-RU")}
                                                </div>
                                            )}
                                        </li>
                                    );
                                }
                            )}
                        </ol>
                    )}
                </div>
            </div>
            {editing && queue && (
                <EditQueueModal queue={queue} onClose={() => setEditing(false)} onUpdated={() => {
                    window.location.reload()
                }}/>
            )}
        </>
    );
}