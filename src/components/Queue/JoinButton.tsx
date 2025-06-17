import {useEffect, useState} from "react";
import {joinQueue, fetchQueueStudents} from "../../api/queues";
import {useAuth} from "../../context/AuthContext";
import toast from "react-hot-toast";

type Props = {
    queueId: number;
    status: string;
    onChange?: () => void;
    disabled?: boolean;
    autoCheck?: boolean;
};

export default function JoinButton({queueId, onChange, disabled, autoCheck = false, status}: Props) {
    const {user} = useAuth();
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

    if (status === "closed") return null;
    if (loading) return null;
    const handleJoin = async () => {
        if (isDisabled) return;
        try {
            await joinQueue(queueId);
            toast.success("Вы присоединились к очереди");
            onChange?.();
        } catch (err) {
            console.error(err);
            toast.error("Ошибка присоединения к очереди");
        }
    };

    return (
        <>
            <button
                onClick={handleJoin}
                disabled={isDisabled}
                className={`px-4 py-2 rounded-xl text-sm font-medium shadow transition ${
                    isDisabled
                        ? "w-full sm:w-auto bg-gray-300 text-gray-600 cursor-not-allowed"
                        : "w-full sm:w-auto bg-sky-600 hover:bg-sky-700 text-white"
                }`}
            >
                {isDisabled ? "Вы уже в очереди" : "Присоединиться"}
            </button>
        </>
    );
}