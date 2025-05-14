import { Link } from "react-router-dom";
import { Queue } from "../types/Queue.ts";
import JoinButton from "./JoinButton";

type Props = {
    queue: Queue;
};

export default function QueueCard({ queue }: Props) {
    return (
        <>
            <li>
                <h2>{queue.title}</h2>
                <p>
                    Время проведения: {" "}
                    {new Date(queue.scheduled_date).toLocaleString("ru-RU")}
                </p>
                <p>Статус: {queue.status}</p>

                {queue.description && <p>{queue.description}</p>}
                <JoinButton queueId={queue.id} />
                <Link to={`/queues/${queue.id}`}>Подробнее</Link>
            </li>
        </>
    );
}