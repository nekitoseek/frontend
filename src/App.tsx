import {Routes, Route} from 'react-router-dom';
import Home from "./pages/Home";
import Register from "./pages/Register";
import Login from "./pages/Login";
import QueueDetails from "./pages/QueueDetails";
import Queues from "./pages/Queues";
import RequireAuth from "./components/RequireAuth";
import Header from "./components/Header";
import CreateQueuePage from "./pages/CreateQueuePage";
import Profile from "./pages/Profile";
import AdminGroups from "./pages/AdminGroups";
import AdminDashboard from "./pages/AdminDashboard";
import AdminDisciplines from "./pages/AdminDisciplines";
import AdminQueues from "./pages/AdminQueues";
import Footer from "./components/Footer";

export default function App() {

    return (
        <>
            <div className="min-h-screen flex flex-col">
                <Header />
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
                        <Route path="/admin" element={<RequireAuth><AdminDashboard/></RequireAuth>}/>
                    </Routes>
                </main>
                <Footer/>
            </div>
        </>
    );
}