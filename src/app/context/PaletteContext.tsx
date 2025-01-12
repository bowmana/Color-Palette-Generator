import { createContext, useContext, useState } from 'react';
import { CoreState } from '@/app/types';
import { useHistory } from '@/app/hooks/useHistory';
import { useToolActions } from '@/app/hooks/useToolActions';
import { useGridTransformActions } from '@/app/hooks/useGridTransformActions';
import { useSelectionActions } from '@/app/hooks/useSelectionActions';
import { useLockActions } from '@/app/hooks/useLockActions';
import { PaletteContextType } from '@/app/types';
import { UIState } from '@/app/types';

const PaletteContext = createContext<PaletteContextType | null>(null);

export function PaletteProvider({ children }: { children: React.ReactNode }) {
  // Core state with history
  const { 
    state, 
    pushState, 
    undo, 
    redo, 
    canUndo, 
    canRedo 
  } = useHistory<CoreState>({
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

  const updateState = (updates: Partial<CoreState>) => {
    pushState({ ...state, ...updates });
  };

  // UI state (no history needed)
  const [uiState, setUIState] = useState<UIState>({
    previewPalette: null,
    tempSelectedCells: [],
    tempLockedCells: [],
    isSelecting: false,
    isLocking: false,
    selectionStart: null,
    lockStart: null,
    ropePoints: [],
    lockRopePoints: [],
    rotationPreview: null
  });

  // UI state setters
  const uiStateSetters = {
    setPreviewPalette: (palette: string[] | null) => 
      setUIState(prev => ({ ...prev, previewPalette: palette })),
    setTempSelectedCells: (cells: number[]) => 
      setUIState(prev => ({ ...prev, tempSelectedCells: cells })),
    setIsSelecting: (selecting: boolean) => 
      setUIState(prev => ({ ...prev, isSelecting: selecting })),
    setSelectionStart: (index: number | null) => 
      setUIState(prev => ({ ...prev, selectionStart: index })),
    setRopePoints: (points: number[]) => 
      setUIState(prev => ({ ...prev, ropePoints: points })),
    setTempLockedCells: (cells: number[]) => 
      setUIState(prev => ({ ...prev, tempLockedCells: cells })),
    setIsLocking: (locking: boolean) => 
      setUIState(prev => ({ ...prev, isLocking: locking })),
    setLockStart: (index: number | null) => 
      setUIState(prev => ({ ...prev, lockStart: index })),
    setLockRopePoints: (points: number[]) => 
      setUIState(prev => ({ ...prev, lockRopePoints: points }))
  };

  // Actions
  const actions = {
    tool: useToolActions(state, updateState),
    grid: useGridTransformActions(state, updateState),
    selection: useSelectionActions(state, updateState, {
      setPreviewPalette: uiStateSetters.setPreviewPalette,
      setTempSelectedCells: uiStateSetters.setTempSelectedCells,
      setIsSelecting: uiStateSetters.setIsSelecting,
      setSelectionStart: uiStateSetters.setSelectionStart,
      setRopePoints: uiStateSetters.setRopePoints
    }),
    lock: useLockActions(state, updateState, {
      setTempLockedCells: uiStateSetters.setTempLockedCells,
      setIsLocking: uiStateSetters.setIsLocking,
      setLockStart: uiStateSetters.setLockStart,
      setLockRopePoints: uiStateSetters.setLockRopePoints,
      setPreviewPalette: uiStateSetters.setPreviewPalette
    })
  };


  
  return (
    <PaletteContext.Provider value={{ 
      state,
      uiState,
      actions,
      history: { undo, redo, canUndo, canRedo },
      updateState,
      setUIState
    }}>
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