import { toSI, fromSI } from '../../core/units.ts';
import type { MRUSolveInput, MRUResolvedVars, ComputedField } from './types.ts';

export function resolveMRU(input: MRUSolveInput): MRUResolvedVars {
  const hasV = input.v !== undefined;
  const hasT = input.t !== undefined;
  const hasXf = input.xf !== undefined;
  const filledCount = [true, hasV, hasT, hasXf].filter(Boolean).length;

  if (filledCount < 3) {
    throw new Error('Se requieren al menos 3 valores para resolver.');
  }

  const x0SI = toSI(input.x0, input.x0Unit, 'distance');

  let computedField: ComputedField;
  let vSI: number;
  let tSI: number;
  let xfSI: number;

  if (!hasXf) {
    vSI = toSI(input.v!, input.velUnit, 'velocity');
    tSI = toSI(input.t!, input.timeUnit, 'time');
    xfSI = x0SI + vSI * tSI;
    computedField = 'xf';
  } else if (!hasV) {
    xfSI = toSI(input.xf!, input.xfUnit, 'distance');
    tSI = toSI(input.t!, input.timeUnit, 'time');
    vSI = (xfSI - x0SI) / tSI;
    computedField = 'v';
  } else if (!hasT) {
    xfSI = toSI(input.xf!, input.xfUnit, 'distance');
    vSI = toSI(input.v!, input.velUnit, 'velocity');
    if (Math.abs(vSI) < 1e-12) {
      if (Math.abs(xfSI - x0SI) < 1e-12) {
        tSI = 0;
      } else {
        throw new Error('Con velocidad 0, xf debe ser igual a xi.');
      }
    } else {
      tSI = (xfSI - x0SI) / vSI;
    }
    computedField = 't';
  } else {
    xfSI = toSI(input.xf!, input.xfUnit, 'distance');
    vSI = toSI(input.v!, input.velUnit, 'velocity');
    tSI = toSI(input.t!, input.timeUnit, 'time');
    const expectedXf = x0SI + vSI * tSI;
    if (Math.abs(xfSI - expectedXf) > 0.001) {
      const displayExpected = fromSI(expectedXf, input.xfUnit, 'distance');
      throw new Error(
        `Los valores no cumplen la ecuación MRU: xf = ${displayExpected.toFixed(3)} ${input.xfUnit} (esperado), pero se ingresó ${input.xf} ${input.xfUnit}.`
      );
    }
    computedField = null;
  }

  const dxSI = xfSI - x0SI;

  return {
    x0: fromSI(x0SI, input.x0Unit, 'distance'),
    v: fromSI(vSI, input.velUnit, 'velocity'),
    t: fromSI(tSI, input.timeUnit, 'time'),
    xf: fromSI(xfSI, input.xfUnit, 'distance'),
    dx: fromSI(dxSI, input.x0Unit, 'distance'),
    computedField,
  };
}
