import { useEffect, useState } from "react";
import { getCurrentUser } from "../api/auth";
import { User } from "../types/User";

export function useAuth() {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getCurrentUser()
            .then((data) => setUser(data))
            .catch(() => setUser(null))
            .finally(() => setLoading(false));
    }, []);
    return { user, loading };
}