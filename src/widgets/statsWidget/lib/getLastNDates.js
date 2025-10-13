export const getLastNDates = (n) => {
    const out = [];
    for (let i = n - 1; i >= 0; i--) {
        const d = new Date();
        d.setDate(d.getDate() - i);
        out.push(d.toISOString().slice(0, 10));
    }
    return out;
};
