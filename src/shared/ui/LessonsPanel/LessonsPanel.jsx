import { useTimerDataStore } from "../../../store/timer/timer-data";

import styles from "./LessonsPanel.module.css";

export const LessonsPanel = ({ value, onChange, onClose }) => {
    const lessons = useTimerDataStore((s) => s.lessons);

    return (
        <div className={styles.leassonsPanel}>
            {lessons.map((item) => {
                return (
                    <button
                        key={item.id}
                        className={`${styles.btn} ${
                            value === item.id ? styles.active : ""
                        }`}
                        onClick={() => onChange(item.id)}
                    >
                        {item.name}
                    </button>
                );
            })}

            <button className={styles.btnClose} onClick={onClose}>
                close
            </button>
        </div>
    );
};
