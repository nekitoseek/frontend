export default function Footer() {
    return (
        <>
            <footer className="bg-gray-100 border-t border-gray-200 py-6">
                <div className="max-w-7xl mx-auto px-4 py-10 grid grid-cols-1 sm:grid-cols-3 gap-8 text-sm text-gray-600">
                    <div>
                        <h3 className="text-base font-semibold text-gray-800 mb-2">О системе</h3>
                        <p className="text-gray-500">
                            Система электронных очередей для студентов – простой способ записи на сдачу лабораторных и практических работ.
                        </p>
                    </div>
                    <div>
                        <h3 className="text-base font-semibold text-gray-800 mb-2">Навигация</h3>
                        <ul className="space-y-1">
                            <li><a href="/" className="hover:text-sky-600 transition">Главная</a></li>
                            <li><a href="/queues" className="hover:text-sky-600 transition">Очереди</a></li>
                            <li><a href="/profile" className="hover:text-sky-600 transition">Профиль</a></li>
                        </ul>
                    </div>
                    <div>
                        <h3 className="text-base font-semibold text-gray-800 mb-2">Контакты</h3>
                        <ul className="space-y-1">
                            <li>Разработчик: Мамаев Никита</li>
                            <li>Email: <a href="mailto:nmamaev_04@mail.ru" className="text-sky-600 hover:underline">nmamaev_04@mail.ru</a></li>
                            <li className="text-gray-400 mt-2">&copy; {new Date().getFullYear()}</li>
                        </ul>
                    </div>
                </div>
                <div className="border-t border-gray-200 text-center text-xs text-gray-400 py-4">
                    Powered by React, Tailwind & FastAPI · Все права защищены
                </div>
            </footer>
        </>
    );
}