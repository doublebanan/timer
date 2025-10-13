import { ReactComponent as Back } from "../../../shared/assets/icons/back.svg";
import styles from "./StatsWidget.module.css";

export function UpdateLessonModal({ name, onUpdate, onClose, inputRef }) {
    return (
        <div className={styles.overlay}>
            <button onClick={onClose}>
                <Back className={styles.iconPlus} />
            </button>
            <div className={styles.plusBlock}>
                <p className={styles.deleteText}>Rename "{name}"</p>
                <input
                    className={styles.inputPlus}
                    type="text"
                    ref={inputRef}
                    placeholder="Change lesson name"
                />
                <button className={styles.btnPlus} onClick={onUpdate}>
                    Update lesson
                </button>
            </div>
        </div>
    );
}
