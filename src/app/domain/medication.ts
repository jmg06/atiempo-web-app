export type Presentation = 'tablet' | 'ml' | 'drop' | 'sachet';

export interface PresentationOption {
  readonly value: Presentation;
  readonly label: string;
}

export const PRESENTATION_OPTIONS: readonly PresentationOption[] = [
  { value: 'tablet', label: 'Tableta' },
  { value: 'ml', label: 'ml' },
  { value: 'drop', label: 'Gota' },
  { value: 'sachet', label: 'Sobre' },
];

export function isLiquid(presentation: Presentation): boolean {
  return presentation === 'ml' || presentation === 'drop';
}
