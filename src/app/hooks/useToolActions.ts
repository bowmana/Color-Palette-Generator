import { CoreState, Tool } from "@/app/types";
import { copyRow } from "@/utils/paletteHelpers";
import { pasteRow } from "@/utils/paletteHelpers";
import { clearColumn } from "@/utils/paletteHelpers";
import { clearRow } from "@/utils/paletteHelpers";
import { copyColumn } from "@/utils/paletteHelpers";
import { pasteColumn } from "@/utils/paletteHelpers";

export function useToolActions(
  state: CoreState,
  updateState: (updates: Partial<CoreState>) => void
) {
  const { dimensions, palette, selectedColor, lockedCells, copiedRow, copiedColumn } = state;

  const handleToolSelect = (tool: Tool) => {
    updateState({ selectedTool: tool });
  };

  const handlePaintTool = (index: number) => {
    if (!lockedCells.includes(index)) {
      const newPalette = [...palette];
      newPalette[index] = selectedColor;
      updateState({ palette: newPalette });
    }
  };

  const handleFillRowTool = (index: number) => {
    const rowIndex = Math.floor(index / dimensions.width);
    const newPalette = [...palette];
    for (let col = 0; col < dimensions.width; col++) {
      const targetIndex = rowIndex * dimensions.width + col;
      if (!lockedCells.includes(targetIndex)) {
        newPalette[targetIndex] = selectedColor;
      }
    }
    updateState({ palette: newPalette });
  };

  const handleFillColumnTool = (index: number) => {
    const columnIndex = index % dimensions.width;
    const newPalette = [...palette];
    for (let row = 0; row < dimensions.height; row++) {
      const targetIndex = row * dimensions.width + columnIndex;
      if (!lockedCells.includes(targetIndex)) {
        newPalette[targetIndex] = selectedColor;
      }
    }
    updateState({ palette: newPalette });
  };

  const handleRowCopy = (rowIndex: number) => {
    const { copiedRow, copiedColumn } = copyRow(rowIndex);
    updateState({ copiedRow, copiedColumn });
  };

  const handleRowPaste = (rowIndex: number) => {
    if (copiedRow === null || copiedRow === rowIndex) return;
    const newPalette = pasteRow(palette, dimensions, copiedRow, rowIndex);
    updateState({ palette: newPalette, copiedRow: null });
  };

  // Column Actions
  const handleColumnClear = (columnIndex: number) => {
    const newPalette = clearColumn(palette, dimensions, columnIndex);
    updateState({ palette: newPalette });
  };
  // Row Actions
  const handleRowClear = (rowIndex: number) => {
    const newPalette = clearRow(palette, dimensions, rowIndex);
    updateState({ palette: newPalette });
  };
  const handleColumnCopy = (columnIndex: number) => {
    const { copiedColumn, copiedRow } = copyColumn(columnIndex);
    updateState({ copiedColumn, copiedRow });
  };

  const handleColumnPaste = (columnIndex: number) => {
    if (copiedColumn === null || copiedColumn === columnIndex) return;
    const newPalette = pasteColumn(palette, dimensions, copiedColumn, columnIndex);
    updateState({ palette: newPalette, copiedColumn: null });
  };

  return {
    handleToolSelect,
    handlePaintTool,
    handleFillRowTool,
    handleFillColumnTool,
    handleRowCopy,
    handleRowPaste,
    handleColumnClear,
    handleRowClear,
    handleColumnCopy,
    handleColumnPaste
  };
}
