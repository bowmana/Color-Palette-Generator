import { AppState, Direction, Dimensions } from "@/app/types";
import {
  reshapeGrid,
  popGridSection,
} from "@/components/GridControls/GridOperations";

export function useGridHandlers(
  state: AppState,
  updateState: (updates: Partial<AppState>) => void
) {
  const { palette, dimensions, lockedCells, selectedCells } = state;

  const handleDimensionsChange = (newDimensions: Dimensions) => {
    const newPalette = reshapeGrid(palette, dimensions, newDimensions);
    updateState({
      dimensions: newDimensions,
      palette: newPalette,
    });
  };

  const handlePop = (direction: Direction) => {
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

  // ... other handlers

  return {
    handleDimensionsChange,
    handlePop,
    // ... other handlers
  };
} 