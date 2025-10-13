import { useTimerCoreStore } from "./timer-core";
import { useTimerDataStore } from "./timer-data";

export const useTimer = () => {
    const core = useTimerCoreStore();
    const data = useTimerDataStore();

    const tick = () => {
        if (!core.isRunning) return;

        core.tick();

        const target = core.durations[data.mode] * 60;
        if (core.seconds >= target) {
            // Таймер завершился
            if (data.mode === "work") {
                data.flushToStats(core.seconds);
            }

            data.nextMode();
            core.reset();
            core.playEnd();
        }
    };

    return {
        ...core,

        ...data,

        tick,
    };
};

export { useTimerCoreStore, useTimerDataStore };
