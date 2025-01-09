import { createContext, useContext } from 'react';
import { AppState } from '@/app/types';
import { usePaletteGridState } from '@/app/hooks/usePaletteGridState';
import { useHistory } from '@/app/hooks/useHistory';

type PaletteContextType = {
  state: AppState;
  handlers: ReturnType<typeof usePaletteGridState>;
  undo: () => void;
  redo: () => void;
  canUndo: boolean;
  canRedo: boolean;
  updateState: (updates: Partial<AppState>) => void;
};

const PaletteContext = createContext<PaletteContextType | null>(null);

export function PaletteProvider({ children }: { children: React.ReactNode }) {
  const { state, pushState, undo, redo, canUndo, canRedo } = useHistory<AppState>({
    dimensions: { width: 16, height: 16 },
    palette: Array(16 * 16).fill("#ffffff"),
    selectedColor: "#000000",
    selectedTool: "paint",
    selectedCell: null,
    selectedCells: [],
    copiedCells: null,
    copiedColumn: null,
    copiedRow: null,
    lockedCells: [],
  });

  const updateState = (updates: Partial<AppState>) => {
    pushState({ ...state, ...updates });
  };

  const handlers = usePaletteGridState(state, updateState);

  return (
    <PaletteContext.Provider 
      value={{ 
        state, 
        handlers, 
        undo, 
        redo, 
        canUndo, 
        canRedo, 
        updateState 
      }}
    >
      {children}
    </PaletteContext.Provider>
  );
}

export function usePaletteContext() {
  const context = useContext(PaletteContext);
  if (!context) {
    throw new Error('usePaletteContext must be used within a PaletteProvider');
  }
  return context;
}