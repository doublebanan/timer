import { Link } from "react-router-dom";

import { useTimer } from "../../../store/timer";

import { useDurationField } from "../../../features/timer/hooks/useDurationField";

import { ReactComponent as Back } from "../../../shared/assets/icons/back.svg";

import styles from "./SettingPage.module.css";

function DurationRow({ label, field }) {
    const ctrl = useDurationField(field);

    return (
        <div className={styles.item}>
            <div className={styles.text}>{label}</div>
            <div className={styles.current}>
                <button
                    type="button"
                    className={styles.plus}
                    onClick={ctrl.plus}
                >
                    +
                </button>
                <input
                    className={styles.min}
                    type="text"
                    value={ctrl.local}
                    onChange={ctrl.onChange}
                    onBlur={ctrl.commit}
                    onKeyDown={ctrl.onKeyDown}
                    inputMode="numeric"
                    pattern="\d*"
                    aria-label={`${label} (мин)`}
                />
                <button
                    type="button"
                    className={styles.minus}
                    onClick={ctrl.minus}
                >
                    -
                </button>
            </div>
        </div>
    );
}

const SettingPage = () => {
    const rows = [
        { label: "Время работы:", field: "work" },
        { label: "Маленький перерыв:", field: "short" },
        { label: "Большой перерыв:", field: "long" },
    ];

    // const soundEnabled = useTimerStore((s) => s.soundEnabled);
    // const notificationEnabled = useTimerStore((s) => s.notificationEnabled);
    // const setSoundEnabled = useTimerStore((s) => s.setSoundEnabled);
    // const setNotificationEnabled = useTimerStore(
    //     (s) => s.setNotificationEnabled
    // );

    const {
        soundEnabled,
        notificationEnabled,
        setSoundEnabled,
        setNotificationEnabled,
    } = useTimer();

    return (
        <div className={styles.setting}>
            <Link to={`/home`}>
                <Back className={styles.icon} />
            </Link>
            {rows.map((item) => (
                <DurationRow
                    key={item.field}
                    label={item.label}
                    field={item.field}
                />
            ))}
            <div className={styles.item}>
                <div className={styles.text}> Звук</div>
                <div className={styles.toggle}>
                    <button
                        className={soundEnabled ? styles.on : styles.off}
                        onClick={() => setSoundEnabled(true)}
                    >
                        вкл
                    </button>

                    <button
                        className={!soundEnabled ? styles.on : styles.off}
                        onClick={() => setSoundEnabled(false)}
                    >
                        выкл
                    </button>
                </div>
            </div>
            <div className={styles.item}>
                <div className={styles.text}> Уведомление</div>
                <div className={styles.toggle}>
                    <button
                        className={notificationEnabled ? styles.on : styles.off}
                        onClick={() => setNotificationEnabled(true)}
                    >
                        вкл
                    </button>
                    <button
                        className={
                            !notificationEnabled ? styles.on : styles.off
                        }
                        onClick={() => setNotificationEnabled(false)}
                    >
                        выкл
                    </button>
                </div>
            </div>
        </div>
    );
};

export default SettingPage;
