import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

let backgroundAudio = null;

export const useTimerCoreStore = create()(
    persist(
        (set, get) => ({
            seconds: 0,
            isRunning: false,
            mode: "work",

            soundEnabled: true,
            notificationEnabled: true,
            durations: { work: 25, short: 5, long: 15 },

            setSoundEnabled: (val) => set({ soundEnabled: val }),
            setNotificationEnabled: (val) => set({ notificationEnabled: val }),

            playBackground: () => {
                const { soundEnabled } = get();
                if (!soundEnabled) return;
                if (backgroundAudio) return;

                const audio = new Audio("/sounds/ambient.mp3");
                audio.loop = true;
                audio.volume = 0.04;
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

            start: () => {
                set({ isRunning: true });
                get().playBackground();
            },

            pause: () => {
                set({ isRunning: false });
                get().stopBackground();
            },

            reset: () => {
                set({ isRunning: false, seconds: 0 });
                get().stopBackground();
            },

            tick: () => {
                const { isRunning, durations, mode, seconds } = get();
                if (!isRunning) return;

                const target = (durations[mode] ?? 0) * 60;
                const newSeconds = seconds + 1;
                set({ seconds: newSeconds });

                if (target > 0 && newSeconds >= target) {
                    get().stopBackground();
                }
            },

            setDurations: (patch) =>
                set((s) => ({ durations: { ...s.durations, ...patch } })),
        }),
        {
            name: "timer-core-store",
            storage: createJSONStorage(() => localStorage),
            partialize: (s) => ({
                soundEnabled: s.soundEnabled,
                notificationEnabled: s.notificationEnabled,
                durations: s.durations,
            }),
        }
    )
);
