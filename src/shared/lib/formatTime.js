export const formatTime = (second) => {
    const mins = Math.floor(second / 60);
    const secs = second % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
        .toString()
        .padStart(2, "0")}`;
};
