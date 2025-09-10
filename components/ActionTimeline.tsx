
import React from 'react';
import { useAppStore, useAppActions } from '../hooks/useAppStore';

export default function ActionTimeline() {
  const { actionEdges } = useAppStore();
  const { setHighlightedActionsSegment } = useAppActions();

  return (
    <div 
        className="flex-shrink-0 p-2 border-t border-gray-700 bg-gray-900"
        onMouseLeave={() => setHighlightedActionsSegment(null, null)}
    >
      <div className="flex items-center space-x-2 overflow-x-auto pb-2">
        {actionEdges.map((edge, index) => (
          <div
            key={edge.id}
            onMouseEnter={() => setHighlightedActionsSegment(index, index)}
            className="flex-shrink-0 px-3 py-1.5 bg-gray-800 rounded-full text-xs text-gray-300 cursor-pointer hover:bg-purple-600 hover:text-white transition-colors duration-200 shadow"
          >
            {edge.label}
          </div>
        ))}
      </div>
    </div>
  );
}
