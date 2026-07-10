import type { DistanceUnit, TimeUnit, VelocityUnit } from '../../core/units.ts';

export type ShowValuesFlags = {
  xi: boolean;
  xf: boolean;
  v: boolean;
  t: boolean;
  dx: boolean;
};

export type ComputedField = 'xf' | 'v' | 't' | null;

export interface MRUSolveInput {
  x0: number;
  v?: number;
  t?: number;
  xf?: number;
  x0Unit: DistanceUnit;
  xfUnit: DistanceUnit;
  timeUnit: TimeUnit;
  velUnit: VelocityUnit;
}

export interface MRUResolvedVars {
  x0: number;
  v: number;
  t: number;
  xf: number;
  dx: number;
  computedField: ComputedField;
}

export interface MRUResult {
  x0: number;
  v: number;
  t: number;
  xf: number;
  dx: number;
  x0Unit: DistanceUnit;
  xfUnit: DistanceUnit;
  timeUnit: TimeUnit;
  velUnit: VelocityUnit;
  computedField: ComputedField;
  showValues?: ShowValuesFlags;
}

export interface MRUDiagramModel {
  direction: 'left' | 'right' | 'none';
  crossesOrigin: boolean;
  hasDisplacement: boolean;
  showVelocityVector: boolean;
  characterOrientation: 'left' | 'right' | 'none';
  x0: number;
  xf: number;
  v: number;
  t: number;
  dx: number;
  x0Unit: DistanceUnit;
  xfUnit: DistanceUnit;
  timeUnit: TimeUnit;
  velUnit: VelocityUnit;
  showValues: ShowValuesFlags;
}

