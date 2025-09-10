import React from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import { ReactFlowProvider } from '@xyflow/react';
import Launcher from './components/Launcher';
import VisualWritingInterface from './components/VisualWritingInterface';

function App() {
  return (
    <main className="dark text-foreground bg-background h-screen w-screen">
      <HashRouter>
        <Routes>
          <Route path="/" element={<Launcher />} />
          <Route path="/editor" element={
            <ReactFlowProvider>
              <VisualWritingInterface />
            </ReactFlowProvider>
          } />
        </Routes>
      </HashRouter>
    </main>
  );
}

export default App;