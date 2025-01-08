import { AppState } from "@/app/types";
import {
  clearColumn,
  clearRow,
  copyColumn,
  pasteColumn,
  copyRow,
  pasteRow,
  removeColumn,
  removeRow
} from "@/utils/paletteHelpers";

export function useRowColumnActions(
  state: AppState,
  updateState: (updates: Partial<AppState>) => void
) {
  const { dimensions, palette, copiedColumn, copiedRow } = state;

  // Column Actions
  const handleColumnClear = (columnIndex: number) => {
    const newPalette = clearColumn(palette, dimensions, columnIndex);
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

  const handleColumnRemove = (columnIndex: number) => {
    const { newPalette, newWidth } = removeColumn(palette, dimensions, columnIndex);
    updateState({
      dimensions: { ...dimensions, width: newWidth },
      palette: newPalette,
    });
  };

  // Row Actions
  const handleRowClear = (rowIndex: number) => {
    const newPalette = clearRow(palette, dimensions, rowIndex);
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

  const handleRowRemove = (rowIndex: number) => {
    const newPalette = removeRow(palette, dimensions, rowIndex);
    updateState({
      dimensions: { ...dimensions, height: dimensions.height - 1 },
      palette: newPalette,
    });
  };

  return {
    handleColumnClear,
    handleColumnCopy,
    handleColumnPaste,
    handleColumnRemove,
    handleRowClear,
    handleRowCopy,
    handleRowPaste,
    handleRowRemove,
  };
} 