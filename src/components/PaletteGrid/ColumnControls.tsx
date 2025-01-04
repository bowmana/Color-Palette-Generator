import React from "react";

interface ColumnControlsProps {
  width: number;
  copiedColumn: number | null;
  onColumnHover: (columnIndex: number) => void;
  onHoverEnd: () => void;
  onColumnSelect: (columnIndex: number, event?: React.MouseEvent) => void;
}

export function ColumnControls({
  width,
  copiedColumn,
  onColumnHover,
  onHoverEnd,
  onColumnSelect,
}: ColumnControlsProps) {
  return (
    <div className="absolute -top-8 left-0 right-0 flex">
      {Array.from({ length: width }).map((_, columnIndex) => (
        <div
          key={`col-controls-${columnIndex}`}
          className="flex-1 flex justify-center"
          onMouseEnter={() => copiedColumn !== null && onColumnHover(columnIndex)}
          onMouseLeave={() => onHoverEnd()}
        >
          <button
            onClick={(e) => onColumnSelect(columnIndex, e)}
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
  );
} 