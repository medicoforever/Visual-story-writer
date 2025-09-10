import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppActions } from '../hooks/useAppStore';
import { aliceInWonderland } from '../data/sampleStory';

const FloatingEmoji = ({ emoji, style }: { emoji: string; style: React.CSSProperties }) => (
    <span className="absolute text-5xl opacity-20 animate-float" style={style}>
        {emoji}
    </span>
);

export default function Launcher() {
  const navigate = useNavigate();
  const { loadSample, reset } = useAppActions();

  const startWithSample = () => {
    loadSample(aliceInWonderland);
    navigate('/editor');
  };

  const startBlank = () => {
    reset();
    navigate('/editor');
  };

  const emojis = [
    { emoji: '🏰', style: { top: '10%', left: '15%', animationDuration: '15s' } },
    { emoji: '🐉', style: { top: '20%', right: '10%', animationDuration: '12s', animationDelay: '2s' } },
    { emoji: '🦄', style: { top: '65%', left: '20%', animationDuration: '18s' } },
    { emoji: '📖', style: { top: '70%', right: '15%', animationDuration: '10s', animationDelay: '1s' } },
    { emoji: '🚀', style: { top: '50%', left: '5%', animationDuration: '13s', animationDelay: '3s' } },
    { emoji: '🧚‍♀️', style: { top: '40%', right: '25%', animationDuration: '16s', animationDelay: '0.5s' } },
  ];

  return (
    <div className="relative flex flex-col justify-center items-center h-full bg-gray-900 text-white overflow-hidden">
      {emojis.map((e, i) => <FloatingEmoji key={i} {...e} />)}
      
      <div className="text-center p-8 max-w-2xl z-10">
        <h1 className="text-6xl font-bold mb-4">
          <span className="text-purple-400">Visual</span> Story Writer ☯️
        </h1>
        <p className="text-xl text-gray-300 mb-8">
          Bring your stories to life. See your narrative as an interactive graph of characters, actions, and places. Edit the visuals, and let AI rewrite the story.
        </p>
        <div className="flex justify-center gap-6">
          <button
            onClick={startWithSample}
            className="px-8 py-4 bg-purple-600 text-white font-semibold rounded-lg shadow-lg hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50 transform transition-transform hover:scale-105"
          >
            Try "Alice in Wonderland"
          </button>
          <button
            onClick={startBlank}
            className="px-8 py-4 bg-gray-700 text-white font-semibold rounded-lg shadow-lg hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50 transform transition-transform hover:scale-105"
          >
            Start with a Blank Page
          </button>
        </div>
      </div>
    </div>
  );
}