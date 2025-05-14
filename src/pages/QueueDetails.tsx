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

    if (loading) return <p>Загрузка...</p>;
    if (!queue) return <p>Очередь не найдена</p>;

    return (
        <>
            <div>
                <h1>{queue.title}</h1>
                <p>Описание: {queue.description || "Нет описания"}</p>
                <p>Дата и время проведения: {new Date(queue.scheduled_date).toLocaleString("ru-RU")}</p>
                 <p>Статус: {queue.status}</p>
            </div>
            <div>
                <JoinButton queueId={queue.id} />
                <LeaveButton queueId={queue.id} />
            </div>
            <div>
                <h2>Студенты в очереди:</h2>
                {students.length === 0 ? (
                    <p>В очереди никого нет</p>
                ) : (
                    <ol>
                        {students.map((s, idx) => (
                            <li key={s.id}>
                                {idx + 1}. {s.full_name} ({s.username}), {s.email})
                            </li>
                        ))}
                    </ol>
                )}
            </div>
        </>
    );
}