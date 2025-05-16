export default function Footer() {
    return (
        <>
            <footer className="bg-white border-t border-gray-200 py-6 mt-20">
                <div className="text-center text-xs sm:text-sm text-gray-400">
                    © {new Date().getFullYear()} Система электронных очередей, созданная для удобства студентов · Разработчик: Мамаев Никита
                </div>
            </footer>
        </>
    );
}