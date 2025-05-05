import { useEffect, useState } from 'react';
import axios from 'axios';

type Group = {
    id: number;
    name: string;
};

export default function Register() {
    const [groups, setGroups] = useState<Group[]>([]);
    const [formData, setFormData] = useState({
        username: "",
        password: "",
        fullname: "",
        email: "",
        group_id: "",
    });

    useEffect(() => {
       axios.get("http://localhost:8000/groups").then((res) => {
           setGroups(res.data);
       });
    }, []);

    const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [event.target.name]: event.target.value });
    };

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        try {
            await axios.post("http://localhost:8000/register", {
                ...formData,
                group_id: Number(formData.group_id),
            });
            alert("Регистрация прошла успешно");
        } catch (err: unknown) {
            if (axios.isAxiosError(err)) {
                alert(err.response?.data?.detail || "Ошибка входа");
            } else {
                alert("Непредвиденная ошибка");
            }
        }
    };

    return (
        <>
            <div className="">
                <form
                    onSubmit={handleSubmit}
                    className=""
                >
                    <h2 className="">Регистрация</h2>

                    <input
                        type="text"
                        name="username"
                        placeholder="Логин"
                        onChange={handleChange}
                        className=""
                        required
                    />
                    <input
                        type="password"
                        name="password"
                        placeholder="Пароль"
                        onChange={handleChange}
                        className=""
                        required
                    />
                    <input
                        type="text"
                        name="full_name"
                        placeholder="Фамилия, имя"
                        onChange={handleChange}
                        className=""
                        required
                    />
                    <input
                        type="email"
                        name="email"
                        placeholder="Email"
                        onChange={handleChange}
                        className=""
                        required
                    />
                    <select
                        name="group_id"
                        onChange={handleChange}
                        value={formData.group_id}
                        className=""
                        required
                    >
                        <option value="">Выберите группу</option>
                        {groups.map((g) => (
                            <option key={g.id} value={g.id}>
                                {g.name}
                            </option>
                        ))}
                    </select>

                    <button
                        type="submit"
                        className=""
                    >
                        Зарегистрироваться
                    </button>
                </form>
            </div>
        </>
    );
}