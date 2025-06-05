import {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import Select from "react-select";
import { ru } from "date-fns/locale";
import DatePicker from "react-datepicker";
import {getGroups} from "../../api/groups";
import {Group} from "../../types/Queue";
import toast from "react-hot-toast";

export default function CreateQueuePage() {
    const navigate = useNavigate();

    type Discipline = { id: number; name: string };

    const [startDate, setStartDate] = useState<Date | null>(null);
    const [endDate, setEndDate] = useState<Date | null>(null);
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
        const {name, value} = e.target;
        setFormData((prev) => ({...prev, [name]: value}));
    };

    // const toggleGroup = (id: number) => {
    //     setFormData((prev) => ({
    //         ...prev,
    //         group_ids: prev.group_ids.includes(id)
    //             ? prev.group_ids.filter((g) => g !== id)
    //             : [...prev.group_ids, id],
    //     }));
    // };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const startDate = new Date(formData.scheduled_date);
        const endDate = new Date(formData.scheduled_end);
        const now = new Date();
        const oneDayLater = new Date(now.getTime() + 24 * 60 * 60 * 1000);

        if (startDate > oneDayLater) {
            toast.error("Очередь можно создать не ранее, чем за 1 день до начала сдачи");
            return;
        }

        if (endDate < startDate) {
            toast.error("Дата окончания не может быть раньше даты начала");
            return;
        }

        if (formData.group_ids.length === 0) {
            toast.error("Выберите хотя бы одну группу");
            return;
        }
        const token = localStorage.getItem("token");

        const response = await fetch("/api/queues", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(formData),
        });

        if (response.ok) {
            toast.success("Очередь создана");
            navigate("/queues");
        } else {
            const error = await response.json();
            toast.error("Ошибка: " + error.detail);
        }
    };

    return (
        <>
            <div
                className="min-h-screen flex items-center justify-center bg-gradient-to-br from-sky-50 via-white to-purple-50 px-4 py-12">
                <div className="bg-white shadow-xl rounded-2xl p-8 w-full max-w-2xl border border-gray-100">
                    <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Создание новой очереди</h2>
                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div>
                            <label className="block text-sm font-medium text-gray-600 mb-1">Название очереди</label>
                            <input
                                name="title"
                                value={formData.title}
                                onChange={handleChange}
                                placeholder="Название очереди"
                                required
                                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-sky-400 outline-none transition"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-600 mb-1">Описание</label>
                            <textarea
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                placeholder="Описание (необязательно)"
                                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-sky-400 outline-none transition resize-none"
                            />
                        </div>
                        {/*<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">*/}
                        {/*    <div>*/}
                        {/*        <label className="block text-sm font-medium text-gray-600 mb-1">Дата и время*/}
                        {/*            начала</label>*/}
                        {/*        <input*/}
                        {/*            type="datetime-local"*/}
                        {/*            name="scheduled_date"*/}
                        {/*            value={formData.scheduled_date}*/}
                        {/*            onChange={handleChange}*/}
                        {/*            required*/}
                        {/*            className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-sky-400 outline-none transition"*/}
                        {/*        />*/}
                        {/*    </div>*/}
                        {/*    <div>*/}
                        {/*        <label className="block text-sm font-medium text-gray-600 mb-1">Дата и время*/}
                        {/*            окончания</label>*/}
                        {/*        <input*/}
                        {/*            type="datetime-local"*/}
                        {/*            name="scheduled_end"*/}
                        {/*            value={formData.scheduled_end}*/}
                        {/*            onChange={handleChange}*/}
                        {/*            required*/}
                        {/*            className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-sky-400 outline-none transition"*/}
                        {/*        />*/}
                        {/*    </div>*/}
                        {/*</div>*/}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-600 mb-1">Дата и время начала</label>
                                <DatePicker
                                    selected={startDate}
                                    onChange={(date) => {
                                        setStartDate(date);
                                        setFormData(prev => ({
                                            ...prev,
                                            scheduled_date: date ? date.toISOString() : ""
                                        }));
                                    }}
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
                                    selected={endDate}
                                    onChange={(date) => {
                                        setEndDate(date);
                                        setFormData(prev => ({
                                            ...prev,
                                            scheduled_end: date ? date.toISOString() : ""
                                        }));
                                    }}
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
                                onChange={(selected) => {
                                    setFormData(prev => ({
                                        ...prev, discipline_id: selected ? String(selected.value) : ""
                                    }));
                                }}
                                value={
                                    disciplines.length
                                        ? disciplines
                                        .map(d => ({ value: d.id, label: d.name }))
                                        .find(opt => opt.value === Number(formData.discipline_id)) || null
                                        : null
                                }
                                placeholder="Выберите дисциплину"
                                isClearable
                                className="react-select-container"
                                classNamePrefix="react-select"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-600 mb-2">Группы:</label>
                            <Select
                                isMulti
                                options={groups.map(g => ({ value: g.id, label: g.name }))}
                                onChange={(selected) => {
                                    const ids = selected.map((s) => s.value);
                                    setFormData((prev) => ({...prev, group_ids: ids}));
                                }}
                                className="react-select-container"
                                classNamePrefix="react-select"
                                placeholder="Выберите группы..."
                            />
                            <div className="mt-3 flex flex-wrap gap-2">
                                {groups
                                    .filter(g => formData.group_ids.includes(g.id))
                                    .map(g => (
                                        <span key={g.id} className="bg-sky-100 text-sky-800 text-sm px-3 py-1 rounded-full shadow-sm">
                                            {g.name}
                                        </span>
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