import React from "react";

interface SelectionActionsBarProps {
  selectedCellsCount: number;
  onCopy: () => void;
  onClearCells: () => void;
  onClearSelection: () => void;
}

export function SelectionActionsBar({
  selectedCellsCount,
  onCopy,
  onClearCells,
  onClearSelection,
}: SelectionActionsBarProps) {
  if (selectedCellsCount === 0) {
    return null;
  }

  return (
    <div className="absolute -top-16 left-0 right-0 bg-white p-3 rounded-lg border border-gray-200 shadow-sm flex items-center gap-4">
      <div className="text-sm text-gray-600">
        {selectedCellsCount} cell{selectedCellsCount > 1 ? "s" : ""} selected
      </div>
      <div className="flex gap-2">
        <button
          onClick={onCopy}
          className="p-2 hover:bg-blue-50 text-blue-600 rounded-lg flex items-center gap-2 text-sm"
          title="Copy"
        >
          {/* SVG icon here */}
          <span>Copy</span>
        </button>
        <button
          onClick={onClearCells}
          className="p-2 hover:bg-red-50 text-red-600 rounded-lg flex items-center gap-2 text-sm"
          title="Clear"
        >
          {/* SVG icon here */}
          <span>Clear</span>
        </button>
        <button
          onClick={onClearSelection}
          className="p-2 hover:bg-gray-100 text-gray-600 rounded-lg flex items-center gap-2 text-sm"
          title="Clear selection"
        >
          {/* SVG icon here */}
          <span>Clear Selection</span>
        </button>
      </div>
    </div>
  );
} 