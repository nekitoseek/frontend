import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function Login() {
    const [formData, setFormData] = useState({username: '', password: ''});
    const navigate = useNavigate();

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({...formData, [event.target.name]: event.target.value});
    };

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();

        const data = new URLSearchParams();
        data.append('username', formData.username);
        data.append('password', formData.password);

        try {
            const response = await axios.post("/api/login", data, {
                headers: { "Content-Type": "application/x-www-form-urlencoded" },
            });

            const token = response.data.access_token;
            localStorage.setItem("token", token);

            // переход на главную после авторизации
            navigate("/");
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
            <div>
                <form onSubmit={handleSubmit} className="">
                    <h2 className="">Вход</h2>
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
                    <button type="submit" className="">Войти</button>
                </form>
            </div>
        </>
    )
}