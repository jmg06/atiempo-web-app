import { DoseBlock } from './dose-block';
import { Presentation, TreatmentMedication, describeDose } from './medication';
import { joinAsSpanishList } from './spanish-count';
import { TimeOfDay, compareTimeOfDay } from './time-of-day';

export interface BlockMedication {
  readonly medicationId: string;
  readonly quantity: number;
  readonly presentation: Presentation;
}

export interface ScheduleBlock {
  readonly id: string;
  readonly time: TimeOfDay;
  readonly medications: readonly BlockMedication[];
}

export const DOSE_SEPARATOR = '  ·  ';

export function sortBlocks(blocks: readonly ScheduleBlock[]): ScheduleBlock[] {
  return [...blocks].sort((first, second) => compareTimeOfDay(first.time, second.time));
}

export function describeMedicationNames(block: ScheduleBlock, treatment: readonly TreatmentMedication[]): string {
  const names = block.medications.map((medication, index) => {
    const name = treatment.find(({ id }) => id === medication.medicationId)?.name ?? '';

    return index === 0 ? name : name.toLowerCase();
  });

  return joinAsSpanishList(names);
}

export function describeDoses(block: ScheduleBlock): string {
  return block.medications
    .map(({ quantity, presentation }) => describeDose(quantity, presentation))
    .join(DOSE_SEPARATOR);
}

export function toDoseBlock(block: ScheduleBlock): DoseBlock {
  return { time: block.time, medicationCount: block.medications.length };
}

export function nextMedicationToAdd(
  treatment: readonly TreatmentMedication[],
  medicationIdsInBlock: readonly string[]
): TreatmentMedication | undefined {
  return treatment.find(({ id }) => !medicationIdsInBlock.includes(id));
}
