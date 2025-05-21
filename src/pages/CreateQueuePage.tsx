import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getGroups } from "../api/groups";
import { Group } from "../types/Queue";

export default function CreateQueuePage() {
    const navigate = useNavigate();

    type Discipline = { id: number; name: string };

    const [groups, setGroups] = useState<Group[]>([]);
    const [disciplines, setDisciplines] = useState<Discipline[]>([]);
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        scheduled_date: "",
        scheduled_end: "",
        discipline_id: "",
        group_ids: [] as number[],
    });

    useEffect(() => {
        getGroups().then(setGroups).catch(() => setGroups([]));

        const token = localStorage.getItem("token");
        fetch("/api/disciplines", {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
            .then((res) => res.json())
            .then(setDisciplines)
            .catch(() => setDisciplines([]));
    }, []);

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const toggleGroup = (id: number) => {
        setFormData((prev) => ({
            ...prev,
            group_ids: prev.group_ids.includes(id)
                ? prev.group_ids.filter((g) => g !== id)
                : [...prev.group_ids, id],
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const token = localStorage.getItem("token");

        if (formData.group_ids.length === 0) {
            alert("Выберите хотя бы одну группу");
            return;
        }

        const response = await fetch("/api/queues", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(formData),
        });

        if (response.ok) {
            alert("Очередь создана");
            navigate("/queues");
        } else {
            const error = await response.json();
            alert("Ошибка: " + error.detail);
        }
    };

    return (
        <>
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-sky-50 via-white to-purple-50 px-4 py-12">
                <div className="bg-white shadow-xl rounded-2xl p-8 w-full max-w-2xl border border-gray-100">
                <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Создание новой очереди</h2>
                    <form onSubmit={handleSubmit} className="space-y-5" >
                        <input
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            placeholder="Название очереди"
                            required
                            className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-sky-400 outline-none transition"
                        />
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            placeholder="Описание (необязательно)"
                            className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-sky-400 outline-none transition resize-none"
                        />
                        <input
                            type="datetime-local"
                            name="scheduled_date"
                            value={formData.scheduled_date}
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-sky-400 outline-none transition"
                        />
                        <input
                            type="datetime-local"
                            name="scheduled_end"
                            value={formData.scheduled_end}
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-sky-400 outline-none transition"
                        />
                        <select
                            name="discipline_id"
                            value={formData.discipline_id}
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-3 rounded-xl border border-gray-300 bg-white text-gray-700 focus:ring-2 focus:ring-sky-400 outline-none transition"
                        >
                            <option value="">Выберите дисциплину</option>
                            {disciplines.map((d) => (
                                <option key={d.id} value={d.id}>{d.name}</option>
                            ))}
                        </select>
                        <div>
                            <p className="text-gray-700 font-medium mb-2">Группы:</p>
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                                {groups.map((group) => (
                                    <label key={group.id} className="flex items-center space-x-2 bg-gray-50 hover:bg-gray-100 border border-gray-200 px-3 py-2 rounded-lg cursor-pointer transition">
                                        <input
                                            type="checkbox"
                                            checked={formData.group_ids.includes(group.id)}
                                            onChange={() => toggleGroup(group.id)}
                                            className="accent-sky-600"
                                        />
                                        <span className="text-gray-800 text-sm">{group.name}</span>
                                    </label>
                                ))}
                            </div>
                        </div>
                        <button
                            type="submit"
                            className="w-full bg-sky-600 hover:bg-sky-700 text-white font-medium py-3 rounded-xl shadow transition"
                        >
                            Создать очередь
                        </button>
                    </form>
                </div>
            </div>
        </>
    );
}