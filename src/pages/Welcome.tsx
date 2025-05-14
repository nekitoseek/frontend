import { Link } from "react-router-dom";

export default function Welcome() {
    return(
        <>
            <div>
                <h1>Добро пожаловать!</h1>
                <Link to="/register">Зарегистрироваться</Link>
                <Link to="/login">Войти</Link>
            </div>
        </>
    );
}