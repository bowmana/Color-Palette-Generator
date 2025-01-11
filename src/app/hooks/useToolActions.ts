import { AppState, Tool } from "@/app/types";

export function useToolActions(
  state: AppState,
  handlers: {
    handleCellUpdate: (index: number, color: string) => void;
    handleCopyPalette: (newPalette: string[]) => void;
  },
  updateState: (updates: Partial<AppState>) => void
) {
  const { dimensions, palette, selectedColor, lockedCells } = state;

  const handleToolSelect = (tool: Tool) => {
    updateState({ selectedTool: tool });
  };

  const handlePaintTool = (index: number) => {
    if (!lockedCells.includes(index)) {
      handlers.handleCellUpdate(index, selectedColor);
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
    handlers.handleCopyPalette(newPalette);
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
    handlers.handleCopyPalette(newPalette);
  };

  return {
    handleToolSelect,
    handlePaintTool,
    handleFillRowTool,
    handleFillColumnTool
  };
}
