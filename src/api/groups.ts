export const getGroups = async () => {
    const res = await fetch(`/api/groups`);
    if (!res.ok) throw new Error("Ошибка при загрузке групп");
    return res.json();
}