import {useEffect, useState} from "react";
import { joinQueue, fetchQueueStudents } from "../api/queues";
import {useAuth} from "../context/AuthContext";

type Props = {
    queueId: number;
    onChange?: () => void;
    disabled?: boolean;
    autoCheck?: boolean;
};

export default function JoinButton({ queueId, onChange, disabled, autoCheck = false }: Props) {
    const { user } = useAuth();
    const [joined, setJoined] = useState(false);
    const [loading, setLoading] = useState(autoCheck);

    useEffect(() => {
        if (!autoCheck) return;

        const checkIfJoined = async () => {
            try {
                const students = await fetchQueueStudents(queueId);
                setJoined(students.some(s => s.id === user?.id));
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        checkIfJoined();
    }, [queueId, user, autoCheck]);

    const isDisabled = autoCheck ? joined : disabled;

    const handleJoin = async () => {
        if (isDisabled) return;
        try {
            await joinQueue(queueId);
            alert("Вы присоединились к очереди");
            onChange?.();
        } catch (err) {
            console.error(err);
            alert("Ошибка присоединения к очереди");
        }
    };

    if (loading) return null;

    return (
        <>
            <button
                onClick={handleJoin}
                disabled={isDisabled}
                className={`px-4 py-2 rounded-xl text-sm font-medium shadow transition ${
                    isDisabled
                        ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                        : "bg-sky-600 hover:bg-sky-700 text-white"
                }`}
            >
                {isDisabled ? "Вы уже в очереди" : "Присоединиться"}
            </button>
        </>
    );
}