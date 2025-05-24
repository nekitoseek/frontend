export type Student = {
    id: number;
    full_name: string;
    group: string;
    status?: "waiting" | "current" | "done";
    joined_at: string;
};