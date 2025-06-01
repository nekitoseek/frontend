import {Routes, Route} from 'react-router-dom';
import {Toaster} from "react-hot-toast";
import Home from "./pages/Home";
import Register from "./pages/Authorization/Register.tsx";
import Login from "./pages/Authorization/Login.tsx";
import QueueDetails from "./pages/Queues/QueueDetails.tsx";
import Queues from "./pages/Queues/Queues.tsx";
import RequireAuth from "./components/RequireAuth";
import Header from "./components/Header";
import CreateQueuePage from "./pages/Queues/CreateQueuePage.tsx";
import Profile from "./pages/Profile";
import AdminGroups from "./pages/AdminPages/AdminGroups.tsx";
import AdminDashboard from "./pages/AdminPages/AdminDashboard.tsx";
import AdminDisciplines from "./pages/AdminPages/AdminDisciplines.tsx";
import AdminQueues from "./pages/AdminPages/AdminQueues.tsx";
import Footer from "./components/Footer";
import AdminUsers from "./pages/AdminPages/AdminUsers.tsx";
import AdminUserProfile from "./pages/AdminPages/AdminUserProfile.tsx";

export default function App() {

    return (
        <>
            <div className="min-h-screen flex flex-col">
                <Header/>
                <main className="flex-1">
                    <Routes>
                        <Route path="/" element={<Home/>}/>
                        <Route path="/login" element={<Login/>}/>
                        <Route path="/register" element={<Register/>}/>
                        <Route path="/profile" element={
                            <RequireAuth>
                                <Profile/>
                            </RequireAuth>
                        }/>
                        <Route path="/queues/:id" element={
                            <RequireAuth>
                                <QueueDetails/>
                            </RequireAuth>
                        }/>
                        <Route path="/queues/create" element={
                            <RequireAuth>
                                <CreateQueuePage/>
                            </RequireAuth>
                        }/>
                        <Route path="/queues" element={
                            <RequireAuth>
                                <Queues/>
                            </RequireAuth>
                        }
                        />
                        <Route path="/admin/groups" element={<RequireAuth><AdminGroups/></RequireAuth>}/>
                        <Route path="/admin/disciplines" element={<RequireAuth><AdminDisciplines/></RequireAuth>}/>
                        <Route path="/admin/queues" element={<RequireAuth><AdminQueues/></RequireAuth>}/>
                        <Route path="/admin/users/:userId" element={<RequireAuth><AdminUserProfile/></RequireAuth>}/>
                        <Route path="/admin/users" element={<RequireAuth><AdminUsers/></RequireAuth>}/>
                        <Route path="/admin" element={<RequireAuth><AdminDashboard/></RequireAuth>}/>
                    </Routes>
                </main>
                <Footer/>
                <Toaster
                    position="top-center"
                    toastOptions={{
                        className: "bg-white border border-gray-200 text-center text-sm text-gray-800 rounded-xl shadow-xl px-4 py-3 max-w-md w-full",
                        duration: 5000,
                        success: {
                            iconTheme: {
                                primary: '#22c55e',
                                secondary: '#ecfdf5',
                            },
                        },
                        error: {
                            iconTheme: {
                                primary: '#ef4444',
                                secondary: '#fef2f2',
                            },
                        },
                    }}
                    containerClassName="!z-[99999]"
                    reverseOrder={false}
                />
            </div>
        </>
    );
}