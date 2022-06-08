import React, { ComponentType, ReactNode } from 'react';
import { EdgeUpdater, NodeUpdater } from '@lib/containers/TailRenderer/subInstances/itemUpdater';
import type { RecoilValue, RecoilState } from 'recoil';
import { JotaiImmerAtom } from './jotai';
import type {
  NodeMouseInterface,
  EdgeBasic,
  EdgeMouseInterface,
  HandleElement,
  Node,
  Edge,
  EdgeTemplatesType,
  NodeTemplatesType,
  MarkerTemplatesType,
  ViewerInterface,
  HandleType,
  TemplatePickerType,
  MarkerDefsProps,
  EdgeBasicProps,
  SelectModeType,
  IObject,
  EdgeTree,
} from '.';

export type CoreMethods = {
  switchMode(m: SelectModeType): void;
  setScale(scale: number): void;
  focusNode(id: string): void;
  getActiveItems(): SelectedItemCollection;
  getEdgeTree(): EdgeTree;
  moveViewCenter(x: number, y: number): void;
  setActiveItems(items: SelectedItemCollection): void;
};

export type TailCoreOptionalProps = {
  nodeTemplates?: NodeTemplatesType;
  edgeTemplates?: EdgeTemplatesType;
  markerTemplates?: MarkerTemplatesType;
  nodeTemplatePicker?: TemplatePickerType;
  connectingEdge?: ComponentType<EdgeBasicProps>;
  dropThreshold?: number;
  quickNodeUpdate?: boolean;
  onDelete?(nodes: string[], edges: string[]): void; //come with id array
  onActivate?(items: SelectedItemCollection): void;
  // getMethods?: (methods: CoreMethods) => void;
  // instanceRef?: { current: any };
} & NodeMutation &
  EdgeMutation &
  NodeMouseInterface &
  EdgeMouseInterface &
  ViewerInterface &
  MarkerDefsProps;

export type TailCoreProps = {
  nodes: IObject<Node>;
  edges: IObject<Edge>;
  children?: ReactNode;
} & NodeMouseInterface &
  EdgeMouseInterface &
  TailCoreOptionalProps;

export interface NodeMutation {
  // onNodeCreate(): void;
  onNodeUpdate?(id: Node[]): void;
  // onNodeDelete(): void;
}

export interface EdgeMutation {
  onEdgeCreate?(edgeBasic: EdgeBasic): void;
  onEdgeUpdate?(id: string, edgeBasic: EdgeBasic): void;
  // onEdgeDelete(): void;
}

export type SelectedItemType = 'node' | 'edge';

export type SelectedItemCollection = {
  node: IObject<string>;
  edge: IObject<string>;
};

export type HandleMap = {
  [handleId: string]: HandleElement;
};

export type HandlesInfo = {
  source: HandleMap;
  target: HandleMap;
};

export type ActiveNextType = (
  e: React.MouseEvent | null,
  type: SelectedItemType,
  id: string,
  selected: boolean,
  force?: boolean,
) => void;
export interface GeneralMethods {
  activateItem: ActiveNextType;
  getScale(): number;
}
export type ConnectMethodType = (
  e: React.MouseEvent,
  type: HandleType,
  nodeId: string,
  handleId: string,
) => void;
export interface InterfaceValue extends GeneralMethods {
  edge: EdgeMouseInterface;
  node: NodeMouseInterface;
  handle: HandleInterface;
}
export interface HandleInterface {
  onMouseDown: ConnectMethodType;
  onMouseUp: ConnectMethodType;
}

export interface RecoilNexusInterface {
  getRecoil: <T>(atom: RecoilValue<T>) => T;
  getRecoilPromise: <T>(atom: RecoilValue<T>) => Promise<T>;
  setRecoil: <T>(atom: RecoilState<T>, valOrUpdater: UpdaterType<T>) => void;
  resetRecoil: (atom: RecoilState<any>) => void;
}

export type UpdaterType<T> = T | ((currVal: T) => T);

export type AtomForceRender = {
  forceRender: number;
};

export type DeleteItem = {
  type: SelectedItemType;
  id: string;
};

export type DeletePayload = DeleteItem[];

export type AtomStateGetterType = <T>(type: SelectedItemType, id: string) => T | false;
export type AtomStateSetterType = <T>(
  type: SelectedItemType,
  id: string,
  updater: T | ((c: T) => T),
) => T;

export type AtomUpdater<T> = (atom: JotaiImmerAtom<T>, updater: UpdaterType<T>) => void;

export type ItemDifferProps = {
  nodes: IObject<Node>;
  edges: IObject<Edge>;
  atomSetter: <T>(atom: RecoilState<T>, updater: UpdaterType<T>) => void;
};

export type ItemDifferInterface = {
  nodeUpdater: NodeUpdater;
  edgeUpdater: EdgeUpdater;
};
