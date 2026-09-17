import { ValidationError, applyEach, schema, validate } from '@angular/forms/signals';

import { DAY_START_MINUTES } from '../../domain/day-window';
import { Presentation, formatQuantity, parseQuantity } from '../../domain/medication';
import { BlockMedication, ScheduleBlock } from '../../domain/schedule-block';
import { formatTimeOfDay, parseTimeOfDay, toMinutes } from '../../domain/time-of-day';

export interface MedicationFormValue {
  readonly medicationId: string;
  readonly quantity: string;
  readonly presentation: Presentation;
}

export interface BlockFormValue {
  readonly time: string;
  readonly medications: readonly MedicationFormValue[];
}

export const EMPTY_BLOCK_FORM: BlockFormValue = { time: '', medications: [] };

export const blockFormSchema = schema<BlockFormValue>((block) => {
  validate(block.time, ({ value }) => validateTime(value()));
  validate(block.medications, ({ value }) =>
    value().length === 0 ? { kind: 'required', message: 'Agrega al menos un medicamento a este bloque.' } : undefined
  );
  applyEach(block.medications, (medication) => {
    validate(medication.quantity, ({ value }) => validateQuantity(value()));
  });
});

export function toBlockFormValue(block: ScheduleBlock | null): BlockFormValue {
  if (!block) {
    return EMPTY_BLOCK_FORM;
  }

  return {
    time: formatTimeOfDay(block.time),
    medications: block.medications.map(({ medicationId, quantity, presentation }) => ({
      medicationId,
      quantity: formatQuantity(quantity),
      presentation,
    })),
  };
}

export function toScheduleBlock(value: BlockFormValue): Omit<ScheduleBlock, 'id'> | null {
  const time = parseTimeOfDay(value.time);
  const medications: BlockMedication[] = [];

  for (const { medicationId, quantity, presentation } of value.medications) {
    const parsedQuantity = parseQuantity(quantity);

    if (parsedQuantity === null) {
      return null;
    }

    medications.push({ medicationId, quantity: parsedQuantity, presentation });
  }

  return time ? { time, medications } : null;
}

function validateTime(text: string): ValidationError | undefined {
  if (!text.trim()) {
    return { kind: 'required', message: 'Escribe la hora del bloque.' };
  }

  const time = parseTimeOfDay(text);

  if (!time) {
    return { kind: 'format', message: 'Escribe la hora así: 3:15 p. m.' };
  }

  if (toMinutes(time) < DAY_START_MINUTES) {
    return { kind: 'range', message: 'La hora tiene que estar entre las 6 a. m. y las 11:59 p. m.' };
  }

  return undefined;
}

function validateQuantity(text: string): ValidationError | undefined {
  if (!text.trim()) {
    return { kind: 'required', message: 'Escribe la cantidad.' };
  }

  const quantity = parseQuantity(text);

  return quantity === null || quantity <= 0
    ? { kind: 'format', message: 'Escribe un número mayor que cero.' }
    : undefined;
}
