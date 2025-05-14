import { Queue } from "../types/Queue";

// отображение очередей
export const fetchQueues = async (): Promise<Queue[]> => {
    const token = localStorage.getItem("token");
    const res = await fetch(`/api/queues`, {
        headers: { Authorization: `Bearer ${token}` },
    });

    if (!res.ok) throw new Error("Ошибка загрузки очередей");
    return res.json();
};

// присоединение к очереди
export const joinQueue = async (queueId: number) => {
    const token = localStorage.getItem("token");
    const res = await fetch(`/api/queues/${queueId}/join`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
    });

    if (!res.ok) throw new Error("Ошибка присоединения к очереди");
};

// покидание очереди
export const leaveQueue = async (queueId: number) => {
    const token = localStorage.getItem("token");
    const res = await fetch(`/api/queues/${queueId}/leave`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
    });

    if (!res.ok) throw new Error("Ошибка выхода из очереди");
};

// отображение студентов в очереди
export const fetchQueueStudents = async (queueId: number) => {
    const token = localStorage.getItem("token");
    const res = await fetch(`/api/queues/${queueId}/students`, {
        headers: { Authorization: `Bearer ${token}` },
    });

    if (!res.ok) throw new Error("Не удалось загрузить участников");
    return res.json();
};