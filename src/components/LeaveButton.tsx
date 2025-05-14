import { leaveQueue } from "../api/queues";

type Props = {
    queueId: number;
};

export default function LeaveButton({ queueId }: Props) {
    const handleLeave = async () => {
        try {
            await leaveQueue(queueId);
            alert("Вы покинули очередь");
        } catch (err) {
            console.error(err);
            alert("Ошибка при выходе из очереди");
        }
    };

    return (
        <>
            <button onClick={handleLeave}>
                Покинуть очередь
            </button>
        </>
    )
}