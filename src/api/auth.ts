import axios from "axios";

export const login = (data: URLSearchParams) => {
    return axios.post("/api/login", data, {
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
    });
};

export const getCurrentUser = () => {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("Токен отстутствует");

    return axios.get("/api/me", {
        headers: { Authorization: `Bearer ${token}` },
    });
};