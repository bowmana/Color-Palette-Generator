import React, { useState } from "react";
import { Tool } from "../ColorPicker/ColorPicker";
import { AppState } from "../../app/page";

interface PaletteGridProps {
  dimensions: { width: number; height: number };
  selectedColor: string;
  selectedTool: Tool;
  palette: string[];
  onCellClick: (index: number) => void;
  onColumnClear?: (columnIndex: number) => void;
  onRowClear?: (rowIndex: number) => void;
  onColumnCopy?: (columnIndex: number) => void;
  onColumnPaste?: (columnIndex: number) => void;
  onRowCopy?: (rowIndex: number) => void;
  onRowPaste?: (rowIndex: number) => void;
  copiedColumn: number | null;
  copiedRow: number | null;
  onColumnRemove?: (columnIndex: number) => void;
  onRowRemove?: (rowIndex: number) => void;
  selectedCell: number | null;
  selectedCells: number[];
  onRowSelect: (rowIndex: number) => void;
  onColumnSelect: (columnIndex: number) => void;
  setPalette?: (newPalette: string[]) => void;
  setSelectedCell: (cell: number | null) => void;
  setSelectedCells: (cells: number[]) => void;
  onCopyCells?: (indices: number[]) => void;
  onPasteCells?: (targetIndex: number) => void;
  copiedCells?: { indices: number[], colors: string[] } | null;
  updateState: (updates: Partial<AppState>) => void;
  lockedCells: number[];
}

export function PaletteGrid({
  dimensions,
  selectedColor,
  selectedTool,
  palette,
  onCellClick,
  onColumnClear,
  onRowClear,
  onColumnCopy,
  onColumnPaste,
  onRowCopy,
  onRowPaste,
  copiedColumn,
  copiedRow,
  onColumnRemove,
  onRowRemove,
  selectedCell,
  selectedCells,
  onRowSelect,
  onColumnSelect,
  setPalette,
  setSelectedCell,
  setSelectedCells,
  onCopyCells,
  onPasteCells,
  copiedCells,
  updateState,
  lockedCells,
}: PaletteGridProps) {
  const [showColumnMenu, setShowColumnMenu] = useState<number | null>(null);
  const [showRowMenu, setShowRowMenu] = useState<number | null>(null);
  const [previewPalette, setPreviewPalette] = useState<string[] | null>(null);
  const [selectionStart, setSelectionStart] = useState<number | null>(null);
  const [isSelecting, setIsSelecting] = useState(false);
  const [ropePoints, setRopePoints] = useState<number[]>([]);
  const [tempSelectedCells, setTempSelectedCells] = useState<number[]>([]);
  const [tempLockedCells, setTempLockedCells] = useState<number[]>([]);

  const handleCellClick = (index: number, event?: React.MouseEvent) => {
    if (selectedTool === "rowselect") {
      const rowIndex = Math.floor(index / dimensions.width);
      handleRowSelect(rowIndex, event);
      return;
    }

    if (selectedTool === "columnselect") {
      const columnIndex = index % dimensions.width;
      handleColumnSelect(columnIndex, event);
      return;
    }

    if (selectedTool === "fillrow") {
      const rowIndex = Math.floor(index / dimensions.width);
      const newPalette = [...palette];
      for (let i = 0; i < dimensions.width; i++) {
        const targetIndex = rowIndex * dimensions.width + i;
        if (!lockedCells.includes(targetIndex)) {
          newPalette[targetIndex] = selectedColor;
        }
      }
      updateState({ palette: newPalette });
      return;
    }

    if (selectedTool === "fillcolumn") {
      const columnIndex = index % dimensions.width;
      const newPalette = [...palette];
      for (let i = 0; i < dimensions.height; i++) {
        const targetIndex = i * dimensions.width + columnIndex;
        if (!lockedCells.includes(targetIndex)) {
          newPalette[targetIndex] = selectedColor;
        }
      }
      updateState({ palette: newPalette });
      return;
    }

    if (selectedTool === "lock") {
      const newLockedCells = lockedCells.includes(index)
        ? lockedCells.filter(i => i !== index)
        : [...lockedCells, index];
      updateState({ lockedCells: newLockedCells });
      return;
    }

    if (selectedTool === "select") {
      if (selectedCell === index) {
        updateState({
          selectedCell: null,
          selectedCells: [],
        });
      } else {
        updateState({
          selectedCell: index,
          selectedCells: [index],
          selectedColor: palette[index]
        });
      }
      return;
    }

    if (copiedCells && (selectedTool === "multiselect" || selectedTool === "boxselect" || selectedTool === "ropeselect")) {
      onPasteCells?.(index);
      return;
    }
    
    onCellClick(index);
  };

  const handleColumnHover = (columnIndex: number) => {
    if (copiedColumn === null || columnIndex === copiedColumn) {
      setPreviewPalette(null);
      return;
    }

    // Create preview palette
    const newPalette = [...palette];
    for (let row = 0; row < dimensions.height; row++) {
      const sourceIndex = row * dimensions.width + copiedColumn;
      const targetIndex = row * dimensions.width + columnIndex;
      newPalette[targetIndex] = palette[sourceIndex];
    }
    setPreviewPalette(newPalette);
  };

  const handleRowHover = (rowIndex: number) => {
    if (copiedRow === null || rowIndex === copiedRow) {
      setPreviewPalette(null);
      return;
    }

    // Create preview palette
    const newPalette = [...palette];
    for (let col = 0; col < dimensions.width; col++) {
      const sourceIndex = copiedRow * dimensions.width + col;
      const targetIndex = rowIndex * dimensions.width + col;
      newPalette[targetIndex] = palette[sourceIndex];
    }
    setPreviewPalette(newPalette);
  };

  const handleHoverEnd = () => {
    setPreviewPalette(null);
  };

  const handleCellHover = (index: number) => {
    if (!copiedCells) {
      setPreviewPalette(null);
      return;
    }

    // Create preview palette
    const newPalette = [...palette];
    const { indices, colors } = copiedCells;
    
    // Calculate relative positions (same logic as in handlePasteCells)
    const startRow = Math.floor(indices[0] / dimensions.width);
    const startCol = indices[0] % dimensions.width;
    const targetRow = Math.floor(index / dimensions.width);
    const targetCol = index % dimensions.width;
    
    indices.forEach((sourceIndex, i) => {
      const relativeRow = Math.floor(sourceIndex / dimensions.width) - startRow;
      const relativeCol = (sourceIndex % dimensions.width) - startCol;
      
      const targetIndex = (targetRow + relativeRow) * dimensions.width + (targetCol + relativeCol);
      
      if (
        targetRow + relativeRow >= 0 &&
        targetRow + relativeRow < dimensions.height &&
        targetCol + relativeCol >= 0 &&
        targetCol + relativeCol < dimensions.width
      ) {
        newPalette[targetIndex] = colors[i];
      }
    });
    
    setPreviewPalette(newPalette);
  };

  // Helper functions to check if selected cells form a row or column
  const isSelectedRow = (cells: number[], width: number): number | null => {
    if (cells.length !== width) return null;
    const rowIndex = Math.floor(cells[0] / width);
    return cells.every(cell => Math.floor(cell / width) === rowIndex) ? rowIndex : null;
  };

  const isSelectedColumn = (cells: number[], width: number, height: number): number | null => {
    if (cells.length !== height) return null;
    const columnIndex = cells[0] % width;
    return cells.every(cell => cell % width === columnIndex) ? columnIndex : null;
  };

  const getCellsInBox = (start: number, end: number): number[] => {
    const startRow = Math.floor(start / dimensions.width);
    const startCol = start % dimensions.width;
    const endRow = Math.floor(end / dimensions.width);
    const endCol = end % dimensions.width;

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
  };

  const getCellsInRope = (points: number[]): number[] => {
    if (points.length < 2) return points;
    
    const cells = new Set<number>();
    for (let i = 1; i < points.length; i++) {
      const start = points[i - 1];
      const end = points[i];
      
      const startRow = Math.floor(start / dimensions.width);
      const startCol = start % dimensions.width;
      const endRow = Math.floor(end / dimensions.width);
      const endCol = end % dimensions.width;
      
      // Bresenham's line algorithm
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
  };

  const handleMouseDown = (index: number, event: React.MouseEvent) => {
    if (selectedTool === "boxselect") {
      setSelectionStart(index);
      setIsSelecting(true);
      if (!event.shiftKey) {
        updateState({ selectedCells: [] });
      }
      setTempSelectedCells([index]);
    } else if (selectedTool === "ropeselect") {
      setRopePoints([index]);
      if (!event.shiftKey) {
        updateState({ selectedCells: [] });
      }
      setTempSelectedCells([index]);
    } else if (selectedTool === "boxlock") {
      setSelectionStart(index);
      setIsSelecting(true);
      if (!event.shiftKey) {
        updateState({ lockedCells: [] });
      }
      setTempLockedCells([index]);
    } else if (selectedTool === "ropelock") {
      setRopePoints([index]);
      if (!event.shiftKey) {
        updateState({ lockedCells: [] });
      }
      setTempLockedCells([index]);
    }
  };

  const handleMouseMove = (index: number) => {
    if (selectedTool === "boxselect" && isSelecting && selectionStart !== null) {
      const newSelection = getCellsInBox(selectionStart, index);
      setTempSelectedCells(newSelection);
    } else if (selectedTool === "boxlock" && isSelecting && selectionStart !== null) {
      const cellsToLock = getCellsInBox(selectionStart, index);
      setTempLockedCells(cellsToLock);
    } else if (selectedTool === "ropeselect" && ropePoints.length > 0) {
      if (ropePoints[ropePoints.length - 1] !== index) {
        const newPoints = [...ropePoints, index];
        setRopePoints(newPoints);
        const newSelection = getCellsInRope(newPoints);
        setTempSelectedCells(newSelection);
      }
    } else if (selectedTool === "ropelock" && ropePoints.length > 0) {
      if (ropePoints[ropePoints.length - 1] !== index) {
        const newPoints = [...ropePoints, index];
        setRopePoints(newPoints);
        const cellsToLock = getCellsInRope(newPoints);
        setTempLockedCells(cellsToLock);
      }
    }
  };

  const handleMouseUp = (event: React.MouseEvent) => {
    if (selectedTool === "boxselect" && tempSelectedCells.length > 0) {
      const newSelection = event.shiftKey 
        ? [...new Set([...selectedCells, ...tempSelectedCells])]
        : tempSelectedCells;
      updateState({ selectedCells: newSelection });
    } else if (selectedTool === "ropeselect" && tempSelectedCells.length > 0) {
      const newSelection = event.shiftKey 
        ? [...new Set([...selectedCells, ...tempSelectedCells])]
        : tempSelectedCells;
      updateState({ selectedCells: newSelection });
    } else if (selectedTool === "boxlock" && tempLockedCells.length > 0) {
      const newLocked = event.shiftKey 
        ? [...new Set([...lockedCells, ...tempLockedCells])]
        : tempLockedCells;
      updateState({ lockedCells: newLocked });
    } else if (selectedTool === "ropelock" && tempLockedCells.length > 0) {
      const newLocked = event.shiftKey 
        ? [...new Set([...lockedCells, ...tempLockedCells])]
        : tempLockedCells;
      updateState({ lockedCells: newLocked });
    }
    setIsSelecting(false);
    setSelectionStart(null);
    setRopePoints([]);
    setTempSelectedCells([]);
    setTempLockedCells([]);
  };

  const handleRowSelect = (rowIndex: number, event?: React.MouseEvent) => {
    const rowCells = Array.from({ length: dimensions.width }, (_, i) => 
      rowIndex * dimensions.width + i
    );

    if (event?.shiftKey && selectedCells.length > 0) {
      const lastSelectedRow = Math.floor(selectedCells[selectedCells.length - 1] / dimensions.width);
      const startRow = Math.min(lastSelectedRow, rowIndex);
      const endRow = Math.max(lastSelectedRow, rowIndex);
      
      const newSelection = [];
      for (let row = startRow; row <= endRow; row++) {
        for (let col = 0; col < dimensions.width; col++) {
          newSelection.push(row * dimensions.width + col);
        }
      }
      
      updateState({ selectedCells: [...new Set([...selectedCells, ...newSelection])] });
    } else if (event?.ctrlKey || event?.metaKey) {
      // Check if row is already selected
      const isRowSelected = rowCells.every(cell => selectedCells.includes(cell));
      
      if (isRowSelected) {
        // Remove row from selection
        const newSelection = selectedCells.filter(cell => !rowCells.includes(cell));
        updateState({ selectedCells: newSelection });
      } else {
        // Add row to selection
        updateState({ selectedCells: [...selectedCells, ...rowCells] });
      }
    } else {
      updateState({ selectedCells: rowCells });
    }
  };

  const handleColumnSelect = (columnIndex: number, event?: React.MouseEvent) => {
    const columnCells = Array.from({ length: dimensions.height }, (_, i) => 
      i * dimensions.width + columnIndex
    );

    if (event?.shiftKey && selectedCells.length > 0) {
      const lastSelectedColumn = selectedCells[selectedCells.length - 1] % dimensions.width;
      const startCol = Math.min(lastSelectedColumn, columnIndex);
      const endCol = Math.max(lastSelectedColumn, columnIndex);
      
      const newSelection = [];
      for (let row = 0; row < dimensions.height; row++) {
        for (let col = startCol; col <= endCol; col++) {
          newSelection.push(row * dimensions.width + col);
        }
      }
      
      updateState({ selectedCells: [...new Set([...selectedCells, ...newSelection])] });
    } else if (event?.ctrlKey || event?.metaKey) {
      // Check if column is already selected
      const isColumnSelected = columnCells.every(cell => selectedCells.includes(cell));
      
      if (isColumnSelected) {
        // Remove column from selection
        const newSelection = selectedCells.filter(cell => !columnCells.includes(cell));
        updateState({ selectedCells: newSelection });
      } else {
        // Add column to selection
        updateState({ selectedCells: [...selectedCells, ...columnCells] });
      }
    } else {
      updateState({ selectedCells: columnCells });
    }
  };

  return (
    <div className="relative">
      {/* Selection Actions Bar */}
      {selectedCells.length > 0 && (
        <div className="absolute -top-16 left-0 right-0 bg-white p-3 rounded-lg border border-gray-200 shadow-sm flex items-center gap-4">
          <div className="text-sm text-gray-600">
            {selectedCells.length} cell{selectedCells.length > 1 ? 's' : ''} selected
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => {
                if (selectedCells.length === 0) return;
                
                // Always use the new copyCells system regardless of selection type
                onCopyCells?.(selectedCells);
              }}
              className="p-2 hover:bg-blue-50 text-blue-600 rounded-lg flex items-center gap-2 text-sm"
              title="Copy"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                />
              </svg>
              <span>Copy</span>
            </button>
            <button
              onClick={() => {
                // Clear selected cells
                const newPalette = [...palette];
                selectedCells.forEach(index => {
                  newPalette[index] = "#ffffff";
                });
                setPalette?.(newPalette);
              }}
              className="p-2 hover:bg-red-50 text-red-600 rounded-lg flex items-center gap-2 text-sm"
              title="Clear"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                />
              </svg>
              <span>Clear</span>
            </button>
            <button
              onClick={() => {
                setSelectedCells([]);
                setSelectedCell(null);
              }}
              className="p-2 hover:bg-gray-100 text-gray-600 rounded-lg flex items-center gap-2 text-sm"
              title="Clear selection"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
              <span>Clear Selection</span>
            </button>
          </div>
        </div>
      )}

      {/* Column Controls */}
      <div className="absolute -top-8 left-0 right-0 flex">
        {Array.from({ length: dimensions.width }).map((_, columnIndex) => (
          <div
            key={`col-controls-${columnIndex}`}
            className="flex-1 flex justify-center"
            onMouseEnter={() => copiedColumn !== null && handleColumnHover(columnIndex)}
            onMouseLeave={handleHoverEnd}
          >
            <button
              onClick={(e) => handleColumnSelect(columnIndex, e)}
              className="p-1 hover:bg-gray-100 rounded"
              title="Select Column"
            >
              <svg
                className="w-4 h-4 text-gray-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                />
              </svg>
            </button>
          </div>
        ))}
      </div>

      {/* Row Controls */}
      <div className="absolute -left-8 top-0 bottom-0">
        {Array.from({ length: dimensions.height }).map((_, rowIndex) => (
          <div
            key={`row-controls-${rowIndex}`}
            className="flex items-center h-8"
            onMouseEnter={() => copiedRow !== null && handleRowHover(rowIndex)}
            onMouseLeave={handleHoverEnd}
            style={{ height: '2rem' }}
          >
            <button
              onClick={(e) => handleRowSelect(rowIndex, e)}
              className="p-1 hover:bg-gray-100 rounded"
              title="Select Row"
            >
              <svg
                className="w-4 h-4 text-gray-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                />
              </svg>
            </button>
          </div>
        ))}
      </div>

      {/* Grid */}
      <div
        className="grid gap-0.5 border border-gray-200 p-0.5 rounded mt-1"
        style={{
          gridTemplateColumns: `repeat(${dimensions.width}, 2rem)`,
        }}
      >
        {(previewPalette || palette).map((color, index) => (
          <button
            key={index}
            onClick={(e) => handleCellClick(index, e)}
            onMouseDown={(e) => handleMouseDown(index, e)}
            onMouseEnter={() => {
              handleCellHover(index);
              handleMouseMove(index);
            }}
            onMouseUp={(e) => handleMouseUp(e)}
            onMouseLeave={handleHoverEnd}
            className={`aspect-square ${
              selectedTool === "paint"
                ? "hover:ring-2 hover:ring-blue-500"
                : copiedCells 
                  ? "hover:ring-2 hover:ring-green-500"
                  : "hover:ring-2 hover:ring-yellow-500"
            } ${
              (selectedCell === index || selectedCells.includes(index) || 
               (isSelecting && tempSelectedCells.includes(index)))
                ? "ring-2 ring-yellow-500" 
                : ""
            } ${
              previewPalette && previewPalette[index] !== palette[index]
                ? "opacity-70"
                : ""
            } ${
              (lockedCells.includes(index) || 
               ((selectedTool === "boxlock" || selectedTool === "ropelock") && 
                tempLockedCells.includes(index)))
                ? "opacity-50"
                : ""
            } focus:outline-none focus:ring-2 focus:ring-blue-500 relative group transition-colors duration-150`}
            style={{ backgroundColor: previewPalette ? previewPalette[index] : color }}
          >
            {(selectedTool === "select" || selectedTool === "multiselect") && color && (
              <span className="opacity-0 group-hover:opacity-100 absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 text-xs bg-gray-900 text-white rounded pointer-events-none whitespace-nowrap">
                {color}
              </span>
            )}
            {(lockedCells.includes(index) || 
              ((selectedTool === "boxlock" || selectedTool === "ropelock") && 
               tempLockedCells.includes(index))) && (
              <div className={`absolute inset-0 flex items-center justify-center bg-black ${
                tempLockedCells.includes(index) ? "bg-opacity-5" : "bg-opacity-10"
              }`}>
                <svg 
                  className={`w-3 h-3 ${
                    tempLockedCells.includes(index) ? "text-gray-500" : "text-gray-700"
                  }`}
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" 
                  />
                </svg>
              </div>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}
