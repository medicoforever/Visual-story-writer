import React, { useMemo, memo } from 'react';
import { Background, Controls, ReactFlow, applyNodeChanges, Handle, Position, type NodeProps, type NodeChange } from '@xyflow/react';
import { useAppStore, useAppActions } from '../hooks/useAppStore';
import { type LocationNode, type LocationNodeData } from '../types';

// FIX: Correctly type the props for the memoized component by destructuring and typing props inline.
const LocationNodeComponent = memo(({ data, selected }: NodeProps<LocationNodeData>) => {
    return (
        <div className={`drag-handle flex flex-col items-center justify-center w-40 h-40 rounded-full shadow-lg transition-all duration-200 ${selected ? 'ring-2 ring-purple-500' : 'ring-1 ring-gray-700'} bg-gray-800`}>
            <div className="text-5xl mb-2">{data.emoji}</div>
            <div className="font-bold text-gray-200">{data.name}</div>
            <Handle type="source" position={Position.Top} className="!w-2 !h-2 !bg-purple-500 opacity-0" />
            <Handle type="target" position={Position.Top} className="!w-2 !h-2 !bg-purple-500 opacity-0" />
            <Handle type="source" position={Position.Right} className="!w-2 !h-2 !bg-purple-500 opacity-0" />
            <Handle type="target" position={Position.Right} className="!w-2 !h-2 !bg-purple-500 opacity-0" />
            <Handle type="source" position={Position.Bottom} className="!w-2 !h-2 !bg-purple-500 opacity-0" />
            <Handle type="target" position={Position.Bottom} className="!w-2 !h-2 !bg-purple-500 opacity-0" />
            <Handle type="source" position={Position.Left} className="!w-2 !h-2 !bg-purple-500 opacity-0" />
            <Handle type="target" position={Position.Left} className="!w-2 !h-2 !bg-purple-500 opacity-0" />
        </div>
    );
});
LocationNodeComponent.displayName = 'LocationNodeComponent';

export default function LocationsEditor() {
    const { locationNodes } = useAppStore();
    const { setLocationNodes } = useAppActions();

    const nodeTypes = useMemo(() => ({ locationNode: LocationNodeComponent }), []);
    const onNodesChange = (changes: NodeChange[]) => setLocationNodes((nds) => applyNodeChanges(changes, nds) as LocationNode[]);

    return (
        <ReactFlow
            nodes={locationNodes}
            onNodesChange={onNodesChange}
            nodeTypes={nodeTypes}
            fitView
            fitViewOptions={{ padding: 0.2 }}
            className="bg-gray-900"
        >
            <Background color="#4a5568" gap={16} />
            <Controls className="fill-gray-300 stroke-gray-300 [&>button]:bg-gray-700 [&>button]:border-none hover:[&>button]:bg-gray-600" />
        </ReactFlow>
    );
}