import { ValidationError } from '@angular/forms/signals';

import { MIN_PASSWORD_LENGTH, isEmail } from '../../domain/account';

const BIRTH_DATE_PATTERN = /^(\d{1,2})\s*\/\s*(\d{1,2})\s*\/\s*(\d{4})$/;

export function validateEmail(text: string): ValidationError | undefined {
  if (!text.trim()) {
    return { kind: 'required', message: 'Escribe el correo.' };
  }

  return isEmail(text) ? undefined : { kind: 'format', message: 'Escribe el correo así: nombre@correo.com' };
}

export function validatePassword(text: string): ValidationError | undefined {
  if (!text) {
    return { kind: 'required', message: 'Escribe la clave.' };
  }

  return text.length >= MIN_PASSWORD_LENGTH
    ? undefined
    : { kind: 'length', message: `La clave necesita al menos ${MIN_PASSWORD_LENGTH} caracteres.` };
}

export function validateRequired(text: string, message: string): ValidationError | undefined {
  return text.trim() ? undefined : { kind: 'required', message };
}

export function validateBirthDate(text: string): ValidationError | undefined {
  if (!text.trim()) {
    return { kind: 'required', message: 'Escribe la fecha de nacimiento.' };
  }

  const parts = BIRTH_DATE_PATTERN.exec(text.trim());

  if (!parts) {
    return { kind: 'format', message: 'Escribe la fecha así: 14 / 03 / 2011' };
  }

  const [, day, month, year] = parts.map(Number);
  const date = new Date(year, month - 1, day);

  return date.getDate() === day && date.getMonth() === month - 1
    ? undefined
    : { kind: 'range', message: 'Esa fecha no existe.' };
}
