import type { PhysicsModule, ValidationResult, PhysicsResult, DiagramModel, SceneGraph } from '../../core/types.ts';
import { validateMRU } from './validation.ts';
import { solveMRU } from './physics.ts';
import { inferMRU } from './inference.ts';
import { buildMRUScene } from './scene-builder.ts';
import type { MRUInput, MRUResult, MRUDiagramModel } from './types.ts';

export const MRUModule: PhysicsModule = {
  info: {
    id: 'mru',
    name: 'Movimiento Rectilíneo Uniforme (MRU)',
    description: 'Genera diagramas de MRU a partir de posición inicial, velocidad y tiempo.',
  },
  validate(input: Record<string, string>): ValidationResult {
    return validateMRU(input);
  },
  solve(input: Record<string, number>): PhysicsResult {
    return solveMRU(input as unknown as MRUInput) as unknown as PhysicsResult;
  },
  infer(result: PhysicsResult): DiagramModel {
    return inferMRU(result as unknown as MRUResult) as unknown as DiagramModel;
  },
  buildScene(model: DiagramModel): SceneGraph {
    return buildMRUScene(model as unknown as MRUDiagramModel);
  },
};
