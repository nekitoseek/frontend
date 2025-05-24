import {useState} from "react";
import { Link } from "react-router-dom";
import { Queue } from "../types/Queue";
import JoinButton from "./JoinButton";
import QueueCount from "./QueueCount";

type Props = {
    queue: Queue;
};

export default function QueueCard({ queue }: Props) {
    const [version, setVersion] = useState(0);
    const handleJoin = () => {
        setVersion(prev => prev + 1);
    };

    return (
        <>
            <li className="bg-white shadow-md rounded-2xl p-6 flex flex-col justify-between transition hover:shadow-lg border border-gray-100">
                <div>
                    <h2 className="text-xl font-semibold text-gray-800 mb-2">{queue.title}</h2>
                    <p className="text-sm text-gray-500 mb-1">
                        <span className="font-medium">Время проведения:</span>{" "}
                        с {new Date(queue.scheduled_date).toLocaleString("ru-RU", { hour: "2-digit", minute: "2-digit"})} до {new Date(queue.scheduled_end).toLocaleString("ru-RU", { hour: "2-digit", minute: "2-digit"})}{" "}
                        {new Date(queue.scheduled_date).toLocaleDateString("ru-RU")}
                    </p>
                    <p className="text-sm text-gray-500 mb-1">
                        <span className="font-medium">Статус:</span>{" "}
                        {queue.status === "active" ? (<span className="text-green-600 font-medium">Активна</span>) : (<span className="text-red-600 font-medium">Закрыта</span>)}
                    </p>
                    {/*{queue.description && (*/}
                    {/*    <p className="text-sm text-gray-600 mb-4">{queue.description}</p>*/}
                    {/*)}*/}
                    <p className="text-sm text-gray-500 mb-1">
                        <span className="font-medium">Дисциплина:</span> {queue.discipline.name}
                    </p>
                    {queue.groups && queue.groups.length > 0 && (
                        <p className="text-sm text-gray-500 mb-2">
                            <span className="font-medium">Группы:</span>{" "}
                            {queue.groups.map((g) => g.name).join(", ")}
                        </p>
                    )}
                    <QueueCount queueId={queue.id} key={version} />
                </div>
                <div className="mt-auto flex items-center justify-between pt-4">
                    <JoinButton key={version} queueId={queue.id} autoCheck onChange={handleJoin} />
                    <Link
                        to={`/queues/${queue.id}`}
                        className="text-sky-600 hover:underline text-sm font-medium transition"
                    >
                        Подробнее
                    </Link>
                </div>
            </li>
        </>
    );
}