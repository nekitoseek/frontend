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
            <button onClick={handleJoin}>Присоединиться</button>
        </>
    );
}