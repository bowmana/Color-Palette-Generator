import { AppState } from "@/app/types";

export function useSelectionActions(
  state: AppState,
  updateState: (updates: Partial<AppState>) => void
) {
  const { palette, selectedCells, lockedCells } = state;

  const handleSelectionCopy = () => {
    if (selectedCells.length === 0) return;
    
    const colors = selectedCells.map(index => palette[index]);
    updateState({
      copiedCells: {
        indices: selectedCells,
        colors
      }
    });
  };

  const handleSelectionPaste = (targetIndex: number) => {
    if (!state.copiedCells) return;

    const newPalette = [...palette];
    const { indices, colors } = state.copiedCells;

    // ... paste logic ...
    updateState({
      palette: newPalette,
      copiedCells: null
    });
  };

  const handleCellUpdate = (index: number, newColor: string) => {
    const newPalette = [...palette];
    newPalette[index] = newColor;
    updateState({ palette: newPalette });
  };

  const handleCellsUpdate = (newColor: string) => {
    const newPalette = [...palette];
    selectedCells.forEach(index => {
      if (!lockedCells.includes(index)) {
        newPalette[index] = newColor;
      }
    });
    updateState({ palette: newPalette });
  };

  return {
    handleSelectionCopy,
    handleSelectionPaste,
    handleCellUpdate,
    handleCellsUpdate,
  };
} 