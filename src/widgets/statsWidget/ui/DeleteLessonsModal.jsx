import { ReactComponent as Back } from "../../../shared/assets/icons/back.svg";
import styles from "./StatsWidget.module.css";

export function DeleteLessonModal({ name, onConfirm, onCancel }) {
    return (
        <div className={styles.overlay}>
            <button onClick={onCancel}>
                <Back className={styles.iconPlus} />
            </button>
            <div className={styles.plusBlock}>
                <p className={styles.deleteText}>Delete "{name}"?</p>
                <button className={styles.btnPlus} onClick={onConfirm}>
                    Confirm
                </button>
                <button className={styles.btnPlus} onClick={onCancel}>
                    Cancel
                </button>
            </div>
        </div>
    );
}
