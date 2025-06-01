import {useEffect, useState} from "react";
import {Link} from "react-router-dom";
import {Queue} from "../../types/Queue.ts";
import {fetchQueues} from "../../api/queues.ts";
import QueueCard from "../../components/Queue/QueueCard.tsx";
import {SearchInput} from "../../components/Queue/SearchInput.tsx";

const statuses = [
    {label: "Активные", value: "active"},
    {label: "Предстоящие", value: "upcoming"},
    {label: "Прошедшие", value: "closed"},
    {label: "Все", value: "all"},
];

export default function Queues() {
    const [queues, setQueues] = useState<Queue[]>([]);
    const [loading, setLoading] = useState(true);
    const [status, setStatus] = useState("active");
    const [search, setSearch] = useState("");

    useEffect(() => {
        setLoading(true);
        fetchQueues(status, search)
            .then(setQueues)
            .catch((err) => {
                console.error(err);
                setQueues([]);
            })
            .finally(() => setLoading(false));
    }, [status, search]);

    return (
        <>
            <div className="max-w-6xl mx-auto px-4 py-12">
                <div className="flex flex-col items-center mb-8 gap-4">
                    <SearchInput value={search} onChange={setSearch}
                                 placeholder="Поиск по названию, дисциплине, группе..." className="mt-[-1rem]"/>
                    <div className="flex flex-col sm:flex-row items-center justify-between mb-8 gap-4">
                        <div className="flex gap-2 flex-wrap">
                            {statuses.map((s) => (
                                <button key={s.value} onClick={() => setStatus(s.value)}
                                        className={`px-4 py-2 rounded-full text-sm font-medium transition border
                                ${status === s.value ? "bg-sky-600 text-white border-sky-600 shadow-sm" : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"}`}
                                >
                                    {s.label}
                                </button>
                            ))}
                        </div>
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
                                <QueueCard key={queue.id} queue={queue}/>
                            ))}
                        </ul>
                    )}
                </div>
            </div>
        </>
    );
}