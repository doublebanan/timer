import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

const dayKey = () => new Date().toISOString().slice(0, 10);

let backgroundAudio = null;

export const useTimerStore = create()(
    persist(
        (set, get) => ({
            // state
            seconds: 0,
            isRunning: false,
            mode: "work",
            lessons: [
                { id: 1, name: "html" },
                { id: 2, name: "js" },
                { id: 3, name: "english" },
            ],
            currentLessonId: 1,
            durations: { work: 25, short: 5, long: 15 },
            byDay: {},
            workCount: 0,
            soundEnabled: true,
            notificationEnabled: true,

            setSoundEnabled: (val) => set({ soundEnabled: val }),
            setNotificationEnabled: (val) => set({ notificationEnabled: val }),

            playBackground: () => {
                const { soundEnabled } = get();
                if (!soundEnabled) return;

                if (backgroundAudio) return; // уже играет

                const audio = new Audio("/sounds/ambient.mp3");
                audio.loop = true;
                audio.volume = 0.04; // еле слышно
                audio.play().catch(() => {});
                backgroundAudio = audio;
            },

            stopBackground: () => {
                if (backgroundAudio) {
                    backgroundAudio.pause();
                    backgroundAudio = null;
                }
            },

            playEnd: () => {
                const { notificationEnabled } = get();
                if (!notificationEnabled) return;
                const audio = new Audio("/sounds/end.mp3");
                audio.volume = 0.3;
                audio.play().catch(() => {});
            },

            // actions

            getLessons: () => get().lessons,

            addLesson: (name) =>
                set((s) => {
                    const maxId = s.lessons.length
                        ? Math.max(...s.lessons.map((l) => l.id))
                        : 0;
                    const id = maxId + 1; // новый id
                    return { lessons: [...s.lessons, { id, name }] };
                }),

            removeLesson: (id) =>
                set((s) => {
                    const next = s.lessons.filter((l) => l.id !== id);
                    const nextCurrent =
                        s.currentLessonId === id
                            ? next[0]
                                ? next[0].id
                                : null
                            : s.currentLessonId;
                    return { lessons: next, currentLessonId: nextCurrent };
                }),

            setCurrentLesson: (id) =>
                set(() => ({
                    currentLessonId: id,
                })),

            updateLesson: (id, patch) =>
                set((s) => ({
                    lessons: s.lessons.map((l) =>
                        l.id === id ? { ...l, ...patch } : l
                    ),
                })),

            setDurations: (patch) =>
                set((s) => ({ durations: { ...s.durations, ...patch } })),

            start: () => {
                set({ isRunning: true });
                get().playBackground();
            },

            pause: () => {
                set({ isRunning: false });
                get().playBackground();
            },

            reset: () => {
                set({ isRunning: false, seconds: 0 });
                get().playBackground();
            },

            tick: () => {
                const { isRunning, durations, mode, seconds } = get();
                if (!isRunning) return;

                const target = (durations[mode] ?? 0) * 60;
                const newSeconds = seconds + 1;

                set({ seconds: newSeconds });

                if (mode === "work") get().playTick();

                if (target > 0 && newSeconds >= target) {
                    get().flushToStats(newSeconds);
                    get().playEnd();

                    get().nextMode();
                }
            },

            flushToStats: (secondsParam) => {
                const seconds =
                    typeof secondsParam === "number"
                        ? Math.floor(secondsParam)
                        : get().seconds;

                if (!seconds || seconds <= 0) return;

                const key = dayKey();
                const lessonId = get().currentLessonId || "unknown";

                const currentMode = get().mode;
                if (currentMode !== "work") {
                    return;
                }

                set((s) => {
                    const day = s.byDay[key] || {};
                    const prev = day[lessonId] || 0;
                    return {
                        byDay: {
                            ...s.byDay,
                            [key]: { ...day, [lessonId]: prev + seconds },
                        },
                        seconds: 0,
                    };
                });
            },

            switchMode: (mode) => set({ mode, seconds: 0, isRunning: false }),

            nextMode: () => {
                const { mode, workCount, seconds } = get();

                if (mode === "work") {
                    if (seconds && seconds > 0) {
                        get().flushToStats(seconds);
                    }

                    const newCount = (workCount || 0) + 1;
                    const isLong = newCount % 4 === 0;

                    set({
                        workCount: newCount,
                        mode: isLong ? "long" : "short",
                        seconds: 0,
                        isRunning: false,
                    });
                } else {
                    set({
                        mode: "work",
                        seconds: 0,
                        isRunning: false,
                    });
                }
            },
        }),
        {
            name: "timer-store",
            storage: createJSONStorage(() => localStorage),
            partialize: (s) => ({
                durations: s.durations,
                lessons: s.lessons,
                byDay: s.byDay,
                mode: s.mode,
                workCount: s.workCount,
            }),
        }
    )
);
