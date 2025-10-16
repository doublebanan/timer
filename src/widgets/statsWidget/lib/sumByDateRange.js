export const sumByDateRange = (byDay, lessonId, start, end) => {
    if (!byDay || !lessonId) return 0;

    let total = 0;
    for (const [date, lessonsMap] of Object.entries(byDay)) {
        const dateObj = new Date(date);
        if (dateObj >= start && dateObj <= end) {
            const secs = lessonsMap?.[lessonId] ?? 0;
            total += secs;
        }
    }
    return Math.floor(total / 60);
};
