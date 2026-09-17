import { TimeOfDay, toMinutes } from './time-of-day';

export const DAY_START_MINUTES = 6 * 60;
export const DAY_END_MINUTES = 24 * 60;

export const CLINICAL_MARGIN_MINUTES = 30;

const DAY_LENGTH_MINUTES = DAY_END_MINUTES - DAY_START_MINUTES;

export function dayPositionPercent(time: TimeOfDay): number {
  const offset = toMinutes(time) - DAY_START_MINUTES;

  return Math.min(100, Math.max(0, (offset / DAY_LENGTH_MINUTES) * 100));
}

export function dayDurationPercent(minutes: number): number {
  return (minutes / DAY_LENGTH_MINUTES) * 100;
}
