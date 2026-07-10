import type { MRUResult, MRUDiagramModel } from './types.ts';

export function inferMRU(result: MRUResult): MRUDiagramModel {
  let direction: 'left' | 'right' | 'none';
  let characterOrientation: 'left' | 'right' | 'none';
  let showVelocityVector: boolean;

  if (result.v > 0) {
    direction = 'right';
    characterOrientation = 'right';
    showVelocityVector = true;
  } else if (result.v < 0) {
    direction = 'left';
    characterOrientation = 'left';
    showVelocityVector = true;
  } else {
    direction = 'none';
    characterOrientation = 'none';
    showVelocityVector = false;
  }

  const crossesOrigin =
    (result.x0 < 0 && result.xf > 0) || (result.x0 > 0 && result.xf < 0);

  const hasDisplacement = result.dx !== 0;

  return {
    direction,
    crossesOrigin,
    hasDisplacement,
    showVelocityVector,
    characterOrientation,
    x0: result.x0,
    xf: result.xf,
    v: result.v,
    t: result.t,
    dx: result.dx,
  };
}
