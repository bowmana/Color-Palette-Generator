import { Dimensions } from "@/app/types";

export function getRowCells(rowIndex: number, dimensions: Dimensions): number[] {
  return Array.from(
    { length: dimensions.width }, 
    (_, i) => rowIndex * dimensions.width + i
  );
}

export function getColumnCells(columnIndex: number, dimensions: Dimensions): number[] {
  return Array.from(
    { length: dimensions.height }, 
    (_, i) => i * dimensions.width + columnIndex
  );
}

export function getCellsInBox(
  startIndex: number,
  currentIndex: number,
  dimensions: Dimensions
): number[] {
  const startRow = Math.floor(startIndex / dimensions.width);
  const startCol = startIndex % dimensions.width;
  const currentRow = Math.floor(currentIndex / dimensions.width);
  const currentCol = currentIndex % dimensions.width;

  const minRow = Math.min(startRow, currentRow);
  const maxRow = Math.max(startRow, currentRow);
  const minCol = Math.min(startCol, currentCol);
  const maxCol = Math.max(startCol, currentCol);

  const selectedCells: number[] = [];
  for (let row = minRow; row <= maxRow; row++) {
    for (let col = minCol; col <= maxCol; col++) {
      selectedCells.push(row * dimensions.width + col);
    }
  }

  return selectedCells;
}

export function getCellsInRope(
  points: number[],
  dimensions: Dimensions
): number[] {
  if (points.length < 2) return points;

  const selectedCells = new Set<number>();
  
  for (let i = 0; i < points.length - 1; i++) {
    const start = points[i];
    const end = points[i + 1];
    
    const startRow = Math.floor(start / dimensions.width);
    const startCol = start % dimensions.width;
    const endRow = Math.floor(end / dimensions.width);
    const endCol = end % dimensions.width;
    
    // Bresenham's line algorithm
    const dx = Math.abs(endCol - startCol);
    const dy = Math.abs(endRow - startRow);
    const sx = startCol < endCol ? 1 : -1;
    const sy = startRow < endRow ? 1 : -1;
    let err = dx - dy;
    
    let x = startCol;
    let y = startRow;
    
    while (true) {
      selectedCells.add(y * dimensions.width + x);
      
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
  
  return Array.from(selectedCells);
}

export function selectRow(
  rowIndex: number,
  dimensions: Dimensions,
  selectedCells: number[],
  event?: React.MouseEvent
): number[] {
  const rowCells = getRowCells(rowIndex, dimensions);

  if (event?.shiftKey && selectedCells.length > 0) {
    const lastSelectedRow = Math.floor(selectedCells[selectedCells.length - 1] / dimensions.width);
    const startRow = Math.min(lastSelectedRow, rowIndex);
    const endRow = Math.max(lastSelectedRow, rowIndex);
    
    const newSelection = [];
    for (let row = startRow; row <= endRow; row++) {
      newSelection.push(...getRowCells(row, dimensions));
    }
    
    return [...new Set([...selectedCells, ...newSelection])];
  } 
  
  if (event?.ctrlKey || event?.metaKey) {
    const isRowSelected = rowCells.every(cell => selectedCells.includes(cell));
    return isRowSelected
      ? selectedCells.filter(cell => !rowCells.includes(cell))
      : [...selectedCells, ...rowCells];
  }
  
  return rowCells;
}

export function selectColumn(
  columnIndex: number,
  dimensions: Dimensions,
  selectedCells: number[],
  event?: React.MouseEvent
): number[] {
  const columnCells = getColumnCells(columnIndex, dimensions);

  if (event?.shiftKey && selectedCells.length > 0) {
    const lastSelectedColumn = selectedCells[selectedCells.length - 1] % dimensions.width;
    const startCol = Math.min(lastSelectedColumn, columnIndex);
    const endCol = Math.max(lastSelectedColumn, columnIndex);
    
    const newSelection = [];
    for (let col = startCol; col <= endCol; col++) {
      newSelection.push(...getColumnCells(col, dimensions));
    }
    
    return [...new Set([...selectedCells, ...newSelection])];
  }
  
  if (event?.ctrlKey || event?.metaKey) {
    const isColumnSelected = columnCells.every(cell => selectedCells.includes(cell));
    return isColumnSelected
      ? selectedCells.filter(cell => !columnCells.includes(cell))
      : [...selectedCells, ...columnCells];
  }
  
  return columnCells;
} 