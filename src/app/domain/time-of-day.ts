export interface TimeOfDay {
  readonly hours: number;
  readonly minutes: number;
}

const TWELVE_HOUR_PATTERN = /^(\d{1,2})(?::(\d{2}))?\s*([ap])\.?\s*m\.?$/i;
const TWENTY_FOUR_HOUR_PATTERN = /^(\d{1,2}):(\d{2})$/;

export function timeOfDay(hours: number, minutes = 0): TimeOfDay {
  return { hours, minutes };
}

export function toMinutes(time: TimeOfDay): number {
  return time.hours * 60 + time.minutes;
}

export function compareTimeOfDay(first: TimeOfDay, second: TimeOfDay): number {
  return toMinutes(first) - toMinutes(second);
}

export function isSameTimeOfDay(first: TimeOfDay, second: TimeOfDay): boolean {
  return compareTimeOfDay(first, second) === 0;
}

// Intl.DateTimeFormat separates "a. m." with narrow no-break spaces.
export function formatTimeOfDay(time: TimeOfDay): string {
  const hours12 = time.hours % 12 || 12;
  const minutes = String(time.minutes).padStart(2, '0');
  const period = time.hours < 12 ? 'a. m.' : 'p. m.';

  return `${hours12}:${minutes} ${period}`;
}

export function parseTimeOfDay(text: string): TimeOfDay | null {
  const normalized = text.trim();
  const twelveHour = TWELVE_HOUR_PATTERN.exec(normalized);

  if (twelveHour) {
    const hours = Number(twelveHour[1]);
    const minutes = Number(twelveHour[2] ?? 0);

    if (hours < 1 || hours > 12 || minutes > 59) {
      return null;
    }

    const afternoon = twelveHour[3].toLowerCase() === 'p';

    return timeOfDay((hours % 12) + (afternoon ? 12 : 0), minutes);
  }

  const twentyFourHour = TWENTY_FOUR_HOUR_PATTERN.exec(normalized);

  if (twentyFourHour) {
    const hours = Number(twentyFourHour[1]);
    const minutes = Number(twentyFourHour[2]);

    return hours <= 23 && minutes <= 59 ? timeOfDay(hours, minutes) : null;
  }

  return null;
}
