import { Dimensions } from "@/app/types";

/**
 * Clears all cells in a specified column.
 */
export function clearColumn(
  palette: string[],
  dimensions: Dimensions,
  columnIndex: number
): string[] {
  const newPalette = [...palette];
  for (let row = 0; row < dimensions.height; row++) {
    const index = row * dimensions.width + columnIndex;
    newPalette[index] = "#ffffff";
  }
  return newPalette;
}

/**
 * Clears all cells in a specified row.
 */
export function clearRow(
  palette: string[],
  dimensions: Dimensions,
  rowIndex: number
): string[] {
  const newPalette = [...palette];
  for (let col = 0; col < dimensions.width; col++) {
    const index = rowIndex * dimensions.width + col;
    newPalette[index] = "#ffffff";
  }
  return newPalette;
}

/**
 * Stores a column for copying.
 */
export function copyColumn(columnIndex: number) {
  return {
    copiedColumn: columnIndex,
    copiedRow: null,
  };
}

/**
 * Applies copied column data to a target column.
 */
export function pasteColumn(
  palette: string[],
  dimensions: Dimensions,
  sourceColumn: number,
  targetColumn: number
): string[] {
  const newPalette = [...palette];
  for (let row = 0; row < dimensions.height; row++) {
    const sourceIndex = row * dimensions.width + sourceColumn;
    const targetIndex = row * dimensions.width + targetColumn;
    newPalette[targetIndex] = palette[sourceIndex];
  }
  return newPalette;
}

/**
 * Copies a row by returning the copiedRow index (no direct palette modification needed).
 */
export function copyRow(rowIndex: number) {
  return {
    copiedRow: rowIndex,
    copiedColumn: null,
  };
}

/**
 * Pastes a copied row into a target row.
 */
export function pasteRow(
  palette: string[],
  dimensions: Dimensions,
  sourceRow: number,
  targetRow: number
): string[] {
  const newPalette = [...palette];
  for (let col = 0; col < dimensions.width; col++) {
    const sourceIndex = sourceRow * dimensions.width + col;
    const targetIndex = targetRow * dimensions.width + col;
    newPalette[targetIndex] = palette[sourceIndex];
  }
  return newPalette;
}

/**
 * Removes a column and returns the new palette and width.
 */
export function removeColumn(
  palette: string[],
  dimensions: Dimensions,
  columnIndex: number
): { newPalette: string[]; newWidth: number } {
  const newPalette: string[] = [];
  const newWidth = dimensions.width - 1;

  for (let row = 0; row < dimensions.height; row++) {
    for (let col = 0; col < dimensions.width; col++) {
      if (col !== columnIndex) {
        const index = row * dimensions.width + col;
        newPalette.push(palette[index]);
      }
    }
  }

  return { newPalette, newWidth };
}

/**
 * Removes a row and returns the new palette (height will be handled by caller).
 */
export function removeRow(
  palette: string[],
  dimensions: Dimensions,
  rowIndex: number
): string[] {
  return palette.filter(
    (_, index) => Math.floor(index / dimensions.width) !== rowIndex
  );
} 

/**
 * Returns a new palette with selected cells "moved" from their old position
 * to a new position determined by offset.
 */
export function getMovedPalette(
  palette: string[],
  selectedCells: number[],
  dimensions: Dimensions,
  rowOffset: number,
  colOffset: number,
  lockedCells: number[]
): string[] {
  const newPalette = [...palette];

  // Clear original cells
  selectedCells.forEach(cellIndex => {
    newPalette[cellIndex] = "#ffffff";
  });

  // Place them in the new location
  selectedCells.forEach(cellIndex => {
    const cellRow = Math.floor(cellIndex / dimensions.width);
    const cellCol = cellIndex % dimensions.width;
    const newRow = cellRow + rowOffset;
    const newCol = cellCol + colOffset;

    if (
      newRow >= 0 &&
      newRow < dimensions.height &&
      newCol >= 0 &&
      newCol < dimensions.width
    ) {
      const targetIndex = newRow * dimensions.width + newCol;
      if (!lockedCells.includes(targetIndex)) {
        newPalette[targetIndex] = palette[cellIndex];
      }
    }
  });

  return newPalette;
} 