export default function HelloSection() {
    return (
        <section className="bg-gradient-to-br from-sky-100 via-white to-purple-100 py-24">
            <div className="max-w-6xl mx-auto px-4 flex flex-col-reverse md:flex-row items-center justify-between gap-10">
                <div className="text-center md:text-left w-full md:w-1/2">
                    <h2 className="text-4xl sm:text-5xl font-extrabold text-gray-900 leading-tight mb-6">
                        Больше никакой толкучки
                    </h2>
                    <p className="text-gray-600 text-lg sm:text-xl mb-8">
                        Занимайте очередь в онлайн-режиме на сдачу и защиту всех видов работ по различным дисциплинам.
                    </p>
                    <a href="/register" className="inline-block px-6 py-3 bg-sky-600 hover:bg-sky-700 text-white font-medium rounded-xl shadow-md transition">Сделать правильный выбор</a>
                </div>
                <div className="w-full md:w-1/2">
                    <img src="/homeimage.png" alt="Онлайн очередь" className="w-full max-w-md mx-auto rounded-2xl shadow-xl" />
                </div>
            </div>
        </section>
    );
}