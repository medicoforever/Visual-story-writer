import React, { useMemo, memo } from 'react';
import { Background, Controls, ReactFlow, Handle, Position, applyNodeChanges, applyEdgeChanges, type NodeProps, type EdgeProps, ConnectionMode, type NodeChange, type EdgeChange, type Node, type Edge, getEdgeCenter } from '@xyflow/react';
import { useAppStore, useAppActions } from '../hooks/useAppStore';
import { type EntityNodeData, type ActionEdgeData, type EntityNode, type ActionEdge } from '../types';

// FIX: Correctly type the props for the memoized component by destructuring and typing props inline.
const EntityNodeComponent = memo(({ id, data, selected }: NodeProps<EntityNodeData>) => {
  return (
    <div className={`drag-handle rounded-lg shadow-lg transition-all duration-200 ${selected ? 'ring-2 ring-purple-500' : 'ring-1 ring-gray-700'} bg-gray-800 w-48`}>
      <div className="flex items-center p-3 border-b border-gray-700">
        <div className="text-2xl mr-3">{data.emoji}</div>
        <div className="font-bold text-gray-200">{data.name}</div>
      </div>
      {data.properties.length > 0 && (
        <div className="p-3 text-xs">
          {data.properties.map((prop) => (
            <div key={prop.name} className="flex items-center justify-between my-1">
              <span className="text-gray-400 capitalize">{prop.name}</span>
              <div className="w-1/2 bg-gray-700 rounded-full h-1.5">
                <div className="bg-purple-500 h-1.5 rounded-full" style={{ width: `${prop.value * 10}%` }}></div>
              </div>
            </div>
          ))}
        </div>
      )}
      <Handle type="source" position={Position.Top} className="!w-2 !h-2 !bg-purple-500" />
      <Handle type="target" position={Position.Top} className="!w-2 !h-2 !bg-purple-500" />
      <Handle type="source" position={Position.Right} className="!w-2 !h-2 !bg-purple-500" />
      <Handle type="target" position={Position.Right} className="!w-2 !h-2 !bg-purple-500" />
      <Handle type="source" position={Position.Bottom} className="!w-2 !h-2 !bg-purple-500" />
      <Handle type="target" position={Position.Bottom} className="!w-2 !h-2 !bg-purple-500" />
      <Handle type="source" position={Position.Left} className="!w-2 !h-2 !bg-purple-500" />
      <Handle type="target" position={Position.Left} className="!w-2 !h-2 !bg-purple-500" />
    </div>
  );
});
EntityNodeComponent.displayName = 'EntityNodeComponent';

// FIX: Correctly type the props for the memoized component by destructuring and typing props inline.
const ActionEdgeComponent = memo(({ id, sourceX, sourceY, targetX, targetY, label, markerEnd }: EdgeProps<ActionEdgeData>) => {
  const [edgeCenterX, edgeCenterY] = getEdgeCenter({
    sourceX,
    sourceY,
    targetX,
    targetY,
  });

  return (
    <>
      <path id={id} d={`M ${sourceX},${sourceY} L ${targetX},${targetY}`} className="react-flow__edge-path stroke-gray-500" markerEnd={markerEnd} />
      <foreignObject
        width={100}
        height={30}
        x={edgeCenterX - 50}
        y={edgeCenterY - 15}
        className="overflow-visible"
      >
        <div className="flex items-center justify-center h-full">
            <div className="bg-gray-800 text-purple-400 text-xs px-2 py-1 rounded-full border border-gray-700">
                {label}
            </div>
        </div>
      </foreignObject>
    </>
  );
});
ActionEdgeComponent.displayName = 'ActionEdgeComponent';


export default function EntitiesEditor() {
  const { entityNodes, actionEdges, highlightedActionsSegment, filteredActionsSegment } = useAppStore();
  const { setEntityNodes, setActionEdges, setSelectedNodes, setSelectedEdges } = useAppActions();
  
  const nodeTypes = useMemo(() => ({ entityNode: EntityNodeComponent }), []);
  const edgeTypes = useMemo(() => ({ actionEdge: ActionEdgeComponent }), []);

  const onNodesChange = (changes: NodeChange[]) => setEntityNodes((nds) => applyNodeChanges(changes, nds) as EntityNode[]);
  const onEdgesChange = (changes: EdgeChange[]) => setActionEdges((eds) => applyEdgeChanges(changes, eds) as ActionEdge[]);

  const onSelectionChange = ({ nodes, edges }: { nodes: Node[], edges: Edge[] }) => {
    setSelectedNodes(nodes.map(n => n.id));
    setSelectedEdges(edges.map(e => e.id));
  };
  
  const displayedEdges = useMemo(() => {
    const activeSegment = highlightedActionsSegment || filteredActionsSegment;
    if (!activeSegment) return actionEdges;
    return actionEdges.slice(activeSegment.start, activeSegment.end + 1);
  }, [actionEdges, highlightedActionsSegment, filteredActionsSegment]);

  return (
    <ReactFlow
      nodes={entityNodes}
      edges={displayedEdges}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      onSelectionChange={onSelectionChange}
      nodeTypes={nodeTypes}
      edgeTypes={edgeTypes}
      connectionMode={ConnectionMode.Loose}
      fitView
      fitViewOptions={{ padding: 0.2 }}
      className="bg-gray-900"
    >
      <Background color="#4a5568" gap={16} />
      <Controls className="fill-gray-300 stroke-gray-300 [&>button]:bg-gray-700 [&>button]:border-none hover:[&>button]:bg-gray-600" />
    </ReactFlow>
  );
}