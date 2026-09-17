import { CLINICAL_MARGIN_MINUTES } from './day-window';
import { TimeOfDay, toMinutes } from './time-of-day';

export interface DoseBlock {
  readonly time: TimeOfDay;
  readonly medicationCount: number;
}

export function findMarginConflicts(blocks: readonly DoseBlock[]): ReadonlySet<number> {
  const conflicts = new Set<number>();

  blocks.forEach((block, index) => {
    blocks.forEach((other, otherIndex) => {
      const distance = Math.abs(toMinutes(block.time) - toMinutes(other.time));

      if (index !== otherIndex && distance < CLINICAL_MARGIN_MINUTES) {
        conflicts.add(index);
      }
    });
  });

  return conflicts;
}
