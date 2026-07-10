import type { SceneGraph } from '../../core/types.ts';
import type { MRUDiagramModel } from './types.ts';

export function buildMRUScene(model: MRUDiagramModel): SceneGraph {
  return {
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
        id: 'initial-position',
        type: 'position',
        visible: true,
        semanticRole: 'initial',
        physicalValue: model.x0,
        showMarker: true,
        showLabel: true,
      },
      {
        id: 'final-position',
        type: 'position',
        visible: true,
        semanticRole: 'final',
        physicalValue: model.xf,
        showMarker: true,
        showLabel: true,
      },
      {
        id: 'character',
        type: 'character',
        visible: true,
        orientation: model.characterOrientation,
      },
      {
        id: 'velocity-vector',
        type: 'vector',
        visible: model.showVelocityVector,
        vectorType: 'velocity',
        orientation: model.direction,
        magnitude: model.v,
      },
      {
        id: 'label-xi',
        type: 'label',
        visible: true,
        text: `xi = ${model.x0} m`,
        semanticRole: 'label-xi',
      },
      {
        id: 'label-xf',
        type: 'label',
        visible: true,
        text: `xf = ${model.xf} m`,
        semanticRole: 'label-xf',
      },
      {
        id: 'label-v',
        type: 'label',
        visible: model.showVelocityVector,
        text: `v = ${model.v} m/s`,
        semanticRole: 'label-v',
      },
      {
        id: 'label-t',
        type: 'label',
        visible: true,
        text: `t = ${model.t} s`,
        semanticRole: 'label-t',
      },
      {
        id: 'label-dx',
        type: 'label',
        visible: model.hasDisplacement,
        text: `Δx = ${model.dx} m`,
        semanticRole: 'label-dx',
      },
      {
        id: 'displacement-arrow',
        type: 'displacement-arrow',
        visible: model.hasDisplacement,
        orientation: model.direction,
        physicalXi: model.x0,
        physicalXf: model.xf,
      },
    ],
  };
}
