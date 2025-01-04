import React from "react";

interface GridCellsProps {
  dimensions: { width: number; height: number };
  palette: string[];
  previewPalette?: string[] | null;
  rotationPreview?: string[] | null;
  lockedCells: number[];
  selectedTool: string | null;
  selectedCell: number | null;
  selectedCells: number[];
  tempSelectedCells: number[];
  tempLockedCells: number[];
  handleCellClick: (index: number, e: React.MouseEvent) => void;
  handleMouseDown: (index: number, e: React.MouseEvent) => void;
  handleMouseMove: (index: number) => void;
  handleMouseUp: (e: React.MouseEvent) => void;
  handleCellHover: (index: number) => void;
  handleHoverEnd: () => void;
  isSelecting: boolean;
}

export function GridCells({
  dimensions,
  palette,
  previewPalette,
  rotationPreview,
  lockedCells,
  selectedTool,
  selectedCell,
  selectedCells,
  tempSelectedCells,
  tempLockedCells,
  handleCellClick,
  handleMouseDown,
  handleMouseMove,
  handleMouseUp,
  handleCellHover,
  handleHoverEnd,
  isSelecting
}: GridCellsProps) {
  const effectivePalette = rotationPreview || previewPalette || palette;

  return (
    <div
      className="grid gap-0.5 border border-gray-200 p-0.5 rounded mt-1"
      style={{
        gridTemplateColumns: `repeat(${dimensions.width}, 2rem)`,
      }}
      onContextMenu={(e) => e.preventDefault()}
    >
      {effectivePalette.map((color, index) => {
        const isLocked =
          lockedCells.includes(index) ||
          ((selectedTool === "boxlock" || selectedTool === "ropelock") &&
            tempLockedCells.includes(index));
        const isSelected =
          selectedCell === index ||
          selectedCells.includes(index) ||
          (isSelecting && tempSelectedCells.includes(index));

        let ringClass = "";
        if (selectedTool === "paint") {
          ringClass = "hover:ring-2 hover:ring-blue-500";
        } else if (selectedTool && selectedTool !== "rotateLeft90" && selectedTool !== "rotateRight90") {
          ringClass = "hover:ring-2 hover:ring-green-500";
        } else {
          ringClass = "hover:ring-2 hover:ring-yellow-500";
        }

        return (
          <button
            key={index}
            onClick={(e) => handleCellClick(index, e)}
            onMouseDown={(e) => handleMouseDown(index, e)}
            onMouseEnter={() => {
              if (selectedTool === "move") {
                handleMouseMove(index);
              } else {
                handleCellHover(index);
              }
            }}
            onMouseUp={(e) => handleMouseUp(e)}
            onMouseLeave={handleHoverEnd}
            className={`aspect-square ${ringClass} ${
              isSelected ? "ring-2 ring-yellow-500" : ""
            } ${
              previewPalette && previewPalette[index] !== palette[index]
                ? "opacity-70"
                : ""
            } ${isLocked ? "opacity-50" : ""}
              focus:outline-none focus:ring-2 focus:ring-blue-500 relative group transition-colors duration-150`}
            style={{ backgroundColor: effectivePalette[index] }}
          >
            {/* e.g. show color on hover, lock icon, etc. */}
          </button>
        );
      })}
    </div>
  );
} 