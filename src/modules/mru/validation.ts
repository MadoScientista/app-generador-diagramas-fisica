import type { ValidationResult, ValidationError } from '../../core/types.ts';

export function validateMRU(input: Record<string, string>): ValidationResult {
  const errors: ValidationError[] = [];

  const x0Str = input['x0']?.trim();
  const vStr = input['v']?.trim();
  const tStr = input['t']?.trim();

  if (!x0Str || x0Str === '') {
    errors.push({ field: 'x0', message: 'x₀ es obligatorio.' });
  } else if (isNaN(Number(x0Str))) {
    errors.push({ field: 'x0', message: 'x₀ debe ser un número.' });
  }

  if (!vStr || vStr === '') {
    errors.push({ field: 'v', message: 'v es obligatorio.' });
  } else if (isNaN(Number(vStr))) {
    errors.push({ field: 'v', message: 'v debe ser un número.' });
  }

  if (!tStr || tStr === '') {
    errors.push({ field: 't', message: 't es obligatorio.' });
  } else if (isNaN(Number(tStr))) {
    errors.push({ field: 't', message: 't debe ser un número.' });
  } else if (Number(tStr) < 0) {
    errors.push({ field: 't', message: 't debe ser mayor o igual a 0.' });
  }

  return errors.length > 0 ? { valid: false, errors } : { valid: true };
}
