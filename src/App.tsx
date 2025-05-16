import { Routes, Route } from 'react-router-dom';
import Home from "./pages/Home";
import Register from "./pages/Register";
import Login from "./pages/Login";
import QueueDetails from "./pages/QueueDetails";
import Queues from "./pages/Queues";
import RequireAuth from "./components/RequireAuth";
import { useAuth } from "./context/AuthContext";
import HeaderPrivate from "./components/HeaderPrivate.tsx";
import HeaderPublic from "./components/HeaderPublic.tsx";
// import './App.css';

export default function App() {
    const { user, loading } = useAuth();

    if (loading) return null;

    return (
        <>
            {user ? <HeaderPrivate /> : <HeaderPublic />}
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/queues/:id" element={
                    <RequireAuth>
                        <QueueDetails />
                    </RequireAuth>
                }/>
                <Route path="/queues" element={
                    <RequireAuth>
                        <Queues />
                    </RequireAuth>
                }
                />
            </Routes>
        </>
    );
}