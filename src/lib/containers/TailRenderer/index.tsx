import React, { Component, createRef, forwardRef, useImperativeHandle, useRef } from 'react';
import { InterfaceProvider } from '@lib/contexts/instance';
import { RecoilState } from 'recoil';
import type {
  InterfaceValue,
  TailCoreProps,
  SelectedItemType,
  EdgeAtom,
  NodeAtom,
  DeletePayload,
  SelectModeType,
  IObject,
  CoreMethods,
} from '@lib/types';
import { findDeletedItem, getAtom } from './mutation';
import ItemActives from './subInstances/itemActives';
import NodeMoves from './subInstances/nodeMoves';
import EdgeConnects from './subInstances/edgeConnects';
import ItemDiffer from './ItemDiffer';
import NodeRenderer from '../NodeRenderer';
import EdgeRenderer from '../EdgeRenderer';
import InfiniteViewer from '../InfiniteViewer';
import MarkerDefs from '../MarkerDefs';
import '@lib/styles/index.scss';

class TailCore extends Component<TailCoreProps> {
  static displayName = 'TailCore';
  static defaultProps = {
    dropThreshold: 40,
    quickNodeUpdate: true,
  };

  viewer = createRef<InfiniteViewer>();
  edgeRef = createRef<EdgeRenderer>();
  differRef = createRef<ItemDiffer>();
  contextInterface: InterfaceValue;

  ItemActives: ItemActives;
  NodeMoves: NodeMoves;
  EdgeConnects: EdgeConnects;

  constructor(props: TailCoreProps) {
    super(props);
    const { onEdgeClick, onNodeClick, onEdgeContextMenu, onNodeContextMenu } = props;

    this.ItemActives = new ItemActives(this);
    this.NodeMoves = new NodeMoves(this, this.ItemActives);
    this.EdgeConnects = new EdgeConnects(this, this.ItemActives);

    const { batchNodeDrag, batchNodeDragEnd, onDragStart } = this.NodeMoves;
    const { onHandleMouseUp, onHandleMouseDown } = this.EdgeConnects;

    // context methods are not responsive
    this.contextInterface = {
      edge: { onEdgeClick, onEdgeContextMenu },
      node: {
        onDrag: batchNodeDrag,
        onDragEnd: batchNodeDragEnd,
        onNodeClick,
        onDragStart,
        onNodeContextMenu,
      },
      handle: {
        onMouseDown: onHandleMouseDown,
        onMouseUp: onHandleMouseUp,
      },
      activateItem: this.ItemActives.activateNext,
      getScale: this.getScale,
    };
  }

  setScale = (scale: number) => {
    this.viewer.current?.setScale(scale);
  };

  switchMode = (mode: SelectModeType) => {
    this.viewer.current?.switchMode(mode);
  };

  focusNode = (nodeId: string) => {
    const atom = this.getAtomState<NodeAtom>('node', nodeId);
    if (!atom) return;
    const {
      node: { left, top, id },
      rect: { width, height },
    } = atom;
    const centerX = left + (isNaN(width) ? 0 : width) / 2;
    const centerY = top + (isNaN(height) ? 0 : height) / 2;
    this.viewer.current?.moveCamera(centerX, centerY);
    this.ItemActives.loadActiveItems({ node: { [id]: id }, edge: {} });
  };

  render() {
    const {
      nodes,
      edges,
      edgeTemplates,
      connectingEdge,
      nodeTemplates,
      nodeTemplatePicker,
      onViewerDrop,
      onViewerClick,
      markers,
      markerTemplates,
    } = this.props;
    const { deactivateLast, batchActivateNodes } = this.ItemActives;
    return (
      <ItemDiffer ref={this.differRef} nodes={nodes} edges={edges} atomSetter={set}>
        <InfiniteViewer
          ref={this.viewer}
          onClick={deactivateLast}
          onSelectEnd={batchActivateNodes}
          onViewerDrop={onViewerDrop}
          onViewerClick={onViewerClick}
          outerChildren={this.props.children}
          onViewerScale={this.props.onViewerScale}
        >
          <InterfaceProvider value={this.contextInterface}>
            <NodeRenderer
              templates={nodeTemplates}
              templatePicker={nodeTemplatePicker}
            />
            <EdgeRenderer
              ref={this.edgeRef}
              templates={edgeTemplates}
              connectingEdge={connectingEdge}
            >
              <MarkerDefs markers={markers} markerTemplates={markerTemplates} />
            </EdgeRenderer>
          </InterfaceProvider>
        </InfiniteViewer>
      </ItemDiffer>
    );
  }

  deleteItem(payload: DeletePayload) {
    const { nodes, edges } = findDeletedItem(this.edgeRef.current!.edgeTree, payload);
    this.props.onDelete?.(nodes, edges);
  }

  getAtom = <T extends EdgeAtom | NodeAtom>(type: SelectedItemType, id: string) => {
    const pool = type === 'edge' ? this.getEdgeAtoms() : this.getNodeAtoms();
    return getAtom(id, (pool as unknown) as IObject<RecoilState<T>>);
  };

  getEdgeAtoms = () => this.differRef.current?.differInterface.edgeUpdater.getItemAtoms() ?? {};

  getNodeAtoms = () => this.differRef.current?.differInterface.nodeUpdater.getItemAtoms() ?? {};

  getScale = () => this.viewer.current?.getScale() || 1;
}

const Tail = forwardRef<CoreMethods, TailCoreProps>(({ children, ...otherprops }, ref) => {
  const coreRef = useRef<TailCore>(null);
  useImperativeHandle(
    ref,
    () => ({
      setScale: (s) => coreRef.current?.setScale(s),
      switchMode: (t) => coreRef.current?.switchMode(t),
      focusNode: (i) => coreRef.current?.focusNode(i),
      getActiveItems: () =>
        coreRef.current?.ItemActives.activeItems ?? {
          node: {},
          edge: {},
        },
      getEdgeTree: () => coreRef.current?.edgeRef.current?.edgeTree ?? new Map(),
      moveViewCenter: (x, y) => coreRef.current?.viewer.current?.moveCamera(x, y),
      setActiveItems: (i) => coreRef.current?.ItemActives.loadActiveItems(i),
    }),
    [],
  );
  return (
    <TailCore ref={coreRef} {...otherprops}>
      {children}
    </TailCore>
  );
});

Tail.displayName = 'Tail';

export { Tail };
export default TailCore;
