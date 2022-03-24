import type { DeletePayload, EdgeTree, NodeAtom, IObject } from '@app/types';
import type { RecoilState } from 'recoil';

export function getAtom<T>(id: string, atomPool?: IObject<RecoilState<T>>) {
  const atom = atomPool?.[id];
  if (!atom) {
    console.error('fail to fetch atom from the pool', id);
    return false;
  }
  return atom;
}

export function findDeletedItem(edgeTree: EdgeTree, payload: DeletePayload) {
  const edges: string[] = [],
    nodes: string[] = [];
  payload.forEach((val) => {
    const { type, id } = val;
    if (type === 'node') {
      nodes.push(id);
      const keys = edgeTree.get(id)?.keys() ?? [];
      edges.push(...keys);
    } else if (type === 'edge') {
      edges.push(id);
    }
  });

  return { nodes, edges };
}

export function createNodeDeltaMove(deltaX: number, deltaY: number) {
  return function (prev: NodeAtom): NodeAtom {
    return {
      ...prev,
      node: {
        ...prev.node,
        left: prev.node.left + deltaX,
        top: prev.node.top + deltaY,
      },
    };
  };
}
