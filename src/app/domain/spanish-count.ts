const COUNT_WORDS = [
  'cero',
  'un',
  'dos',
  'tres',
  'cuatro',
  'cinco',
  'seis',
  'siete',
  'ocho',
  'nueve',
  'diez',
  'once',
  'doce',
];

export function countWord(count: number): string {
  return COUNT_WORDS[count] ?? String(count);
}

export function capitalize(text: string): string {
  return text.charAt(0).toUpperCase() + text.slice(1);
}

export function joinAsSpanishList(items: readonly string[]): string {
  if (items.length <= 1) {
    return items.join('');
  }

  return `${items.slice(0, -1).join(', ')} y ${items[items.length - 1]}`;
}
