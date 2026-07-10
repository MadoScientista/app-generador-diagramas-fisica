import type {
  SceneGraphNode,
  SceneGraph,
  LayoutScene,
  PositionedNode,
  Point,
  Layer,
} from './types.ts';

const VIEWPORT_WIDTH = 800;
const VIEWPORT_HEIGHT = 400;
const MARGIN = 60;
const USABLE_WIDTH = VIEWPORT_WIDTH - 2 * MARGIN;
const AXIS_Y = VIEWPORT_HEIGHT / 2 + 40;
const CHARACTER_SIZE = 50;
const TICK_SIZE = 8;
const VECTOR_LENGTH = 80;
const LABEL_OFFSET_Y = 22;
const DISPLACEMENT_Y_OFFSET = 55;

function getLayer(node: SceneGraphNode): Layer {
  switch (node.type) {
    case 'axis':
      return 'axis';
    case 'origin':
    case 'position':
      return 'positions';
    case 'character':
      return 'character';
    case 'vector':
      return 'vectors';
    case 'displacement-arrow':
      return 'displacement';
    case 'label':
      return 'labels';
    default:
      return 'background';
  }
}

interface PhysRange {
  min: number;
  max: number;
}

function getPhysicalValues(nodes: SceneGraphNode[]): PhysRange {
  const values: number[] = [0];

  for (const node of nodes) {
    if (node.type === 'position' && node.visible) {
      values.push(node.physicalValue);
    }
  }

  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = max - min;

  if (range === 0) {
    return { min: min - 5, max: max + 5 };
  }

  const padding = range * 0.15;
  return { min: min - padding, max: max + padding };
}

function toScreenX(physicalX: number, physMin: number, physMax: number): number {
  const t = (physMax - physMin) === 0 ? 0.5 : (physicalX - physMin) / (physMax - physMin);
  return MARGIN + t * USABLE_WIDTH;
}

function flatten(root: SceneGraphNode): SceneGraphNode[] {
  const result: SceneGraphNode[] = [];

  function walk(node: SceneGraphNode): void {
    if (node.type === 'scene' || node.type === 'group') {
      if ('children' in node) {
        for (const child of (node as { children: SceneGraphNode[] }).children) {
          walk(child);
        }
      }
    } else {
      result.push(node);
    }
  }

  walk(root);
  return result;
}

function getInitialScreenX(nodes: SceneGraphNode[], physMin: number, physMax: number): number {
  for (const n of nodes) {
    if (n.type === 'position' && (n as { semanticRole: string }).semanticRole === 'initial' && n.visible) {
      return toScreenX((n as { physicalValue: number }).physicalValue, physMin, physMax);
    }
  }
  return toScreenX(0, physMin, physMax);
}

function getFinalScreenX(nodes: SceneGraphNode[], physMin: number, physMax: number): number {
  for (const n of nodes) {
    if (n.type === 'position' && (n as { semanticRole: string }).semanticRole === 'final' && n.visible) {
      return toScreenX((n as { physicalValue: number }).physicalValue, physMin, physMax);
    }
  }
  return toScreenX(0, physMin, physMax);
}

export function layout(sceneGraph: SceneGraph): LayoutScene {
  const nodes = flatten(sceneGraph);
  const { min: physMin, max: physMax } = getPhysicalValues(nodes);
  const positioned: PositionedNode[] = [];

  for (const node of nodes) {
    if (!node.visible) {
      positioned.push({
        id: node.id,
        node,
        position: { x: 0, y: 0 },
        boundingBox: { x: 0, y: 0, width: 0, height: 0 },
        layer: getLayer(node),
        rotation: 0,
        visible: false,
      });
      continue;
    }

    let pos: Point;
    let w = 0;
    let h = 0;

    switch (node.type) {
      case 'axis':
        pos = { x: MARGIN, y: AXIS_Y };
        w = USABLE_WIDTH;
        break;

      case 'origin': {
        const sx = toScreenX(0, physMin, physMax);
        pos = { x: sx, y: AXIS_Y };
        h = TICK_SIZE;
        break;
      }

      case 'position': {
        const sx = toScreenX(node.physicalValue, physMin, physMax);
        pos = { x: sx, y: AXIS_Y };
        h = TICK_SIZE;
        break;
      }

      case 'character': {
        const cx = getInitialScreenX(nodes, physMin, physMax);
        pos = { x: cx - CHARACTER_SIZE / 2, y: AXIS_Y - CHARACTER_SIZE };
        w = CHARACTER_SIZE;
        h = CHARACTER_SIZE;
        break;
      }

      case 'vector': {
        const ix = getInitialScreenX(nodes, physMin, physMax);
        const arrowLen = node.orientation === 'left' ? -VECTOR_LENGTH : VECTOR_LENGTH;
        const startX = node.orientation === 'right'
          ? ix + CHARACTER_SIZE / 2
          : ix - CHARACTER_SIZE / 2;
        pos = { x: startX, y: AXIS_Y - CHARACTER_SIZE / 2 };
        w = arrowLen;
        break;
      }

      case 'displacement-arrow': {
        const sx = toScreenX(node.physicalXi, physMin, physMax);
        const ex = toScreenX(node.physicalXf, physMin, physMax);
        const arrowY = AXIS_Y + DISPLACEMENT_Y_OFFSET;
        pos = { x: Math.min(sx, ex), y: arrowY };
        w = Math.abs(ex - sx);
        break;
      }

      case 'label': {
        const ix = getInitialScreenX(nodes, physMin, physMax);
        const fx = getFinalScreenX(nodes, physMin, physMax);
        let labelX = ix;
        let labelY = AXIS_Y + TICK_SIZE + LABEL_OFFSET_Y;

        if (node.semanticRole === 'label-xi') {
          const originSx = toScreenX(0, physMin, physMax);
          const xiSx = getInitialScreenX(nodes, physMin, physMax);
          const screenDist = Math.abs(xiSx - originSx);
          if (screenDist < 50) {
            labelY = AXIS_Y - CHARACTER_SIZE / 2 - 36;
          } else {
            labelY = AXIS_Y + TICK_SIZE + LABEL_OFFSET_Y;
          }
        } else if (node.semanticRole === 'label-xf') {
          labelX = fx;
          labelY = AXIS_Y + TICK_SIZE + LABEL_OFFSET_Y;
        } else if (node.semanticRole === 'label-v') {
          const dir = ix <= fx ? 1 : -1;
          labelX = ix + dir * (CHARACTER_SIZE / 2 + VECTOR_LENGTH / 2);
          labelY = AXIS_Y - CHARACTER_SIZE / 2 - 14;
        } else if (node.semanticRole === 'label-t') {
          labelX = (ix + fx) / 2;
          labelY = AXIS_Y - CHARACTER_SIZE / 2 - 36;
        } else if (node.semanticRole === 'label-dx') {
          labelX = (ix + fx) / 2;
          labelY = AXIS_Y + DISPLACEMENT_Y_OFFSET + LABEL_OFFSET_Y;
        }

        pos = { x: labelX, y: labelY };
        break;
      }

      default:
        pos = { x: 0, y: 0 };
    }

    positioned.push({
      id: node.id,
      node,
      position: pos,
      boundingBox: { x: pos.x, y: pos.y, width: w, height: h },
      layer: getLayer(node),
      rotation: 0,
      visible: node.visible,
    });
  }

  return {
    nodes: positioned,
    viewportWidth: VIEWPORT_WIDTH,
    viewportHeight: VIEWPORT_HEIGHT,
  };
}
