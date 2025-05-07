import axios from "axios";

export const getCurrentUser = async () => {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("Токен отстутствует");

    const response = await axios.get("/api/me", {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    return response.data;
};