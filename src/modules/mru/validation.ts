import type { ValidationResult, ValidationError } from '../../core/types.ts';

export function validateMRU(input: Record<string, string>): ValidationResult {
  const errors: ValidationError[] = [];
  const numericFields = ['x0', 'v', 't', 'xf'];

  const labels: Record<string, string> = {
    x0: 'xi',
    v: 'v',
    t: 't',
    xf: 'xf',
  };

  for (const field of numericFields) {
    const value = input[field]?.trim();
    if (value === undefined || value === '') continue;
    if (isNaN(Number(value))) {
      errors.push({ field, message: `${labels[field]} debe ser un número.` });
    }
  }

  return errors.length > 0 ? { valid: false, errors } : { valid: true };
}
