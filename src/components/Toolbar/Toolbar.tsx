import React from 'react';

interface ToolbarProps {
  canUndo: boolean;
  canRedo: boolean;
  undo: () => void;
  redo: () => void;
}

export function Toolbar({ canUndo, canRedo, undo, redo }: ToolbarProps) {
  return (
    <div className="flex gap-2">
      <button
        onClick={undo}
        disabled={!canUndo}
        className={`p-2 rounded-lg ${
          canUndo ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-400'
        }`}
        title="Undo (Ctrl+Z)"
      >
        {/* SVG Icon */}
      </button>
      <button
        onClick={redo}
        disabled={!canRedo}
        className={`p-2 rounded-lg ${
          canRedo ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-400'
        }`}
        title="Redo (Ctrl+Y)"
      >
        {/* SVG Icon */}
      </button>
    </div>
  );
} 