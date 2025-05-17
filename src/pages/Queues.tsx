import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
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
            <div className="max-w-6xl mx-auto px-4 py-12">
                <div className="flex flex-col sm:flex-row items-center justify-between mb-8 gap-4">
                    <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 text-center sm:text-left">Активные очереди</h1>
                    <Link
                        to="/queues/create"
                        className="inline-block bg-sky-600 hover:bg-sky-700 text-white text-sm font-medium px-5 py-2.5 rounded-xl shadow transition"
                    >
                        Создать очередь
                    </Link>
                </div>
                {loading ? (
                    <p className="text-center text-gray-500 text-sm">Загрузка...</p>
                ) : queues.length === 0 ? (
                    <p className="text-center text-gray-500 text-sm">Очередей пока нет.</p>
                ) : (
                    <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {queues.map((queue) => (
                            <QueueCard key={queue.id} queue={queue} />
                        ))}
                    </ul>
                )}
            </div>
        </>
    );
}