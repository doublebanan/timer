import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

//создаем дату

const dayKey = () => new Date().toISOString().slice(0, 10);

export const useTimerStore = create()(
    persist(
        (set, get) => ({
            // state
            seconds: 0,
            isRunning: false,
            mode: "work", // 'work' | 'short' | 'long'
            lesson: "html",
            durations: { work: 25, short: 5, long: 15 }, // минуты
            byDay: {}, // { "2025-09-18": { html: 1200 } }

            // actions
            setLesson: (lesson) => set({ lesson }),
            setDurations: (patch) =>
                set((s) => ({ durations: { ...s.durations, ...patch } })),

            start: () => set({ isRunning: true }),
            pause: () => set({ isRunning: false }),
            reset: () => set({ isRunning: false, seconds: 0 }),

            tick: () => {
                const { isRunning } = get();
                if (!isRunning) return;
                set((s) => ({ seconds: s.seconds + 1 }));
            },

            flushToStats: () => {
                const { seconds, lesson } = get();
                if (!seconds) return;
                const key = dayKey();
                set((s) => {
                    const day = s.byDay[key] || {};
                    const prev = day[lesson] || 0;
                    return {
                        byDay: {
                            ...s.byDay,
                            [key]: { ...day, [lesson]: prev + seconds },
                        },
                        seconds: 0,
                    };
                });
            },

            switchMode: (mode) => set({ mode, seconds: 0, isRunning: false }),
        }),
        {
            name: "timer-store",
            storage: createJSONStorage(() => localStorage),
            partialize: (s) => ({
                durations: s.durations,
                lesson: s.lesson,
                byDay: s.byDay,
            }),
        }
    )
);
