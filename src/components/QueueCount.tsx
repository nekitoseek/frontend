import { useEffect, useState } from "react";

type Props = {
    queueId: number;
}

export default function QueueCount({ queueId }: Props) {
    const [count, setCount] = useState<number | null>(null);

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) return;

        fetch(`/api/queues/${queueId}/students`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
            .then((res) => res.json())
            .then((data) => setCount(data.length))
            .catch(() => setCount(null));
    }, [queueId]);

    if (count === null) return null;

    return (
        <span className="text-sm text-gray-600">
            В очереди: <span className="font-medium">{count}</span>
        </span>
    );
}