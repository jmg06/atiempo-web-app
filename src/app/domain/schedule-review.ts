import { findMarginConflicts } from './dose-block';
import { TreatmentMedication } from './medication';
import { ScheduleBlock, toDoseBlock } from './schedule-block';
import { toMinutes } from './time-of-day';

export interface PrescriptionCheck {
  readonly medication: TreatmentMedication;
  readonly hoursApart: number;
  readonly passed: boolean;
}

export interface MarginConflict {
  readonly block: ScheduleBlock;
  readonly nearest: ScheduleBlock;
  readonly conflictingBlockCount: number;
}

export interface ScheduleReview {
  readonly blockCount: number;
  readonly allBlocksComplete: boolean;
  readonly prescriptionChecks: readonly PrescriptionCheck[];
  readonly conflict: MarginConflict | null;
  readonly canPublish: boolean;
}

export function reviewSchedule(
  blocks: readonly ScheduleBlock[],
  treatment: readonly TreatmentMedication[],
  focusBlockId: string | null
): ScheduleReview {
  const allBlocksComplete = blocks.every(({ medications }) => medications.length > 0);
  const prescriptionChecks = checkPrescriptions(blocks, treatment);
  const conflict = findConflict(blocks, focusBlockId);

  return {
    blockCount: blocks.length,
    allBlocksComplete,
    prescriptionChecks,
    conflict,
    canPublish: allBlocksComplete && prescriptionChecks.every(({ passed }) => passed) && !conflict,
  };
}

function checkPrescriptions(
  blocks: readonly ScheduleBlock[],
  treatment: readonly TreatmentMedication[]
): PrescriptionCheck[] {
  return treatment.flatMap((medication) => {
    const dosesPerDay = medication.prescribedDosesPerDay;

    if (!dosesPerDay) {
      return [];
    }

    const scheduledDoses = blocks.filter((block) =>
      block.medications.some(({ medicationId }) => medicationId === medication.id)
    ).length;

    return [{ medication, hoursApart: 24 / dosesPerDay, passed: scheduledDoses === dosesPerDay }];
  });
}

function findConflict(blocks: readonly ScheduleBlock[], focusBlockId: string | null): MarginConflict | null {
  const conflictingIndexes = findMarginConflicts(blocks.map(toDoseBlock));

  if (conflictingIndexes.size === 0) {
    return null;
  }

  const conflicting = [...conflictingIndexes].map((index) => blocks[index]);
  const block = conflicting.find(({ id }) => id === focusBlockId) ?? conflicting[conflicting.length - 1];
  const [nearest] = conflicting
    .filter((candidate) => candidate !== block)
    .sort((first, second) => distanceInMinutes(first, block) - distanceInMinutes(second, block));

  return { block, nearest, conflictingBlockCount: conflictingIndexes.size };
}

function distanceInMinutes(first: ScheduleBlock, second: ScheduleBlock): number {
  return Math.abs(toMinutes(first.time) - toMinutes(second.time));
}
