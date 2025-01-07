import { AppState, Direction, Tool, Dimensions } from "@/app/types";
import {
  reshapeGrid,
  popGridSection
} from "@/utils/gridHandlers";
import {
  clearColumn,
  clearRow,
  copyColumn,
  pasteColumn,
  copyRow,
  pasteRow,
  removeColumn,
  removeRow
} from "@/utils/paletteHandlers";
import { getMovedPalette } from "@/utils/transformHandlers";

/**
 * A custom hook that bundles a variety of grid-related handlers.
 * This keeps your page component short and readable.
 */
export function useGridHandlers(
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
  // Grid + Dimensions
  // --------------------------------------------
  const handleDimensionsChange = (newDimensions: Dimensions) => {
    const newPalette = reshapeGrid(palette, dimensions, newDimensions);
    updateState({
      dimensions: newDimensions,
      palette: newPalette,
    });
  };

  const handlePop = (direction: Direction) => {
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
  // Row + Column
  // --------------------------------------------
  const handleColumnClear = (columnIndex: number) => {
    const newPalette = clearColumn(palette, dimensions, columnIndex);
    updateState({ palette: newPalette });
  };

  const handleRowClear = (rowIndex: number) => {
    const newPalette = clearRow(palette, dimensions, rowIndex);
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

  const handleRowCopy = (rowIndex: number) => {
    const { copiedRow, copiedColumn } = copyRow(rowIndex);
    updateState({ copiedRow, copiedColumn });
  };

  const handleRowPaste = (rowIndex: number) => {
    if (copiedRow === null || copiedRow === rowIndex) return;
    const newPalette = pasteRow(palette, dimensions, copiedRow, rowIndex);
    updateState({ palette: newPalette, copiedRow: null });
  };

  const handleColumnRemove = (columnIndex: number) => {
    const { newPalette, newWidth } = removeColumn(palette, dimensions, columnIndex);
    updateState({
      dimensions: { ...dimensions, width: newWidth },
      palette: newPalette,
    });
  };

  const handleRowRemove = (rowIndex: number) => {
    const newPalette = removeRow(palette, dimensions, rowIndex);
    updateState({
      dimensions: { ...dimensions, height: dimensions.height - 1 },
      palette: newPalette,
    });
  };

  // --------------------------------------------
  // Transform / Move
  // --------------------------------------------
  const handleTransform = (transformType: string, targetIndex?: number) => {
    switch (transformType) {
      case "move": {
        if (!targetIndex || selectedCells.length === 0) return;
        
        const startRow = Math.floor(selectedCells[0] / dimensions.width);
        const startCol = selectedCells[0] % dimensions.width;
        const targetRow = Math.floor(targetIndex / dimensions.width);
        const targetCol = targetIndex % dimensions.width;

        const rowOffset = targetRow - startRow;
        const colOffset = targetCol - startCol;

        updateState({
          palette: getMovedPalette(
            palette,
            selectedCells,
            dimensions,
            rowOffset,
            colOffset,
            lockedCells
          )
        });
        break;
      }
      // If you have other transform cases (rotate, shift, etc.), you can move them here as needed.
      default:
        break;
    }
  };

  // --------------------------------------------
  // Copy / Paste Colors
  // --------------------------------------------
  const handleCopyCells = (indices: number[]) => {
    const unlockedIndices = indices.filter(index => !lockedCells.includes(index));
    if (unlockedIndices.length > 0) {
      const colors = unlockedIndices.map(index => palette[index]);
      updateState({
        copiedCells: { indices: unlockedIndices, colors },
        selectedTool: "paint",
        copiedColumn: null,
        copiedRow: null,
      });
    }
  };

  const handlePasteCells = (targetStartIndex: number) => {
    if (!copiedCells) return;
    
    const newPalette = [...palette];
    const { indices, colors } = copiedCells;
    
    // Calculate relative positions
    const startRow = Math.floor(indices[0] / dimensions.width);
    const startCol = indices[0] % dimensions.width;
    const targetRow = Math.floor(targetStartIndex / dimensions.width);
    const targetCol = targetStartIndex % dimensions.width;
    
    indices.forEach((sourceIndex, i) => {
      const relativeRow = Math.floor(sourceIndex / dimensions.width) - startRow;
      const relativeCol = (sourceIndex % dimensions.width) - startCol;
      const targetIndex = (targetRow + relativeRow) * dimensions.width + (targetCol + relativeCol);
      
      if (
        targetRow + relativeRow >= 0 &&
        targetRow + relativeRow < dimensions.height &&
        targetCol + relativeCol >= 0 &&
        targetCol + relativeCol < dimensions.width &&
        !lockedCells.includes(targetIndex)
      ) {
        newPalette[targetIndex] = colors[i];
      }
    });
    
    updateState({
      palette: newPalette,
      copiedCells: null
    });
  };

  // --------------------------------------------
  // Additional Palette Adjustments
  // --------------------------------------------
  const handleCopyPalette = (
    colors: string[],
    newDimensions: { width: number; height: number }
  ) => {
    updateState({
      dimensions: newDimensions,
      palette: colors,
    });
  };

  const handleCellAdjustment = (index: number, newColor: string) => {
    const newPalette = [...palette];
    newPalette[index] = newColor;
    updateState({ palette: newPalette });
  };

  const handleMultiCellAdjustment = (newColor: string) => {
    const newPalette = [...palette];
    selectedCells.forEach(index => {
      if (!lockedCells.includes(index)) {
        newPalette[index] = newColor;
      }
    });
    updateState({ palette: newPalette });
  };

  // --------------------------------------------
  // Handlers returned to the calling component
  // --------------------------------------------
  return {
    handleDimensionsChange,
    handlePop,
    handleColumnClear,
    handleRowClear,
    handleColumnCopy,
    handleColumnPaste,
    handleRowCopy,
    handleRowPaste,
    handleColumnRemove,
    handleRowRemove,
    handleTransform,
    handleCopyCells,
    handlePasteCells,
    handleCopyPalette,
    handleCellAdjustment,
    handleMultiCellAdjustment
  };
} 
// import { AppState, Direction, Dimensions } from "@/app/types";
// import {
//   reshapeGrid,
//   popGridSection,
// } from "@/components/GridControls/GridOperations";

// export function useGridHandlers(
//   state: AppState,
//   updateState: (updates: Partial<AppState>) => void
// ) {
//   const { palette, dimensions, lockedCells, selectedCells } = state;

//   const handleDimensionsChange = (newDimensions: Dimensions) => {
//     const newPalette = reshapeGrid(palette, dimensions, newDimensions);
//     updateState({
//       dimensions: newDimensions,
//       palette: newPalette,
//     });
//   };

//   const handlePop = (direction: Direction) => {
//     const { newColors, newDimensions } = popGridSection(
//       palette,
//       dimensions,
//       direction
//     );
//     updateState({
//       dimensions: newDimensions,
//       palette: newColors,
//     });
//   };

//   // ... other handlers

//   return {
//     handleDimensionsChange,
//     handlePop,
//     // ... other handlers
//   };
// } 