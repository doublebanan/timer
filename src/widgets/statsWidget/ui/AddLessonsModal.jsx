import { ReactComponent as Back } from "../../../shared/assets/icons/back.svg";
import styles from "./StatsWidget.module.css";

export function AddLessonModal({ onClose, onSubmit, inputRef }) {
    return (
        <div className={styles.overlay}>
            <button onClick={onClose}>
                <Back className={styles.iconPlus} />
            </button>
            <div className={styles.plusBlock}>
                <input
                    className={styles.inputPlus}
                    type="text"
                    ref={inputRef}
                    placeholder="Add new lesson"
                />
                <button className={styles.btnPlus} onClick={onSubmit}>
                    Add lesson
                </button>
            </div>
        </div>
    );
}
