import { AppState } from "@/app/types";
import { useGridTransform } from "./useGridTransform";
import { useRowColumnActions } from "./useRowColumnActions";
import { useSelectionActions } from "./useSelectionActions";

export function usePaletteGridState(
  state: AppState,
  updateState: (updates: Partial<AppState>) => void,
  setters: {
    setPreviewPalette: (palette: string[] | null) => void;
    setTempSelectedCells: (cells: number[]) => void;
    setIsSelecting: (selecting: boolean) => void;
    setSelectionStart: (index: number | null) => void;
    setRopePoints: (points: number[]) => void;
  }
) {
  const gridTransform = useGridTransform(state, updateState);
  const rowColumnActions = useRowColumnActions(state, updateState);
  const selectionActions = useSelectionActions(state, updateState, setters);

  const handleCellUpdate = (index: number, color: string) => {
    const newPalette = [...state.palette];
    newPalette[index] = color;
    updateState({ palette: newPalette });
  };

  const handleCopyPalette = (newPalette: string[]) => {
    updateState({ palette: newPalette });
  };

  return {
    ...gridTransform,
    ...rowColumnActions,
    ...selectionActions,
    handleCellUpdate,
    handleCopyPalette
  };
} 