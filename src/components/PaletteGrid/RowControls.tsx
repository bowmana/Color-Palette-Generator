import React from "react";

interface RowControlsProps {
  height: number;
  copiedRow: number | null;
  onRowHover: (rowIndex: number) => void;
  onHoverEnd: () => void;
  onRowSelect: (rowIndex: number, event?: React.MouseEvent) => void;
}

export function RowControls({
  height,
  copiedRow,
  onRowHover,
  onHoverEnd,
  onRowSelect,
}: RowControlsProps) {
  return (
    <div className="absolute -left-8 top-0 bottom-0">
      {Array.from({ length: height }).map((_, rowIndex) => (
        <div
          key={`row-controls-${rowIndex}`}
          className="flex items-center h-8"
          onMouseEnter={() => copiedRow !== null && onRowHover(rowIndex)}
          onMouseLeave={() => onHoverEnd()}
          style={{ height: "2rem" }}
        >
          <button
            onClick={(e) => onRowSelect(rowIndex, e)}
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
  );
} 