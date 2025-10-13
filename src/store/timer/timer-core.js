import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

let backgroundAudio = null;

export const useTimerCoreStore = create()(
    persist(
        (set, get) => ({
            isRunning: false,
            seconds: 0,

            soundEnabled: true,
            notificationEnabled: true,
            durations: { work: 25, short: 5, long: 15 },

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

            tick: () => set((state) => ({ seconds: state.seconds + 1 })),

            // Аудио логика
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

            // Настройки
            setSoundEnabled: (val) => set({ soundEnabled: val }),
            setNotificationEnabled: (val) => set({ notificationEnabled: val }),
            setDurations: (patch) =>
                set((s) => ({
                    durations: { ...s.durations, ...patch },
                })),
        }),
        {
            name: "timer-core-store",
            storage: createJSONStorage(() => localStorage),
            partialize: (state) => ({
                soundEnabled: state.soundEnabled,
                notificationEnabled: state.notificationEnabled,
                durations: state.durations,
            }),
        }
    )
);
