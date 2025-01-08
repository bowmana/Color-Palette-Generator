import { AppState } from "@/app/types";
import { useGridTransform } from "./useGridTransform";
import { useRowColumnActions } from "./useRowColumnActions";
import { useSelectionActions } from "./useSelectionActions";

export function usePaletteGridState(
  state: AppState,
  updateState: (updates: Partial<AppState>) => void
) {
  const gridTransform = useGridTransform(state, updateState);
  const rowColumnActions = useRowColumnActions(state, updateState);
  const selectionActions = useSelectionActions(state, updateState);

  return {
    ...gridTransform,
    ...rowColumnActions,
    ...selectionActions,
  };
} 