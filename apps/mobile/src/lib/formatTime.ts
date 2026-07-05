/** Formats an ISO timestamp as a short French time label, e.g. "19:30". */
export function formatEventTime(isoString: string): string {
  const date = new Date(isoString);
  return new Intl.DateTimeFormat("fr-FR", { hour: "2-digit", minute: "2-digit" }).format(date);
}

/** Formats an ISO timestamp as a short French day label, e.g. "ce soir", "demain" or "ven. 12". */
export function formatEventDay(isoString: string): string {
  const date = new Date(isoString);
  const now = new Date();
  const sameDay = date.toDateString() === now.toDateString();
  if (sameDay) return "ce soir";

  const tomorrow = new Date(now);
  tomorrow.setDate(now.getDate() + 1);
  if (date.toDateString() === tomorrow.toDateString()) return "demain";

  return new Intl.DateTimeFormat("fr-FR", { weekday: "short", day: "numeric" }).format(date);
}

const DAY_LABELS = ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"];

/** Renders days_of_week (1=Monday..7=Sunday) as "Lun–Ven" style compact ranges, falling back to a comma list. */
export function formatDaysOfWeek(daysOfWeek: number[]): string {
  const sorted = [...daysOfWeek].sort((a, b) => a - b);
  if (sorted.length === 0) return "";
  if (sorted.length === 7) return "Tous les jours";
  return sorted.map((d) => DAY_LABELS[d - 1] ?? "").join(", ");
}
