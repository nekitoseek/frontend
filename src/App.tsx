import { Routes, Route } from 'react-router-dom';
import Welcome from "./pages/Welcome";
import Register from "./pages/Register";
import Login from "./pages/Login";
import QueueDetails from "./pages/QueueDetails";
import Queues from "./pages/Queues";
import './App.css';

export default function App() {

  return (
      <>
          <Routes>
              <Route path="/" element={<Welcome />} />
              <Route path="/register" element={<Register />} />
              <Route path="/login" element={<Login />} />
              <Route path="/queues/:id" element={<QueueDetails />} />
              <Route path="/queues" element={<Queues />} />
          </Routes>
      </>
  );
}