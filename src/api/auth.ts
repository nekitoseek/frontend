export const login = async (data: URLSearchParams) => {
    const res = await fetch("/api/login", {
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
        },
        body: data.toString(),
    });

    if (!res.ok) {
        const error = await res.json();
        throw new Error(error.detail || "Ошибка входа");
    }
    return res.json();
};

export const getCurrentUser = async () => {
    const token = localStorage.getItem("token");
    if (!token) return null;

    const res = await fetch("/api/me", {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    if (!res.ok) {
        return null;
    }
    return res.json();
};