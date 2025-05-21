import {Link} from "react-router-dom";

export default function AdminDashboard() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-sky-50 via-white to-purple-50 px-4 py-12">
            <div className="max-w-4xl w-full bg-white shadow-xl rounded-2xl border border-gray-100 p-8">
                <h1 className="text-3xl font-bold text-gray-800 mb-8 text-center">Админ панель</h1>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                    <Link to="/admin/groups" className="block bg-sky-100 hover:bg-sky-200 text-sky-800 text-center font-medium py-6 px-4 rounded-xl shadow transition" >Управление группами</Link>
                    <Link to="/admin/disciplines" className="block bg-green-100 hover:bg-green-200 text-green-800 text-center font-medium py-6 px-4 rounded-xl shadow transition" >Управление дисциплинами</Link>
                    <Link to="/admin/queues" className="block bg-purple-100 hover:bg-purple-200 text-purple-800 text-center font-medium py-6 px-4 rounded-xl shadow transition" >Управление очередями</Link>
                </div>
            </div>
        </div>
    );
}