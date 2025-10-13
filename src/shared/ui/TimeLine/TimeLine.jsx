import { useMemo } from "react";
import styles from "./TimeLine.module.css";

export function Timeline({ duration = 60, elapsed = 0 }) {
    const total = Number(duration) || 0;
    const el = Math.max(0, Number(elapsed) || 0);
    const progress = total > 0 ? Math.min(el / total, 1) : 0;

    const marks = useMemo(() => {
        if (total <= 0) return [];
        const step = 15;
        const arr = [];
        for (let s = 0; s <= total; s += step) arr.push(s);
        if (arr[arr.length - 1] !== total) arr.push(total);
        return arr;
    }, [total]);

    const translate = `calc(50% - ${progress * 100}%)`;

    return (
        <div className={styles.timelineWrapper}>
            <div
                className={styles.timeline}
                style={{
                    transform: `translateX(${translate})`,
                }}
            >
                {marks.map((sec) => {
                    const minute = Math.floor(sec / 60);
                    const isMajor = sec % 60 === 0;
                    const isMedium = sec % 30 === 0 && !isMajor;
                    const left = total > 0 ? (sec / total) * 100 : 0;
                    return (
                        <div
                            key={sec}
                            className={styles.mark}
                            style={{
                                left: `${left}%`,
                                transform: "translateX(-50%)",
                            }}
                        >
                            <div
                                className={`${styles.tick} ${
                                    isMajor
                                        ? styles.major
                                        : isMedium
                                        ? styles.medium
                                        : styles.minor
                                }`}
                            />
                            {isMajor && (
                                <div className={styles.label}>{minute}</div>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
