import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Queue } from "../types/Queue";
import JoinButton from "../components/JoinButton";
import LeaveButton from "../components/LeaveButton";
import { fetchQueueStudents } from "../api/queues";

type Student = {
    id: number;
    username: string;
    full_name: string;
    email: string;
};

export default function QueueDetails() {
    const { id } = useParams();
    const [queue, setQueue] = useState<Queue | null>(null);
    const [students, setStudents] = useState<Student[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!id) return;
        const token = localStorage.getItem("token");
        if (!token) return;

        Promise.all([
            fetch(`/api/queues/${id}`, {
                headers: { Authorization: `Bearer ${token}` },
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

    if (loading) return <p className="text-center py-8 text-gray-500">Загрузка...</p>;
    if (!queue) return <p className="text-center py-8 text-gray-500">Очередь не найдена</p>;

    return (
        <>
            <div className="max-w-4xl mx-auto px-4 py-12">
                <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-100 mb-8">
                    <h1 className="text-3xl font-bold text-gray-800 mb-4">{queue.title}</h1>
                    <p className="text-gray-600 mb-2">
                        <span className="font-medium">Описание:</span> {queue.description || "Нет описания"}
                    </p>
                    <p className="text-gray-600 mb-2">
                        <span className="font-medium">Дата и время проведения:</span> {" "}
                        {new Date(queue.scheduled_date).toLocaleString("ru-RU")}
                    </p>
                    <p className="text-gray-600 mb-4">
                        <span className="font-medium">Статус:</span> {queue.status}
                    </p>
                    <div className="flex gap-4 mt-6">
                        <JoinButton queueId={queue.id} />
                        <LeaveButton queueId={queue.id} />
                    </div>
                </div>
                <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-100">
                    <h2 className="text-2xl font-semibold text-gray-800 mb-4">Студенты в очереди:</h2>
                    {students.length === 0 ? (
                        <p className="text-gray-500">В очереди никого нет</p>
                    ) : (
                        <ol className="space-y-2">
                            {students.map((s, idx) => (
                                <li key={s.id} className="text-gray-700 flex gap-2 items-start">
                                    <span className="text-gray-400 font-mono w-6 text-right">{idx + 1}.</span>
                                    <span>
                                        <span className="font-medium">{s.full_name}</span>{" "}
                                        <span className="text-sm text-gray-500">({s.username}), {s.email})</span>
                                    </span>
                                </li>
                            ))}
                        </ol>
                    )}
                </div>
            </div>
        </>
    );
}