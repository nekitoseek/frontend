import { Routes, Route } from 'react-router-dom';
import Register from "./pages/Register";
import Login from "./pages/Login";
import './App.css';

export default function App() {

  return (
      <>
          <Routes>
              <Route path="/" element={<Register />} />
              <Route path="/login" element={<Login />} />
          </Routes>
      </>
  );
}