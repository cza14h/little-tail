import type { CSSProperties } from 'react';
import type { RecoilState } from 'recoil';
import { Box, NodeAtom } from '.';

export type MinimapProps = {
  activeColor?: string;
  nodeColor?: string;
  // padding?: number;
} & {
  [key in keyof MapStyleProps]?: MapStyleProps[key];
};

export type MapStyleProps = {
  height: number;
  width: number;
  style: CSSProperties;
  viewportFrameColor: string;
  realtimeBoundary?: boolean;
};

export type MapContainerProps = MapStyleProps & {
  sortedX: number[];
  sortedY: number[];
};

export type MapContainerState = {
  lockBoundary: boolean;
};

export type MinimapState = {
  sortedX: number[];
  sortedY: number[];
};

export type MiniNodeProps = {
  atom: RecoilState<NodeAtom>;
  activeColor: string;
  nodeColor: string;
  updateBox(box: Box, lastBox?: Box): void;
  removeBox(box: Box): void;
};

export type MapBoundary = {
  left: number;
  top: number;
  maxRatio: number;
  vh: number;
  vw: number;
} | null;
