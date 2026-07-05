import { useEffect, useState } from "react";

/** Seconds remaining until an ISO timestamp, updated every second. Clamped to 0. */
export function useCountdownSeconds(expiresAt: string): number {
  const [secondsLeft, setSecondsLeft] = useState(() => computeSecondsLeft(expiresAt));

  useEffect(() => {
    setSecondsLeft(computeSecondsLeft(expiresAt));
    const id = setInterval(() => {
      setSecondsLeft(computeSecondsLeft(expiresAt));
    }, 1000);
    return () => clearInterval(id);
  }, [expiresAt]);

  return secondsLeft;
}

function computeSecondsLeft(expiresAt: string): number {
  return Math.max(0, Math.round((new Date(expiresAt).getTime() - Date.now()) / 1000));
}

/** Formats seconds as "mm:ss". */
export function formatCountdownClock(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${String(s).padStart(2, "0")}`;
}
