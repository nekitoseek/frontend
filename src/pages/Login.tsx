import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from "../api/auth";

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
            const res = await login(data);
            localStorage.setItem('token', res.data.access_token);
            navigate('/queues');
        } catch (err: unknown) {
            alert("Ошибка входа");
            console.error(err);
        }
    };

    return (
        <>
            <div>
                <form onSubmit={handleSubmit}>
                    <h2>Вход</h2>
                    <input type="text" name="username" placeholder="Логин" onChange={handleChange} required />
                    <input type="password" name="password" placeholder="Пароль" onChange={handleChange} required />
                    <button type="submit">Войти</button>
                </form>
            </div>
        </>
    );
}