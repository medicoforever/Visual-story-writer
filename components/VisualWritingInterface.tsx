
import React, { useEffect, useRef } from 'react';
import { useAppStore, useAppActions } from '../hooks/useAppStore';
import TextEditor from './TextEditor';
import EntitiesEditor from './EntitiesEditor';
import LocationsEditor from './LocationsEditor';
import ActionTimeline from './ActionTimeline';
import HistoryTree from './HistoryTree'; // Assuming this will be created
import { stopAllLayouts, runLayout } from '../utils/layout';

const RefreshIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0011.664 0l3.181-3.183m-11.664 0l3.181-3.183a8.25 8.25 0 00-11.664 0l3.181 3.183z" />
    </svg>
);

const WriteIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487zm0 0L19.5 7.125" />
    </svg>
);


export default function VisualWritingInterface() {
  const { selectedTab, isStale, isLoading, entityNodes, locationNodes } = useAppStore();
  const { setSelectedTab, refreshVisualsFromText, rewriteFromVisuals, setEntityNodes, setLocationNodes } = useAppActions();
  const visualPanelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    stopAllLayouts();
    if(visualPanelRef.current) {
        const center = { x: visualPanelRef.current.clientWidth / 2, y: visualPanelRef.current.clientHeight / 2 };
        if (selectedTab === 'entities') {
            runLayout('entities', entityNodes, setEntityNodes, center, 120);
        } else {
            runLayout('locations', locationNodes, setLocationNodes, center, 120);
        }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedTab, entityNodes.length, locationNodes.length]);


  return (
    <div className="flex flex-col h-screen bg-gray-800 text-gray-200">
      <div className="flex flex-grow overflow-hidden">
        {/* Text Editor Panel */}
        <div className="w-1/2 flex flex-col p-4">
            <div className="bg-gray-900 rounded-lg shadow-inner flex-grow overflow-hidden relative">
                 <TextEditor />
            </div>
        </div>
        
        {/* Separator and Buttons */}
        <div className="flex flex-col items-center justify-center px-2 bg-gray-800">
            <div className="flex flex-col gap-4">
                 <button 
                    onClick={refreshVisualsFromText}
                    disabled={isLoading}
                    className={`p-3 rounded-full transition-colors duration-200 ${isStale ? 'bg-purple-600 text-white animate-pulse' : 'bg-gray-700 hover:bg-purple-500'} disabled:opacity-50 disabled:cursor-not-allowed`}
                    title="Refresh Visuals from Text"
                >
                    {isLoading ? <div className="w-6 h-6 border-2 border-t-transparent border-white rounded-full animate-spin"></div> : <RefreshIcon />}
                </button>
                 <button 
                    onClick={rewriteFromVisuals}
                    disabled={isLoading}
                    className="p-3 bg-gray-700 rounded-full hover:bg-purple-500 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    title="Rewrite Text from Visuals"
                >
                    {isLoading ? <div className="w-6 h-6 border-2 border-t-transparent border-white rounded-full animate-spin"></div> : <WriteIcon />}
                </button>
            </div>
        </div>

        {/* Visual Panel */}
        <div className="w-1/2 flex flex-col p-4">
            <div className="bg-gray-900 rounded-lg shadow-inner flex-grow flex flex-col overflow-hidden">
                <div className="p-2 border-b border-gray-700">
                    <div className="flex justify-center bg-gray-800 p-1 rounded-lg">
                        <button onClick={() => setSelectedTab('entities')} className={`px-4 py-2 text-sm font-medium rounded-md w-1/2 transition ${selectedTab === 'entities' ? 'bg-purple-600 text-white' : 'text-gray-400 hover:bg-gray-700'}`}>Entities & Actions</button>
                        <button onClick={() => setSelectedTab('locations')} className={`px-4 py-2 text-sm font-medium rounded-md w-1/2 transition ${selectedTab === 'locations' ? 'bg-purple-600 text-white' : 'text-gray-400 hover:bg-gray-700'}`}>Locations</button>
                    </div>
                </div>
                <div ref={visualPanelRef} className="flex-grow relative">
                    {selectedTab === 'entities' ? <EntitiesEditor /> : <LocationsEditor />}
                </div>
                <ActionTimeline />
            </div>
        </div>
      </div>
      <HistoryTree />
    </div>
  );
}
