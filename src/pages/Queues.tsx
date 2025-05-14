import { useEffect, useState } from "react";
import { Queue } from "../types/Queue";
import { fetchQueues } from "../api/queues";
import QueueCard from "../components/QueueCard";

export default function Queues() {
    const [queues, setQueues] = useState<Queue[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchQueues()
            .then(setQueues)
            .catch((err) => {
                console.error(err);
                setQueues([]);
            })
            .finally(() => setLoading(false));
    }, []);

    return (
        <>
            <div>
                <h1>Активные очереди</h1>
                {loading ? (
                    <p>Загрузка...</p>
                ) : queues.length === 0 ? (
                    <p>Очередей пока нет.</p>
                ) : (
                    <ul>
                        {queues.map((queue) => (
                            <QueueCard key={queue.id} queue={queue} />
                        ))}
                    </ul>
                )}
            </div>
        </>
    );
}