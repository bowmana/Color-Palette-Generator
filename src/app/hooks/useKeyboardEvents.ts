import { useEffect } from 'react';
import { CoreState } from '@/app/types';

export function useKeyboardEvents(
  state: CoreState,
  updateState: (updates: Partial<CoreState>) => void,
  setPreviewPalette: (palette: string[] | null) => void,
  setRotationPreview: (palette: string[] | null) => void,
) {
  const { copiedCells, selectedTool } = state;

  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        if (copiedCells) {
          updateState({ copiedCells: null });
          setPreviewPalette(null);
        }
        if (selectedTool === "rotateLeft90" || selectedTool === "rotateRight90") {
          setRotationPreview(null);
          updateState({ selectedTool: undefined });
        }
      }
    };

    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [copiedCells, selectedTool, updateState]);
}
