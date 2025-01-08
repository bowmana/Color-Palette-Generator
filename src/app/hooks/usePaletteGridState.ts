import { AppState, Direction, Tool, Dimensions } from "@/app/types";
import {
  reshapeGrid,
  popGridSection
} from "@/utils/gridHelpers";
import {
  clearColumn,
  clearRow,
  copyColumn,
  pasteColumn,
  copyRow,
  pasteRow,
  removeColumn,
  removeRow
} from "@/utils/paletteHelpers";

/**
 * A custom hook that manages palette and grid state operations.
 */
export function usePaletteGridState(
  state: AppState,
  updateState: (updates: Partial<AppState>) => void
) {
  const {
    dimensions,
    palette,
    selectedColor,
    selectedTool,
    selectedCell,
    selectedCells,
    copiedCells,
    copiedColumn,
    copiedRow,
    lockedCells,
  } = state;

  // --------------------------------------------
  // Grid Actions
  // --------------------------------------------
  const handleGridResize = (newDimensions: Dimensions) => {
    const newPalette = reshapeGrid(palette, dimensions, newDimensions);
    updateState({
      dimensions: newDimensions,
      palette: newPalette,
    });
  };

  const handleGridPop = (direction: Direction) => {
    const { newColors, newDimensions } = popGridSection(
      palette,
      dimensions,
      direction
    );
    updateState({
      dimensions: newDimensions,
      palette: newColors,
    });
  };

  // --------------------------------------------
  // Column Actions
  // --------------------------------------------
  const handleColumnClear = (columnIndex: number) => {
    const newPalette = clearColumn(palette, dimensions, columnIndex);
    updateState({ palette: newPalette });
  };

  const handleColumnCopy = (columnIndex: number) => {
    const { copiedColumn, copiedRow } = copyColumn(columnIndex);
    updateState({ copiedColumn, copiedRow });
  };

  const handleColumnPaste = (columnIndex: number) => {
    if (copiedColumn === null || copiedColumn === columnIndex) return;
    const newPalette = pasteColumn(palette, dimensions, copiedColumn, columnIndex);
    updateState({ palette: newPalette, copiedColumn: null });
  };

  const handleColumnRemove = (columnIndex: number) => {
    const { newPalette, newWidth } = removeColumn(palette, dimensions, columnIndex);
    updateState({
      dimensions: { ...dimensions, width: newWidth },
      palette: newPalette,
    });
  };

  // --------------------------------------------
  // Row Actions
  // --------------------------------------------
  const handleRowClear = (rowIndex: number) => {
    const newPalette = clearRow(palette, dimensions, rowIndex);
    updateState({ palette: newPalette });
  };

  const handleRowCopy = (rowIndex: number) => {
    const { copiedRow, copiedColumn } = copyRow(rowIndex);
    updateState({ copiedRow, copiedColumn });
  };

  const handleRowPaste = (rowIndex: number) => {
    if (copiedRow === null || copiedRow === rowIndex) return;
    const newPalette = pasteRow(palette, dimensions, copiedRow, rowIndex);
    updateState({ palette: newPalette, copiedRow: null });
  };

  const handleRowRemove = (rowIndex: number) => {
    const newPalette = removeRow(palette, dimensions, rowIndex);
    updateState({
      dimensions: { ...dimensions, height: dimensions.height - 1 },
      palette: newPalette,
    });
  };

  // --------------------------------------------
  // Selection Actions
  // --------------------------------------------
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
    if (!copiedCells) return;

    const newPalette = [...palette];
    const { indices, colors } = copiedCells;

    // ... rest of paste logic ...
    updateState({
      palette: newPalette,
      copiedCells: null
    });
  };

  // --------------------------------------------
  // Cell Actions
  // --------------------------------------------
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
    handleGridResize,
    handleGridPop,
    handleColumnClear,
    handleColumnCopy,
    handleColumnPaste,
    handleColumnRemove,
    handleRowClear,
    handleRowCopy,
    handleRowPaste,
    handleRowRemove,
    handleSelectionCopy,
    handleSelectionPaste,
    handleCellUpdate,
    handleCellsUpdate
  };
} 