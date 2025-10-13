import { useEffect, useRef } from "react";
import { useTimerStore } from "../../../store/useTimerStore";

export function useTimerEngine() {
    const intervalRef = useRef(null);

    useEffect(() => {
        const startInterval = () => {
            if (intervalRef.current) {
                return;
            }

            intervalRef.current = setInterval(() => {
                try {
                    const state = useTimerStore.getState();

                    if (!state.isRunning) {
                        return;
                    }

                    state.tick();
                } catch (err) {}
            }, 1000);
        };

        const stopInterval = () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
                intervalRef.current = null;
            }
        };

        // Подписка на изменения isRunning
        const unsub = useTimerStore.subscribe(
            (s) => s.isRunning,
            (isRunning) => {
                if (isRunning) {
                    startInterval();
                } else {
                    stopInterval();
                }
            }
        );

        // Проверяем начальное состояние
        const initialState = useTimerStore.getState().isRunning;

        if (initialState) {
            startInterval();
        }

        return () => {
            stopInterval();
            unsub();
        };
    }, []);
}
