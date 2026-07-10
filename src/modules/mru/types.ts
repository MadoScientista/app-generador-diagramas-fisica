export interface MRUInput {
  x0: number;
  v: number;
  t: number;
}

export interface MRUResult {
  x0: number;
  v: number;
  t: number;
  xf: number;
  dx: number;
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
}
