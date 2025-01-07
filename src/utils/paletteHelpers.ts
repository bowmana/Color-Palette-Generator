import { Dimensions } from "@/app/types";

/**
 * Clears a specified column by setting each cell to "#ffffff".
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
 * Clears a specified row by setting each cell to "#ffffff".
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
 * Copies a column by returning the copiedColumn index (no direct palette modification needed).
 */
export function copyColumn(columnIndex: number) {
  return {
    copiedColumn: columnIndex,
    copiedRow: null,
  };
}

/**
 * Pastes a copied column into a target column.
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