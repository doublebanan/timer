import { ReactComponent as Setting } from "../../../shared/assets/icons/setting.svg";
import { ReactComponent as Delete } from "../../../shared/assets/icons/delete.svg";

import styles from "./StatsWidget.module.css";

export function LessonList({
    lessons,
    currentLessonId,
    onSelect,
    onEdit,
    onDelete,
}) {
    return (
        <ul className={styles.lessonList}>
            {lessons?.map((l) => (
                <li key={l.id} className={styles.lessonItem}>
                    <button
                        className={`${styles.lessonBtn} ${
                            l.id === currentLessonId ? styles.active : ""
                        }`}
                        onClick={() => onSelect(l.id)}
                    >
                        {l.name}
                    </button>
                    <div className={styles.lessonBlock}>
                        <button onClick={() => onEdit(l.id)}>
                            <Setting className={styles.iconLesson} />
                        </button>
                        <button onClick={() => onDelete(l.id)}>
                            <Delete className={styles.iconLesson} />
                        </button>
                    </div>
                </li>
            ))}
        </ul>
    );
}
