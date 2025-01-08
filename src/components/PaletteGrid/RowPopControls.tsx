import React from "react";
import { RowPopControlsProps } from "@/app/types";

/**
 * RowPopControls
 * - Renders a horizontal row of buttons along the bottom of the grid.
 * - Each button, when clicked, "pops" the given row (removes it entirely).
 */
export function RowPopControls({
  height,
  onRowPop,
}: RowPopControlsProps) {
  return (
    <div className="absolute -right-8 top-0 bottom-0">
      {Array.from({ length: height }).map((_, rowIndex) => (
        <div
          key={`row-pop-${rowIndex}`}
          className="flex items-center h-8"
          style={{ height: "2rem" }}
        >
          <button
            onClick={() => onRowPop(rowIndex)}
            className="p-1 hover:bg-red-100 rounded"
            title="Remove Row"
          >
            <svg
              className="w-4 h-4 text-red-500"
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
          </button>
        </div>
      ))}
    </div>
  );
} 