import { ModuleRegistry, layout, render } from '../core/index.ts';
import type {
  PipelineResult,
  PipelineError,
  PipelineSuccess,
  SceneGraph,
} from '../core/types.ts';

export class PhysicsDiagramEngine {
  private registry: ModuleRegistry;

  constructor(registry: ModuleRegistry) {
    this.registry = registry;
  }

  generate(moduleId: string, rawInput: Record<string, string>): PipelineResult {
    const allFilled = Object.values(rawInput).every((v) => v.trim() !== '');

    if (!allFilled) {
      return this.renderBase();
    }

    const module = this.registry.get(moduleId);
    if (!module) {
      return this.error('validation', `Módulo "${moduleId}" no encontrado.`);
    }

    const validation = module.validate(rawInput);
    if (!validation.valid) {
      return {
        type: 'validation',
        message: validation.errors.map((e) => `${e.field}: ${e.message}`).join('; '),
      };
    }

    const numericInput: Record<string, number> = {};
    for (const [key, value] of Object.entries(rawInput)) {
      numericInput[key] = Number(value);
    }

    let physicsResult;
    try {
      physicsResult = module.solve(numericInput);
    } catch (e) {
      return this.error('physics', `Error al resolver la física: ${(e as Error).message}`);
    }

    let diagramModel;
    try {
      diagramModel = module.infer(physicsResult);
    } catch (e) {
      return this.error('inference', `Error al inferir el diagrama: ${(e as Error).message}`);
    }

    let sceneGraph;
    try {
      sceneGraph = module.buildScene(diagramModel);
    } catch (e) {
      return this.error('scene', `Error al construir la escena: ${(e as Error).message}`);
    }

    let layoutScene;
    try {
      layoutScene = layout(sceneGraph);
    } catch (e) {
      return this.error('layout', `Error de layout: ${(e as Error).message}`);
    }

    let svg: string;
    try {
      svg = render(layoutScene);
    } catch (e) {
      return this.error('render', `Error al renderizar: ${(e as Error).message}`);
    }

    return {
      type: 'success',
      svg,
      layoutScene,
    };
  }

  private renderBase(): PipelineSuccess {
    const baseScene: SceneGraph = {
      id: 'scene',
      type: 'scene',
      visible: true,
      children: [
        {
          id: 'axis-x',
          type: 'axis',
          visible: true,
          axisType: 'x',
          orientation: 'right',
          showTicks: true,
          showArrow: false,
        },
        {
          id: 'origin',
          type: 'origin',
          visible: true,
          label: 'x = 0',
        },
        {
          id: 'base-position',
          type: 'position',
          visible: true,
          semanticRole: 'initial',
          physicalValue: 0,
          showMarker: false,
          showLabel: false,
        },
        {
          id: 'character',
          type: 'character',
          visible: true,
          orientation: 'none',
        },
      ],
    };

    const layoutScene = layout(baseScene);
    const svg = render(layoutScene);
    return { type: 'success', svg, layoutScene };
  }

  private error(type: PipelineError['type'], message: string): PipelineError {
    return { type, message };
  }
}
