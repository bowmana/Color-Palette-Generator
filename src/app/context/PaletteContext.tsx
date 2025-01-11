import { createContext, useContext, useState } from 'react';
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
  previewPalette: string[] | null;
  setPreviewPalette: React.Dispatch<React.SetStateAction<string[] | null>>;
  tempSelectedCells: number[];
  setTempSelectedCells: React.Dispatch<React.SetStateAction<number[]>>;
  isSelecting: boolean;
  setIsSelecting: React.Dispatch<React.SetStateAction<boolean>>;
  selectionStart: number | null;
  setSelectionStart: React.Dispatch<React.SetStateAction<number | null>>;
  ropePoints: number[];
  setRopePoints: React.Dispatch<React.SetStateAction<number[]>>;
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

  const [previewPalette, setPreviewPalette] = useState<string[] | null>(null);
  const [tempSelectedCells, setTempSelectedCells] = useState<number[]>([]);
  const [isSelecting, setIsSelecting] = useState(false);
  const [selectionStart, setSelectionStart] = useState<number | null>(null);
  const [ropePoints, setRopePoints] = useState<number[]>([]);

  const updateState = (updates: Partial<AppState>) => {
    pushState({ ...state, ...updates });
  };

  const handlers = usePaletteGridState(state, updateState, {
    setPreviewPalette,
    setTempSelectedCells,
    setIsSelecting,
    setSelectionStart,
    setRopePoints
  });

  return (
    <PaletteContext.Provider 
      value={{ 
        state, 
        handlers, 
        undo, 
        redo, 
        canUndo, 
        canRedo, 
        updateState,
        previewPalette,
        setPreviewPalette,
        tempSelectedCells,
        setTempSelectedCells,
        isSelecting,
        setIsSelecting,
        selectionStart,
        setSelectionStart,
        ropePoints,
        setRopePoints
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