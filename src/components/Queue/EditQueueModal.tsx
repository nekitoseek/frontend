import React, {useEffect, useState} from "react";
import {Discipline, Group, Queue} from "../../types/Queue.ts";
import {getGroups} from "../../api/groups.ts";
import toast from "react-hot-toast";


type Props = {
    queue: Queue;
    onClose: () => void;
    onUpdated: () => void;
};

export default function EditQueueModal({queue, onClose, onUpdated}: Props) {
    const [formData, setFormData] = useState({
        title: queue.title,
        description: queue.description || "",
        scheduled_date: queue.scheduled_date.slice(0, 16),
        scheduled_end: queue.scheduled_end.slice(0, 16),
        discipline_id: queue.discipline.id.toString(),
        group_ids: queue.groups.map(g => g.id),
    });

    const [groups, setGroups] = useState<Group[]>([]);
    const [disciplines, setDisciplines] = useState<Discipline[]>([]);
    const token = localStorage.getItem("token");

    useEffect(() => {
        getGroups().then(setGroups).catch(console.error);
        fetch("/api/disciplines/", {
            headers: {Authorization: `Bearer ${token}`},
        }).then(res => res.json()).then(setDisciplines).catch(console.error);
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const {name, value} = e.target;
        setFormData(prev => ({...prev, [name]: value}));
    };

    const toggleGroup = (id: number) => {
        setFormData(prev => ({
            ...prev,
            group_ids: prev.group_ids.includes(id)
                ? prev.group_ids.filter(gid => gid !== id)
                : [...prev.group_ids, id],
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const res = await fetch(`/api/admin/queues/${queue.id}`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
                ...formData,
                discipline_id: Number(formData.discipline_id),
            }),
        });

        if (!res.ok) {
            const err = await res.json();
            toast.error("Ошибка: " + err.detail);
            return;
        }

        toast.success("Очередь обновлена")
        onClose();
        onUpdated();
    };

    return (
        <>
            <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center px-4">
                <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-2xl border border-gray-100">
                    <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Редактирование очереди</h2>
                    <form onSubmit={handleSubmit} className="space-y-5">
                        <input name="title" value={formData.title} onChange={handleChange}
                               className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-sky-400 outline-none transition"
                               required/>
                        <textarea name="description" value={formData.description} onChange={handleChange}
                                  className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-sky-400 outline-none transition resize-none"/>
                        <input type="datetime-local" name="scheduled_date" value={formData.scheduled_date}
                               onChange={handleChange} required
                               className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-sky-400 outline-none transition"/>
                        <input type="datetime-local" name="scheduled_end" value={formData.scheduled_end}
                               onChange={handleChange} required
                               className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-sky-400 outline-none transition"/>
                        <select name="discipline_id" value={formData.discipline_id} onChange={handleChange}
                                className="w-full px-4 py-3 rounded-xl border border-gray-300 bg-white text-gray-700 focus:ring-2 focus:ring-sky-400 outline-none transition"
                                required>
                            <option value="">Выберите дисциплину</option>
                            {disciplines.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
                        </select>
                        <div>
                            <p className="text-gray-700 font-medium mb-2">Группы:</p>
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                                {groups.map(group => (
                                    <label key={group.id}
                                           className="flex items-center gap-2 bg-gray-50 hover:bg-gray-100 border border-gray-200 px-3 py-2 rounded-lg cursor-pointer transition">
                                        <input
                                            type="checkbox"
                                            checked={formData.group_ids.includes(group.id)}
                                            onChange={() => toggleGroup(group.id)}
                                            className="accent-sky-600"
                                        />
                                        <span className="text-gray-800 text-sm">
                                            {group.name}
                                        </span>
                                    </label>
                                ))}
                            </div>
                        </div>
                        <div className="flex justify-end gap-3 pt-4">
                            <button type="button" onClick={onClose}
                                    className="px-4 py-2 text-gray-600 hover:text-gray-800 transition">Отмена
                            </button>
                            <button type="submit"
                                    className="bg-sky-600 hover:bg-sky-700 text-white font-medium px-6 py-2 rounded-xl shadow transition">Сохранить
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
}