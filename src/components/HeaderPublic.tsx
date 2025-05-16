import { Link } from "react-router-dom";

export default function HeaderPublic() {
    return(
        <>
            <header className="bg-white/60 backdrop-blur-md shadow-sm inset-x-0">
                <div className="max-w-7xl mx-auto px-4 py-5 flex justify-between items-center">
                    <Link to="/" className="text-2xl sm:text-3xl font-bold text-gray-800 tracking-tight">Электронные очереди</Link>
                    <nav className="space-x-4 text-sm sm:text-base font-medium text-gray-700">
                        <Link to="/login"><button className="bg-sky-600 hover:bg-sky-700 text-white py-2 px-4 rounded-xl transition">Войти</button></Link>
                        <Link to="/register"><button className="bg-white hover:bg-gray-100 border border-gray-300 shadow-sm py-2 px-4 rounded-xl transition">Зарегистрироваться</button></Link>
                        {/*<Link to="/queues"><button className="bg-white hover:bg-gray-100 border border-gray-300 shadow-sm py-2 px-4 rounded-xl transition">Очереди</button></Link>*/}
                    </nav>
                </div>
            </header>
        </>
    );
}