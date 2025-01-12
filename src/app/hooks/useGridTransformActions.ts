import { CoreState, Direction, Dimensions } from "@/app/types";
import { reshapeGrid, popGridSection } from "@/utils/gridHelpers";
import { removeColumn } from "@/utils/paletteHelpers";
import { removeRow } from "@/utils/paletteHelpers";

export function useGridTransformActions(
  state: CoreState,
  updateState: (updates: Partial<CoreState>) => void
) {
  const { dimensions, palette } = state;

  const handleGridResize = (newDimensions: Dimensions) => {
    const newPalette = reshapeGrid(palette, dimensions, newDimensions);
    updateState({
      dimensions: newDimensions,
      palette: newPalette,
    });
  };

  const handleGridPop = (direction: Direction) => {
    const { newColors, newDimensions } = popGridSection(
      palette,
      dimensions,
      direction
    );
    updateState({
      dimensions: newDimensions,
      palette: newColors,
    });
  };

  const handleColumnRemove = (columnIndex: number) => {
    const { newPalette, newWidth } = removeColumn(palette, dimensions, columnIndex);
    updateState({
      dimensions: { ...dimensions, width: newWidth },
      palette: newPalette,
    });
  };

  const handleRowRemove = (rowIndex: number) => {
    const newPalette = removeRow(palette, dimensions, rowIndex);
    updateState({
      dimensions: { ...dimensions, height: dimensions.height - 1 },
      palette: newPalette,
    });
  };

  return {
    handleGridResize,
    handleGridPop,
    handleColumnRemove,
    handleRowRemove
  };
} 