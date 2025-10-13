import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

const dayKey = () => new Date().toISOString().slice(0, 10);

export const useTimerDataStore = create()(
    persist(
        (set, get) => ({
            lessons: [
                { id: 1, name: "html" },
                { id: 2, name: "js" },
                { id: 3, name: "english" },
            ],
            currentLessonId: 1,
            byDay: {},
            workCount: 0,
            mode: "work",

            addLesson: (name) =>
                set((s) => {
                    const maxId = Math.max(...s.lessons.map((l) => l.id), 0);
                    return { lessons: [...s.lessons, { id: maxId + 1, name }] };
                }),

            removeLesson: (id) =>
                set((s) => {
                    const next = s.lessons.filter((l) => l.id !== id);
                    const nextCurrent =
                        s.currentLessonId === id
                            ? next[0]?.id || null
                            : s.currentLessonId;
                    return { lessons: next, currentLessonId: nextCurrent };
                }),

            setCurrentLesson: (id) => set({ currentLessonId: id }),

            updateLesson: (id, patch) =>
                set((s) => ({
                    lessons: s.lessons.map((l) =>
                        l.id === id ? { ...l, ...patch } : l
                    ),
                })),

            flushToStats: (seconds) => {
                if (!seconds || seconds <= 0) return;

                const key = dayKey();
                const lessonId = get().currentLessonId || "unknown";
                const currentMode = get().mode;

                if (currentMode !== "work") return;

                set((s) => {
                    const day = s.byDay[key] || {};
                    const prev = day[lessonId] || 0;
                    return {
                        byDay: {
                            ...s.byDay,
                            [key]: { ...day, [lessonId]: prev + seconds },
                        },
                    };
                });
            },

            switchMode: (mode) => set({ mode }),

            nextMode: () => {
                const { mode, workCount } = get();

                if (mode === "work") {
                    const newCount = workCount + 1;
                    const isLong = newCount % 4 === 0;

                    set({
                        workCount: newCount,
                        mode: isLong ? "long" : "short",
                    });
                } else {
                    set({ mode: "work" });
                }
            },
        }),
        {
            name: "timer-data-store",
            storage: createJSONStorage(() => localStorage),
        }
    )
);
