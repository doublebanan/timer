import { useEffect, useRef } from "react";
import { useTimerCoreStore } from "../../../store/timer/timer-core";
import { useTimer } from "../../../store/timer";

export function useTimerEngine() {
    const intervalRef = useRef(null);
    const timer = useTimer();

    useEffect(() => {
        const startInterval = () => {
            if (intervalRef.current) return;

            intervalRef.current = setInterval(() => {
                timer.tick();
            }, 1000);
        };

        const stopInterval = () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
                intervalRef.current = null;
            }
        };

        const unsub = useTimerCoreStore.subscribe(
            (s) => s.isRunning,
            (isRunning) => {
                if (isRunning) startInterval();
                else stopInterval();
            }
        );

        const initial = useTimerCoreStore.getState().isRunning;
        if (initial) startInterval();

        return () => {
            stopInterval();
            unsub();
        };
    }, [timer]);
}
