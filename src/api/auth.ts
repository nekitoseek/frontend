import axios from "axios";

export const login = (data: URLSearchParams) => {
    return axios.post("/api/login", data, {
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
    });
};

export const getCurrentUser = async () => {
    const token = localStorage.getItem("token");
    if (!token) return null;

    const response = await axios.get("/api/me", {
        headers: {
            Authorization: `Bearer ${token}` },
    });
    return response.data;
};