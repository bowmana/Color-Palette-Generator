import { Dimensions } from "@/app/types";

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