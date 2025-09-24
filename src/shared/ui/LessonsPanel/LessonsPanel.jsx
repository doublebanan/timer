import styles from "./LessonsPanel.module.css";

export const LessonsPanel = ({ value, onChange, onClose }) => {
    return (
        <div className={styles.leassonsPanel}>
            <button className={styles.btn} onClick={() => onChange("html")}>
                html
            </button>
            <button className={styles.btn} onClick={() => onChange("js")}>
                js
            </button>
            <button className={styles.btn} onClick={() => onChange("english")}>
                english
            </button>
            <button className={styles.btnClose} onClick={onClose}>
                close
            </button>
        </div>
    );
};
