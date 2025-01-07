import React from "react";
import { Dimensions } from "@/app/types";

/**
 * Updates the palette to show a preview when hovering over a cell with copied cells.
 */
export function previewCopiedCells(
  index: number,
  copiedCells: { indices: number[]; colors: string[] } | null,
  palette: string[],
  dimensions: Dimensions,
  setPreviewPalette: React.Dispatch<React.SetStateAction<string[] | null>>
) {
  if (!copiedCells) {
    setPreviewPalette(null);
    return;
  }

  const { indices, colors } = copiedCells;
  const newPalette = [...palette];

  const startRow = Math.floor(indices[0] / dimensions.width);
  const startCol = indices[0] % dimensions.width;
  const targetRow = Math.floor(index / dimensions.width);
  const targetCol = index % dimensions.width;

  indices.forEach((sourceIndex, i) => {
    const relativeRow = Math.floor(sourceIndex / dimensions.width) - startRow;
    const relativeCol = (sourceIndex % dimensions.width) - startCol;
    const targetIndex =
      (targetRow + relativeRow) * dimensions.width + (targetCol + relativeCol);

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
}

/**
 * Invokes the onCellClick callback with the specified index.
 */
export function invokeCellClick(
  index: number,
  event: React.MouseEvent,
  onCellClick: (index: number) => void
) {
  onCellClick(index);
} 