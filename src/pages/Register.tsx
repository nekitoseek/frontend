import { useEffect, useState } from 'react';
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth.ts";
import { getGroups } from "../api/groups";

type Group = {
    id: number;
    name: string;
};

export default function Register() {
    const { user, loading } = useAuth();
    const navigate = useNavigate();

    const [groups, setGroups] = useState<Group[]>([]);
    const [formData, setFormData] = useState({
        username: "",
        password: "",
        fullname: "",
        email: "",
        group_id: "",
    });

    useEffect(() => {
        if (!loading && user) {
            navigate("/queues");
        }
    }, [user, loading]);

    useEffect(() => {
        getGroups().then(setGroups).catch(console.error);
    }, []);

    const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [event.target.name]: event.target.value });
    };

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        try {
            await fetch("/api/register", {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({
                    ...formData,
                    group_id: Number(formData.group_id),
                }),
            });
            alert("Регистрация прошла успешно");
            navigate("/login");
        } catch (err) {
            console.error(err);
            alert("Ошибка регистрации")
        }
    };

    return (
        <>
            <div>
                <form onSubmit={handleSubmit}>
                    <h2>Регистрация</h2>
                    <input type="text" name="username" placeholder="Логин" onChange={handleChange} required />
                    <input type="password" name="password" placeholder="Пароль" onChange={handleChange} required />
                    <input type="text" name="full_name" placeholder="Фамилия, имя" onChange={handleChange} required />
                    <input type="email" name="email" placeholder="Email" onChange={handleChange} required />
                    <select name="group_id" onChange={handleChange} value={formData.group_id} required>
                        <option value="">Выберите группу</option>
                        {groups.map((g) => (
                            <option key={g.id} value={g.id}>
                                {g.name}
                            </option>
                        ))}
                    </select>
                    <button type="submit">Зарегистрироваться</button>
                    <Link to="/login">Уже есть аккаунт?</Link>
                </form>
            </div>
        </>
    );
}