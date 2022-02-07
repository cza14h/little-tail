import type { HandleElement } from "."

export type NodeEdgeMap = Map<string, IObject<string>>


type SelectedItem<T> = {
  id: string,
  type: T
}

type SelectedNode = SelectedItem<'node'>
type SelectedEdge = SelectedItem<'edge'>

export type SelectedItemCollection = IObject<SelectedNode> | IObject<SelectedEdge>


export type HandleMap = {
  [handleId: string]: HandleElement
}

export type HandlesInfo = {
  source: HandleMap
  target: HandleMap
}

export type NodeInternalInfo = { //
  folded: boolean
  handles: HandlesInfo
}
export type NodeInternals = Map<string, NodeInternalInfo>
export interface NodeInternalMutation {
  registerNode(id: string, node: NodeInternalInfo): void
  delistNode(id: string): void
}