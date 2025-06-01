import { Queue } from "../types/Queue";

// отображение очередей
export const fetchQueues = async (status: string, search?:string): Promise<Queue[]> => {
    const token = localStorage.getItem("token");

    const params = new URLSearchParams();
    if (status) params.append("status", status);
    if (search) params.append("search", search);
    const query = params.toString();
    // console.log(search);
    const res = await fetch(`/api/queues${query ? `?${query}` : ""}`, {
        headers: { Authorization: `Bearer ${token}` },
    });

    if (!res.ok) throw new Error("Ошибка загрузки очередей");
    return res.json();
};

// отображение очередей администратору
export const fetchAdminQueues = async (search?: string): Promise<Queue[]> => {
    const token = localStorage.getItem("token");
    const params = new URLSearchParams();

    if (search) params.append("search", search);
    const query = params.toString();

    const res = await fetch(`/api/admin/queues${query ? `?${query}` : ""}`, {
        headers: { Authorization: `Bearer ${token}` },
    });

    if (!res.ok) throw new Error("Ошибка загрузки очередей");
    return res.json();
}

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