import React, { useState } from "react";
import { Tool } from "../ColorPicker/ColorPicker";

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
}: PaletteGridProps) {
  const [showColumnMenu, setShowColumnMenu] = useState<number | null>(null);
  const [showRowMenu, setShowRowMenu] = useState<number | null>(null);
  const [previewPalette, setPreviewPalette] = useState<string[] | null>(null);

  const handleCellClick = (index: number) => {
    // Always call onCellClick regardless of tool
    onCellClick(index);
    
    if (selectedTool === "select") {
      console.log('Selected cell:', index);
      // Tooltip handling can stay here if needed
    }
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
                
                // Check if selection forms a row or column first
                const rowIndex = isSelectedRow(selectedCells, dimensions.width);
                if (rowIndex !== null) {
                  onRowCopy?.(rowIndex);
                  return;
                }

                const columnIndex = isSelectedColumn(selectedCells, dimensions.width, dimensions.height);
                if (columnIndex !== null) {
                  onColumnCopy?.(columnIndex);
                  return;
                }

                // If not a row or column, copy selected cells
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
            {(copiedRow !== null || copiedColumn !== null || copiedCells !== null) && (
              <button
                onClick={() => {
                  if (selectedCells.length === 0) return;
                  
                  const rowIndex = isSelectedRow(selectedCells, dimensions.width);
                  if (rowIndex !== null && copiedRow !== null) {
                    onRowPaste?.(rowIndex);
                    return;
                  }

                  const columnIndex = isSelectedColumn(selectedCells, dimensions.width, dimensions.height);
                  if (columnIndex !== null && copiedColumn !== null) {
                    onColumnPaste?.(columnIndex);
                    return;
                  }

                  // If not pasting to a row or column, paste to first selected cell
                  onPasteCells?.(selectedCells[0]);
                }}
                className="p-2 hover:bg-green-50 text-green-600 rounded-lg flex items-center gap-2 text-sm"
                title="Paste"
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
                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                  />
                </svg>
                <span>Paste</span>
              </button>
            )}
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
              onClick={() => onColumnSelect?.(columnIndex)}
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
              onClick={() => onRowSelect?.(rowIndex)}
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
            onClick={() => handleCellClick(index)}
            className={`aspect-square ${
              selectedTool === "paint"
                ? "hover:ring-2 hover:ring-blue-500"
                : "hover:ring-2 hover:ring-yellow-500"
            } ${
              selectedCell === index || selectedCells.includes(index) 
                ? "ring-2 ring-yellow-500" 
                : ""
            } ${
              previewPalette && color !== palette[index]
                ? "opacity-70" // Add slight transparency to preview
                : ""
            } focus:outline-none focus:ring-2 focus:ring-blue-500 relative group transition-colors duration-150`}
            style={{ backgroundColor: color }}
          >
            {(selectedTool === "select" || selectedTool === "multiselect") && color && (
              <span className="opacity-0 group-hover:opacity-100 absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 text-xs bg-gray-900 text-white rounded pointer-events-none whitespace-nowrap">
                {color}
              </span>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}
