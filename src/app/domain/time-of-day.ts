export interface TimeOfDay {
  readonly hours: number;
  readonly minutes: number;
}

export function timeOfDay(hours: number, minutes = 0): TimeOfDay {
  return { hours, minutes };
}

export function toMinutes(time: TimeOfDay): number {
  return time.hours * 60 + time.minutes;
}

// Intl.DateTimeFormat separates "a. m." with narrow no-break spaces.
export function formatTimeOfDay(time: TimeOfDay): string {
  const hours12 = time.hours % 12 || 12;
  const minutes = String(time.minutes).padStart(2, '0');
  const period = time.hours < 12 ? 'a. m.' : 'p. m.';

  return `${hours12}:${minutes} ${period}`;
}
