export type Group = {
    id: number;
    name: string;
};

export type Discipline = {
    id: number;
    name: string;
};

export type Queue = {
    id: number;
    title: string;
    description?: string;
    scheduled_date: string;
    scheduled_end: string;
    status: string;
    creator_id: number;
    groups: Group[];
    discipline: Discipline;
};