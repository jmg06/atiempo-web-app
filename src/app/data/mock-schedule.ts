import { BlockMedication, ScheduleBlock } from '../domain/schedule-block';
import { TreatmentMedication } from '../domain/medication';
import { timeOfDay } from '../domain/time-of-day';

export const MOCK_TREATMENT: readonly TreatmentMedication[] = [
  { id: 'laxante', name: 'Laxante', usualPresentation: 'sachet' },
  { id: 'anticonvulsivante', name: 'Anticonvulsivante', usualPresentation: 'tablet', prescribedDosesPerDay: 3 },
  { id: 'antidepresivo', name: 'Antidepresivo', usualPresentation: 'tablet' },
  { id: 'suplemento', name: 'Suplemento', usualPresentation: 'drop' },
];

const ANTICONVULSANT: BlockMedication = { medicationId: 'anticonvulsivante', quantity: 1, presentation: 'tablet' };
const ANTIDEPRESSANT: BlockMedication = { medicationId: 'antidepresivo', quantity: 0.5, presentation: 'tablet' };
const SUPPLEMENT: BlockMedication = { medicationId: 'suplemento', quantity: 5, presentation: 'drop' };

export const MOCK_PUBLISHED_BLOCKS: readonly ScheduleBlock[] = [
  { id: '1', time: timeOfDay(7, 15), medications: [ANTICONVULSANT, SUPPLEMENT] },
  { id: '2', time: timeOfDay(11, 0), medications: [ANTIDEPRESSANT] },
  { id: '3', time: timeOfDay(15, 15), medications: [ANTICONVULSANT, SUPPLEMENT] },
  { id: '4', time: timeOfDay(19, 0), medications: [ANTIDEPRESSANT, SUPPLEMENT] },
  { id: '5', time: timeOfDay(23, 30), medications: [ANTICONVULSANT] },
];

export const MOCK_LAST_PUBLISHED_ON = '2 de agosto';
