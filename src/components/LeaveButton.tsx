import { leaveQueue } from "../api/queues";

type Props = {
    queueId: number;
    onChange?: () => void;
};

export default function LeaveButton({ queueId, onChange }: Props) {
    const handleLeave = async () => {
        try {
            await leaveQueue(queueId);
            alert("Вы покинули очередь");
            onChange?.();
        } catch (err) {
            console.error(err);
            alert("Ошибка при выходе из очереди");
        }
    };

    return (
        <>
            <button
                onClick={handleLeave}
                className="bg-red-100 hover:bg-red-200 text-red-700 font-medium text-sm py-2 px-4 rounded-xl transition shadow-sm"
            >
                Покинуть очередь
            </button>
        </>
    )
}