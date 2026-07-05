/** Formats an amount in Qatari Riyals for display, e.g. "120 QAR". */
export function formatQAR(amount: number): string {
  return `${Math.round(amount).toLocaleString("fr-FR")} QAR`;
}

/** Formats minutes remaining as a short countdown label, e.g. "42 min" or "1 h 05". */
export function formatMinutesRemaining(minutes: number): string {
  if (minutes <= 0) return "Termine";
  if (minutes < 60) return `${minutes} min`;
  const hours = Math.floor(minutes / 60);
  const rest = minutes % 60;
  return `${hours} h ${String(rest).padStart(2, "0")}`;
}

/**
 * Computes minutes remaining until end_time today, given days_of_week
 * (1 = Monday ... 7 = Sunday) and HH:mm:ss start/end times.
 * Returns null when the happy hour is not currently live.
 */
export function computeMinutesRemaining(
  daysOfWeek: number[],
  startTime: string,
  endTime: string,
  now: Date = new Date()
): number | null {
  const isoDay = now.getDay() === 0 ? 7 : now.getDay();
  if (!daysOfWeek.includes(isoDay)) return null;

  const [startH = 0, startM = 0] = startTime.split(":").map(Number);
  const [endH = 0, endM = 0] = endTime.split(":").map(Number);

  const start = new Date(now);
  start.setHours(startH, startM, 0, 0);
  const end = new Date(now);
  end.setHours(endH, endM, 0, 0);

  if (now < start || now > end) return null;

  return Math.max(0, Math.round((end.getTime() - now.getTime()) / 60000));
}
