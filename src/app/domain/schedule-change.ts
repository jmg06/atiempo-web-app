import { ScheduleBlock } from './schedule-block';
import { TimeOfDay, isSameTimeOfDay } from './time-of-day';

export type ScheduleChange =
  | { readonly kind: 'none' }
  | { readonly kind: 'moved'; readonly from: TimeOfDay; readonly to: TimeOfDay }
  | { readonly kind: 'added'; readonly at: TimeOfDay };

export function describeScheduleChange(original: ScheduleBlock | null, edited: ScheduleBlock): ScheduleChange {
  if (!original) {
    return { kind: 'added', at: edited.time };
  }

  return isSameTimeOfDay(original.time, edited.time)
    ? { kind: 'none' }
    : { kind: 'moved', from: original.time, to: edited.time };
}
