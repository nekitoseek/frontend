import { Link } from "react-router-dom";
import { Queue } from "../types/Queue.ts";
import JoinButton from "./JoinButton";

type Props = {
    queue: Queue;
};

export default function QueueCard({ queue }: Props) {
    return (
        <>
            <li className="bg-white shadow-md rounded-2xl p-6 flex flex-col justify-between transition hover:shadow-lg border border-gray-100">
                <div>
                    <h2 className="text-xl font-semibold text-gray-800 mb-2">{queue.title}</h2>
                    <p className="text-sm text-gray-500 mb-1">
                        <span className="font-medium">Время проведения:</span>{" "}
                        {new Date(queue.scheduled_date).toLocaleString("ru-RU")}
                    </p>
                    <p className="text-sm text-gray-500 mb-2">
                        <span className="font-medium">Статус:</span> {queue.status}
                    </p>
                    {queue.description && (
                        <p className="text-sm text-gray-600 mb-4">{queue.description}</p>
                    )}
                </div>
                <div className="mt-auto flex items-center justify-between pt-4">
                    <JoinButton queueId={queue.id} />
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