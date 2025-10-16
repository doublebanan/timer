import { useState, useEffect, useCallback } from "react";

import { useTimerCoreStore } from "../../../store/timer/timer-core";

const clamp = (n, min = 1, max = 180) => Math.max(min, Math.min(max, n));

export function useDurationField(field, { min = 1, max = 180 } = {}) {
    const { durations, setDurations } = useTimerCoreStore();

    const [local, setLocal] = useState(String(durations[field]));

    useEffect(() => setLocal(String(durations[field])), [durations[field]]);

    const bump = useCallback(
        (delta) => {
            const cur = useTimerCoreStore.getState().durations[field] ?? 0;
            setDurations({ [field]: clamp(cur + delta, min, max) });
        },
        [field, setDurations, min, max]
    );

    const commit = useCallback(() => {
        const n = parseInt(local || "0", 10);
        if (Number.isNaN(n)) {
            setLocal(String(durations[field]));
            return;
        }
        setDurations({ [field]: clamp(n, min, max) });
    }, [local, field, durations[field], setDurations, min, max]);

    const onChange = (e) => setLocal(e.target.value.replace(/\D/g, ""));
    const onKeyDown = (e) => {
        if (e.key === "Enter") e.currentTarget.blur();
        if (e.key === "ArrowUp") {
            e.preventDefault();
            bump(+1);
        }
        if (e.key === "ArrowDown") {
            e.preventDefault();
            bump(-1);
        }
    };

    return {
        local,
        setLocal,
        onChange,
        onKeyDown,
        commit,
        plus: () => bump(+1),
        minus: () => bump(-1),
    };
}
