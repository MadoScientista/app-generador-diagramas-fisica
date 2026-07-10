import type { MRUInput, MRUResult } from './types.ts';

export function solveMRU(input: MRUInput): MRUResult {
  const xf = input.x0 + input.v * input.t;
  const dx = xf - input.x0;

  return {
    x0: input.x0,
    v: input.v,
    t: input.t,
    xf,
    dx,
  };
}
