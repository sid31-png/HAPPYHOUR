import { useEffect, useState } from "react";
import { computeMinutesRemaining } from "@happyhour/ui";

const REFRESH_MS = 30_000;

/**
 * Recomputes the live countdown for a happy hour every ~30s so badges
 * stay accurate without a full data refetch. Returns null once the
 * happy hour is no longer live.
 */
export function useLiveMinutesRemaining(daysOfWeek: number[], startTime: string, endTime: string): number | null {
  const [minutes, setMinutes] = useState<number | null>(() =>
    computeMinutesRemaining(daysOfWeek, startTime, endTime)
  );

  useEffect(() => {
    const id = setInterval(() => {
      setMinutes(computeMinutesRemaining(daysOfWeek, startTime, endTime));
    }, REFRESH_MS);
    return () => clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [daysOfWeek.join(","), startTime, endTime]);

  return minutes;
}
