export type Presentation = 'tablet' | 'ml' | 'drop' | 'sachet';

export interface PresentationOption {
  readonly value: Presentation;
  readonly label: string;
}

export interface TreatmentMedication {
  readonly id: string;
  readonly name: string;
  readonly usualPresentation: Presentation;
  readonly prescribedDosesPerDay?: number;
}

export const PRESENTATION_OPTIONS: readonly PresentationOption[] = [
  { value: 'tablet', label: 'Tableta' },
  { value: 'ml', label: 'ml' },
  { value: 'drop', label: 'Gota' },
  { value: 'sachet', label: 'Sobre' },
];

const QUANTITY_PATTERN = /^\d+([.,]\d+)?$/;

export function isLiquid(presentation: Presentation): boolean {
  return presentation === 'ml' || presentation === 'drop';
}

export function parseQuantity(text: string): number | null {
  const normalized = text.trim();

  return QUANTITY_PATTERN.test(normalized) ? Number(normalized.replace(',', '.')) : null;
}

export function formatQuantity(quantity: number): string {
  return String(quantity).replace('.', ',');
}

export function describeDose(quantity: number, presentation: Presentation): string {
  const amount = formatQuantity(quantity);

  switch (presentation) {
    case 'tablet':
      return describeTablets(quantity);
    case 'drop':
      return quantity === 1 ? '1 gota' : `${amount} gotas`;
    case 'ml':
      return `${amount} ml`;
    case 'sachet':
      if (quantity === 0.5) {
        return 'Medio sobre';
      }

      return quantity === 1 ? '1 sobre' : `${amount} sobres`;
  }
}

function describeTablets(quantity: number): string {
  const whole = Math.floor(quantity);
  const hasHalf = quantity - whole === 0.5;

  if (quantity === 0.5) {
    return 'Media tableta';
  }

  if (quantity === 1) {
    return '1 tableta entera';
  }

  if (hasHalf) {
    return `${whole} ${whole === 1 ? 'tableta' : 'tabletas'} y media`;
  }

  return `${formatQuantity(quantity)} tabletas`;
}
