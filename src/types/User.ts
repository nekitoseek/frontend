export type User = {
    id: number;
    username: string;
    full_name: string;
    email: string;
    group_id: number;
    group?: {
        id: number;
        name: string;
    };
    is_admin: boolean;
    is_active: boolean;
};