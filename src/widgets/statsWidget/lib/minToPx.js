export const minToPx = (mins, maxMins) =>
    maxMins ? Math.round((mins / maxMins) * 160) : 0;
