import { minToPx } from "../lib/minToPx";
import styles from "./StatsWidget.module.css";

export function BarsArea({ combined, maxMinutes }) {
    return (
        <div className={styles.barsArea}>
            <div className={styles.bars}>
                {combined.map(([dateKey, mins]) => {
                    const h = minToPx(mins, maxMinutes);
                    const dayLabel = new Date(dateKey).getDate();
                    return (
                        <div key={dateKey} className={styles.barWrap}>
                            <div
                                className={styles.bar}
                                style={{ height: `${h}px` }}
                            />
                            <div className={styles.barLabel}>{mins}m</div>
                            <div className={styles.dateCell}>
                                <div className={styles.dateNum}>{dayLabel}</div>
                                <div className={styles.dateKey}>
                                    {dateKey.slice(5)}
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
