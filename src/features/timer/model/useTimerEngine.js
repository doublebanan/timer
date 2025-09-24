import { useEffect, useRef } from "react";
import { useTimerStore } from "../../../store/useTimerStore";

export const useTimerEngine = () => {
    const tick = useTimerStore((s) => s.tick);
    const isRunning = useTimerStore((s) => s.isRunning);
    const flushToStats = useTimerStore((s) => s.flushToStats);
    const ref = useRef(null);

    useEffect(() => {
        if (!isRunning) return;
        if (ref.current) clearInterval(ref.current);
        ref.current = setInterval(() => tick(), 1000);
        return () => {
            clearInterval(ref.current);
            ref.current = null;
        };
    }, [isRunning, tick]);

    useEffect(() => {
        return () => {
            flushToStats();
        };
    }, [flushToStats]);
};
