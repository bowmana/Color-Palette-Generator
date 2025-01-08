import React from "react";
import { ColumnPopControlsProps } from "@/app/types";

/**
 * ColumnPopControls
 * - Renders a vertical stack of buttons on the right side of the grid.
 * - Each button corresponds to a single row, but "pops" the entire column at that row index.
 *   (In other words, we remove the column that lines up horizontally with that row.)
 * - If you'd rather pop the column by column index, you can switch the iteration logic below.
 */
export function ColumnPopControls({
  width,
  onColumnPop,
}: ColumnPopControlsProps) {
  return (
    <div className="absolute -right-8 top-0 bottom-0">
      {Array.from({ length: width }).map((_, columnIndex) => (
        <div
          key={`col-pop-${columnIndex}`}
          className="flex items-center h-8"
          style={{ height: "2rem" }}
        >
          <button
            onClick={() => onColumnPop(columnIndex)}
            className="p-1 hover:bg-red-100 rounded"
            title="Remove Column"
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