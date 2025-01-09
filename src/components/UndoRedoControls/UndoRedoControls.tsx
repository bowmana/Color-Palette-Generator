import { usePaletteContext } from '@/app/context/PaletteContext';

export function UndoRedoControls() {
  const { undo, redo, canUndo, canRedo } = usePaletteContext();
  
  return (
    <div className="flex gap-2 mb-4">
      <button
        onClick={undo}
        disabled={!canUndo}
        className={`p-2 rounded-lg ${
          canUndo ? "bg-blue-500 text-white hover:bg-blue-600" : "bg-gray-200 text-gray-400"
        }`}
        title="Undo (Ctrl+Z)"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
            d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" 
          />
        </svg>
      </button>
      <button
        onClick={redo}
        disabled={!canRedo}
        className={`p-2 rounded-lg ${
          canRedo ? "bg-blue-500 text-white hover:bg-blue-600" : "bg-gray-200 text-gray-400"
        }`}
        title="Redo (Ctrl+Y)"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
            d="M21 10h-10a8 8 0 00-8 8v2M21 10l-6 6m6-6l-6-6" 
          />
        </svg>
      </button>
    </div>
  );
}
