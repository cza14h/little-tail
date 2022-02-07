import type { EdgeProps } from "@app/types";
import { Component } from "react";

//Straight Edge
class BasicEdge extends Component<EdgeProps>{
  render() {
    const {
      sourceX,
      sourceY,
      targetX,
      targetY,
      markerEnd,
      markerStart
    } = this.props
    return <path
      className="tail-edge-basic"
      d={`M ${sourceX},${sourceY}L ${targetX},${targetY}`}
      markerEnd={markerEnd}
      markerStart={markerStart}
    />
  }
}

export default BasicEdge