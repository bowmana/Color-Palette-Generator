import { AppState, Direction, Dimensions } from "@/app/types";
import { reshapeGrid, popGridSection } from "@/utils/gridHelpers";

export function useGridTransform(
  state: AppState,
  updateState: (updates: Partial<AppState>) => void
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

  return {
    handleGridResize,
    handleGridPop,
  };
} 