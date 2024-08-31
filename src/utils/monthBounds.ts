export const monthBounds = (date: Date): { firstDay: Date; lastDay: Date } => {
    const firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
    const lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0, 23, 59, 59, 999);
    return { firstDay, lastDay };
};

export default monthBounds;
