import { Dimensions, Tool } from "@/app/types";

/**
 * Returns all cell indices within a rectangular box defined by start and end.
 */
export function getCellsInBox(
  startIndex: number,
  endIndex: number,
  dimensions: Dimensions
): number[] {
  const startRow = Math.floor(startIndex / dimensions.width);
  const startCol = startIndex % dimensions.width;
  const endRow = Math.floor(endIndex / dimensions.width);
  const endCol = endIndex % dimensions.width;

  const minRow = Math.min(startRow, endRow);
  const maxRow = Math.max(startRow, endRow);
  const minCol = Math.min(startCol, endCol);
  const maxCol = Math.max(startCol, endCol);

  const cells: number[] = [];
  for (let row = minRow; row <= maxRow; row++) {
    for (let col = minCol; col <= maxCol; col++) {
      cells.push(row * dimensions.width + col);
    }
  }
  return cells;
}

/**
 * Returns all cell indices along a "rope" path of points.
 * This uses Bresenham’s line algorithm for each consecutive pair of points.
 */
export function getCellsInRope(points: number[], dimensions: Dimensions): number[] {
  if (points.length < 2) return points;

  const cells = new Set<number>();

  for (let i = 1; i < points.length; i++) {
    const start = points[i - 1];
    const end = points[i];

    const startRow = Math.floor(start / dimensions.width);
    const startCol = start % dimensions.width;
    const endRow = Math.floor(end / dimensions.width);
    const endCol = end % dimensions.width;

    let x = startCol;
    let y = startRow;
    const dx = Math.abs(endCol - startCol);
    const dy = Math.abs(endRow - startRow);
    const sx = startCol < endCol ? 1 : -1;
    const sy = startRow < endRow ? 1 : -1;
    let err = dx - dy;

    while (true) {
      cells.add(y * dimensions.width + x);
      if (x === endCol && y === endRow) break;
      const e2 = 2 * err;
      if (e2 > -dy) {
        err -= dy;
        x += sx;
      }
      if (e2 < dx) {
        err += dx;
        y += sy;
      }
    }
  }

  return Array.from(cells);
}

export function handleRowSelect(
  rowIndex: number,
  dimensions: Dimensions
): {
  selectedTool: Tool;
  selectedCells: number[];
  selectedCell: null;
} {
  const rowCells = Array.from(
    { length: dimensions.width },
    (_, colIndex) => rowIndex * dimensions.width + colIndex
  );
  
  return {
    selectedTool: "multiselect",
    selectedCells: rowCells,
    selectedCell: null,
  };
}

export function handleColumnSelect(
  columnIndex: number,
  dimensions: Dimensions
): {
  selectedTool: Tool;
  selectedCells: number[];
  selectedCell: null;
} {
  const columnCells = Array.from(
    { length: dimensions.height },
    (_, rowIndex) => rowIndex * dimensions.width + columnIndex
  );
  
  return {
    selectedTool: "multiselect",
    selectedCells: columnCells,
    selectedCell: null,
  };
} 