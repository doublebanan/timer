import { useState, useMemo, useRef } from "react";
import { Link } from "react-router-dom";

import { useTimerStore } from "../../../store/useTimerStore";

import { ReactComponent as Back } from "../../../shared/assets/icons/back.svg";
import { ReactComponent as Plus } from "../../../shared/assets/icons/plus.svg";

import { getLastNDates } from "../lib/getLastNDates";
import { LessonList } from "./LessonList";
import { BarsArea } from "./BarsArea";
import { AddLessonModal } from "./AddLessonsModal";
import { DeleteLessonModal } from "./DeleteLessonsModal";
import { UpdateLessonModal } from "./UpdateLessonModal";

import styles from "./StatsWidget.module.css";

export default function StatsWidget({ days = 7 }) {
    const inputRef = useRef(null);
    const updateRef = useRef(null);

    const [isOpenPlus, setIsOpenPlus] = useState(false);
    const [deleteLessonId, setDeleteLessonId] = useState(null);
    const [updateLessonId, setUpdateLessonsId] = useState(null);

    const lessons = useTimerStore((s) => s.lessons);
    const removeLesson = useTimerStore((s) => s.removeLesson);
    const addLesson = useTimerStore((s) => s.addLesson);
    const updateLesson = useTimerStore((s) => s.updateLesson);

    const currentLessonId = useTimerStore((s) => s.currentLessonId);
    const setCurrentLesson = useTimerStore((s) => s.setCurrentLesson);
    const byDay = useTimerStore((s) => s.byDay);

    const dates = useMemo(() => getLastNDates(days), [days]);

    const combined = useMemo(() => {
        if (!Array.isArray(dates)) return [];
        const res = dates.map((dateKey) => {
            const day = byDay?.[dateKey] ?? {};
            const secs = Number(day?.[currentLessonId] ?? 0);
            const mins = Math.floor(secs / 60);

            return [dateKey, mins];
        });
        return res;
    }, [byDay, dates, currentLessonId]);

    const perDayMinutes = combined.map(([_, mins]) => mins);
    const totalMinutes = perDayMinutes.reduce((a, b) => a + b, 0);
    const maxMinutes = Math.max(...perDayMinutes, 1);
    const currentLesson = lessons.find((l) => l.id === currentLessonId) ?? null;

    return (
        <div className={styles.widget}>
            <aside className={styles.left}>
                <div className={styles.leftInner}>
                    <Link to={`/home`}>
                        <Back className={styles.icon} />
                    </Link>
                    <div className={styles.leftLessons}>
                        <h4 className={styles.leftTitle}>Lessons</h4>
                        <button onClick={() => setIsOpenPlus(true)}>
                            <Plus className={styles.btnLessons} />
                        </button>
                    </div>

                    <LessonList
                        lessons={lessons}
                        currentLessonId={currentLessonId}
                        onSelect={setCurrentLesson}
                        onEdit={setUpdateLessonsId}
                        onDelete={setDeleteLessonId}
                    />
                    <div className={styles.lessonPill}>
                        {currentLesson ? currentLesson.name : "—"}
                    </div>
                </div>
            </aside>

            <BarsArea combined={combined} maxMinutes={maxMinutes} />
            <div className={styles.totalBox}>
                <div className={styles.totalCircle}>
                    <div className={styles.totalValue}>{totalMinutes}</div>
                    <div className={styles.totalText}>min</div>
                </div>
            </div>

            {isOpenPlus && (
                <AddLessonModal
                    inputRef={inputRef}
                    onClose={() => setIsOpenPlus(false)}
                    onSubmit={() => {
                        const value = inputRef.current?.value?.trim();
                        if (!value) return;
                        addLesson(value);
                        setIsOpenPlus(false);
                        inputRef.current.value = "";
                    }}
                />
            )}

            {deleteLessonId && (
                <DeleteLessonModal
                    name={lessons.find((l) => l.id === deleteLessonId)?.name}
                    onConfirm={() => {
                        removeLesson(deleteLessonId);
                        setDeleteLessonId(null);
                    }}
                    onCancel={() => setDeleteLessonId(null)}
                />
            )}

            {updateLessonId && (
                <UpdateLessonModal
                    name={lessons.find((l) => l.id === updateLessonId)?.name}
                    inputRef={updateRef}
                    onUpdate={() => {
                        const value = updateRef.current?.value?.trim();
                        if (!value) return;
                        updateLesson(updateLessonId, { name: value });
                        setUpdateLessonsId(null);
                    }}
                    onClose={() => setUpdateLessonsId(null)}
                />
            )}
        </div>
    );
}
