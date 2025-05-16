import { joinQueue } from "../api/queues.ts";

type Props = {
    queueId: number;
};

export default function JoinButton({ queueId }: Props) {
    const handleJoin = async () => {
        try {
            await joinQueue(queueId);
            alert("Вы присоединились к очереди");
        } catch (err) {
            console.error(err);
            alert("Ошибка присоединения к очереди");
        }
    };

    return (
        <>
            <button
                onClick={handleJoin}
                className="bg-sky-600 hover:bg-sky-700 text-white text-sm font-medium py-2 px-4 rounded-xl shadow transition"
            >Присоединиться</button>
        </>
    );
}