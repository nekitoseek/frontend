import React, { useEffect, useState } from "react";
import Select from "react-select";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { ru } from "date-fns/locale";
import { Discipline, Group, Queue } from "../../types/Queue.ts";
import { getGroups } from "../../api/groups.ts";
import toast from "react-hot-toast";

type Props = {
    queue: Queue;
    onClose: () => void;
    onUpdated: () => void;
};

export default function EditQueueModal({ queue, onClose, onUpdated }: Props) {
    const [formData, setFormData] = useState({
        title: queue.title,
        description: queue.description || "",
        scheduled_date: queue.scheduled_date,
        scheduled_end: queue.scheduled_end,
        discipline_id: queue.discipline.id.toString(),
        group_ids: queue.groups.map(g => g.id),
    });

    const [groups, setGroups] = useState<Group[]>([]);
    const [disciplines, setDisciplines] = useState<Discipline[]>([]);
    const token = localStorage.getItem("token");

    useEffect(() => {
        getGroups().then(setGroups).catch(console.error);
        fetch("/api/disciplines/", {
            headers: { Authorization: `Bearer ${token}` },
        })
            .then(res => res.json())
            .then(setDisciplines)
            .catch(console.error);
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
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

        toast.success("Очередь обновлена");
        onClose();
        onUpdated();
    };

    return (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center px-4">
            <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-2xl border border-gray-100">
                <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Редактирование очереди</h2>
                <form onSubmit={handleSubmit} className="space-y-5">
                    <input
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-sky-400 outline-none transition"
                        placeholder="Название очереди"
                        required
                    />
                    <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-sky-400 outline-none transition resize-none"
                        placeholder="Описание (необязательно)"
                    />

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-600 mb-1">Дата и время начала</label>
                            <DatePicker
                                selected={new Date(formData.scheduled_date)}
                                onChange={(date) =>
                                    setFormData(prev => ({
                                        ...prev,
                                        scheduled_date: date ? date.toISOString() : ""
                                    }))
                                }
                                showTimeSelect
                                timeFormat="HH:mm"
                                timeIntervals={15}
                                dateFormat="dd.MM.yyyy HH:mm"
                                minDate={new Date()}
                                locale={ru}
                                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-sky-400 outline-none transition"
                                placeholderText="Выберите дату и время"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-600 mb-1">Дата и время окончания</label>
                            <DatePicker
                                selected={new Date(formData.scheduled_end)}
                                onChange={(date) =>
                                    setFormData(prev => ({
                                        ...prev,
                                        scheduled_end: date ? date.toISOString() : ""
                                    }))
                                }
                                showTimeSelect
                                timeFormat="HH:mm"
                                timeIntervals={15}
                                dateFormat="dd.MM.yyyy HH:mm"
                                minDate={new Date()}
                                locale={ru}
                                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-sky-400 outline-none transition"
                                placeholderText="Выберите дату и время"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-600 mb-1">Дисциплина</label>
                        <Select
                            options={disciplines.map(d => ({ value: d.id, label: d.name }))}
                            value={disciplines.filter(d => d.id.toString() === formData.discipline_id).map(d => ({ value: d.id, label: d.name }))[0] || null}
                            onChange={(selected) => {
                                setFormData(prev => ({
                                    ...prev,
                                    discipline_id: selected ? String(selected.value) : ""
                                }));
                            }}
                            placeholder="Выберите дисциплину..."
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-600 mb-2">Группы</label>
                        <Select
                            isMulti
                            options={groups.map(g => ({ value: g.id, label: g.name }))}
                            value={groups.filter(g => formData.group_ids.includes(g.id)).map(g => ({ value: g.id, label: g.name }))}
                            onChange={(selected) => {
                                const ids = selected.map((s) => s.value);
                                setFormData(prev => ({ ...prev, group_ids: ids }));
                            }}
                            placeholder="Выберите группы..."
                        />
                    </div>

                    <div className="flex justify-end gap-3 pt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 text-gray-600 hover:text-gray-800 transition"
                        >
                            Отмена
                        </button>
                        <button
                            type="submit"
                            className="bg-sky-600 hover:bg-sky-700 text-white font-medium px-6 py-2 rounded-xl shadow transition"
                        >
                            Сохранить
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}