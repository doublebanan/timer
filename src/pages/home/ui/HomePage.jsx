import { useState } from "react";
import { Link } from "react-router-dom";

import { formatTime } from "../../../shared/lib/formatTime";
import { useTimerEngine } from "../../../features/timer/model/useTimerEngine";
import { LessonsPanel } from "../../../shared/ui/LessonsPanel/LessonsPanel";
import { useTimerStore } from "../../../store/useTimerStore";

import { ReactComponent as Play } from "../../../shared/assets/icons/play.svg";
import { ReactComponent as Pause } from "../../../shared/assets/icons/pause.svg";
import { ReactComponent as BarChart } from "../../../shared/assets/icons/barchart.svg";

import styles from "./HomePages.module.css";

const HomePage = () => {
    useTimerEngine();

    // const workMinutes = useTimerStore((s) => {
    //     s.durations.work;
    // });

    const time = useTimerStore((s) => s.seconds);
    const mode = useTimerStore((s) => s.mode);
    const durations = useTimerStore((s) => s.durations);

    const isActive = useTimerStore((s) => s.isRunning);
    const lessons = useTimerStore((s) => s.lesson);

    const start = useTimerStore((s) => s.start);
    const pause = useTimerStore((s) => s.pause);
    const reset = useTimerStore((s) => s.reset);
    const setLessons = useTimerStore((s) => s.setLesson);
    const flush = useTimerStore((s) => s.flushToStats);

    const totalSeconds = (durations[mode] ?? 0) * 60;
    const remaining = Math.max(0, totalSeconds - time);

    const [isPanelOpen, setIsPanelOpen] = useState(false);

    const handleClose = () => setIsPanelOpen(false);

    return (
        <div className={styles.home}>
            ё
            <div className={styles.homeUp}>
                <div className={styles.leftGroup}>
                    <button
                        className={styles.btnHome}
                        onClick={() => setIsPanelOpen(true)}
                    >
                        reason
                    </button>
                    {isPanelOpen ? (
                        <div className={styles.overlay} onClick={handleClose}>
                            <LessonsPanel
                                value={lessons}
                                onChange={(s) => {
                                    setLessons(s);
                                    setIsPanelOpen(false);
                                }}
                                onClose={handleClose}
                            />
                        </div>
                    ) : (
                        <div className={styles.leason}>{lessons}</div>
                    )}
                </div>
                <button className={styles.btnHome} onClick={reset}>
                    break
                </button>
                <Link className={styles.link} to={`/setting`}>
                    setting
                </Link>
            </div>
            <div className={styles.timer}>{formatTime(remaining)}</div>
            <div className={styles.homeDown}>
                <button className={styles.diagram}>
                    <BarChart className={styles.icon} />
                </button>
                <div className={styles.circle}>
                    <button
                        className={styles.play}
                        onClick={() => (isActive ? pause() : start())}
                        aria-label={isActive ? "Пауза" : "Старт"}
                        title={isActive ? "Пауза" : "Старт"}
                    >
                        {isActive ? (
                            <Pause className={styles.icon} />
                        ) : (
                            <Play className={styles.icon} />
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default HomePage;
