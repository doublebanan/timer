import { useState, useRef } from "react";
import { Link } from "react-router-dom";

import { Timeline } from "../../../shared/ui/TimeLine/TimeLine";
import { formatTime } from "../../../shared/lib/formatTime";
import { useTimerEngine } from "../../../features/timer/model/useTimerEngine";
import { LessonsPanel } from "../../../shared/ui/LessonsPanel/LessonsPanel";
import { useTimerStore } from "../../../store/useTimerStore";
import { useTimerDataStore } from "../../../store/timer";
import { useTimer } from "../../../store/timer";

import { ReactComponent as Play } from "../../../shared/assets/icons/play.svg";
import { ReactComponent as Pause } from "../../../shared/assets/icons/pause.svg";
import { ReactComponent as BarChart } from "../../../shared/assets/icons/barchart.svg";

import styles from "./HomePages.module.css";

const HomePage = () => {
    useTimerEngine();

    const {
        // Из core (UI + Settings + Audio)
        isRunning,
        seconds,
        start,
        pause,
        reset,

        durations,

        // Из data (Lessons + Stats)
        lessons,
        currentLessonId,
        setCurrentLesson,
        mode,
    } = useTimer();

    // const isActive = useTimerStore((s) => s.isRunning);
    // const time = useTimerStore((s) => s.seconds);

    // const start = useTimerStore((s) => s.start);
    // const reset = useTimerStore((s) => s.reset);
    // const pause = useTimerStore((s) => s.pause);

    // const mode = useTimerStore((s) => s.mode);
    // const durations = useTimerStore((s) => s.durations);

    // const lessons = useTimerStore((s) => s.lessons);
    // const currentLessonId = useTimerStore((s) => s.currentLessonId);
    // const setCurrentLesson = useTimerDataStore((s) => s.setCurrentLesson);

    const nextMode = useTimerDataStore((s) => s.nextMode);

    const totalSeconds = (durations[mode] ?? 0) * 60;
    const remaining = Math.max(0, totalSeconds - seconds);

    const [isPanelOpen, setIsPanelOpen] = useState(false);

    const handleClose = () => setIsPanelOpen(false);

    const onBreak = () => {
        pause();
        nextMode();
        requestAnimationFrame(() => {
            start();
        });
    };

    const isProcessingRef = useRef(false);

    const handlePlayPause = () => {
        if (isProcessingRef.current) return;
        isProcessingRef.current = true;

        isRunning ? pause() : start();

        setTimeout(() => {
            isProcessingRef.current = false;
        }, 500);
    };

    const currentLesson = lessons.find((l) => l.id === currentLessonId);

    const elapsed = seconds;

    return (
        <div className={styles.home}>
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
                                value={currentLessonId}
                                onChange={(id) => {
                                    if (id === currentLessonId)
                                        return handleClose();
                                    setCurrentLesson(id);
                                    reset();
                                    setIsPanelOpen(false);
                                }}
                                onClose={handleClose}
                            />
                        </div>
                    ) : (
                        <div className={styles.leason}>
                            {currentLesson ? currentLesson.name : "—"}
                        </div>
                    )}
                </div>
                <button className={styles.btnHome} onClick={onBreak}>
                    break {mode}
                </button>
                <Link className={styles.link} to={`/setting`}>
                    setting
                </Link>
            </div>
            <div className={styles.timer}>{formatTime(remaining)}</div>
            <Timeline duration={totalSeconds} elapsed={elapsed} />
            <div className={styles.homeDown}>
                <button className={styles.diagram}>
                    <Link className={styles.link} to={`/statistics`}>
                        <BarChart className={styles.icon} />
                    </Link>
                </button>
                <div className={styles.circle}>
                    <button
                        className={styles.play}
                        onClick={handlePlayPause}
                        aria-label={isRunning ? "Пауза" : "Старт"}
                        title={isRunning ? "Пауза" : "Старт"}
                    >
                        {isRunning ? (
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
