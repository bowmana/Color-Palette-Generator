import { CoreState } from "@/app/types";
import { getCellsInBox, getCellsInRope } from "@/utils/selectionHelpers";

export function useLockActions(
  state: CoreState,
  updateState: (updates: Partial<CoreState>) => void,
  setters: {
    setTempLockedCells: (cells: number[]) => void;
    setIsLocking: (locking: boolean) => void;
    setLockStart: (index: number | null) => void;
    setLockRopePoints: (points: number[]) => void;
    setPreviewPalette: (palette: string[] | null) => void;
  }
) {
  const { dimensions, lockedCells, palette } = state;

  const handleBoxLock = (startIndex: number, currentIndex: number) => {
    const cellsInBox = getCellsInBox(startIndex, currentIndex, dimensions);
    setters.setTempLockedCells(cellsInBox);
    
    // Create preview palette
    const newPalette = [...palette];
    cellsInBox.forEach(index => {
      newPalette[index] = palette[index];  // Keep same color but with opacity
    });
    setters.setPreviewPalette(newPalette);
  };

  const handleRopeLock = (points: number[]) => {
    const cellsInRope = getCellsInRope(points, dimensions);
    setters.setTempLockedCells(cellsInRope);
    
    // Create preview palette
    const newPalette = [...palette];
    cellsInRope.forEach(index => {
      newPalette[index] = palette[index];  // Keep same color but with opacity
    });
    setters.setPreviewPalette(newPalette);
  };

  const handleLockStateUpdate = (
    tempLockedCells: number[],
    shiftKey: boolean
  ) => {
    const newLockedCells = shiftKey 
      ? [...new Set([...lockedCells, ...tempLockedCells])]
      : [...new Set([...lockedCells, ...tempLockedCells])];
    
    updateState({ lockedCells: newLockedCells });
    
    // Clear states
    setters.setTempLockedCells([]);
    setters.setIsLocking(false);
    setters.setLockStart(null);
    setters.setLockRopePoints([]);
    setters.setPreviewPalette(null);
  };

  const handleMouseDown = (index: number, event: React.MouseEvent) => {
    if (state.selectedTool === "boxlock" || state.selectedTool === "ropelock") {
      setters.setIsLocking(true);
      setters.setLockStart(index);
      setters.setLockRopePoints([index]);
    }
  };

  const handleMouseMovement = (
    index: number,
    isLocking: boolean,
    lockStart: number | null,
    lockRopePoints: number[]
  ) => {
    if (state.selectedTool === "boxlock" && isLocking && lockStart !== null) {
      handleBoxLock(lockStart, index);
    } else if (state.selectedTool === "ropelock" && lockRopePoints.length > 0) {
      handleRopeLock([...lockRopePoints, index]);
    }
  };

  const handleCellLock = (index: number, shiftKey: boolean) => {
    let newLockedCells: number[];
    if (lockedCells.includes(index)) {
      // Unlock the cell(s)
      if (shiftKey) {
        // Only remove this cell while keeping others locked
        newLockedCells = lockedCells.filter(i => i !== index);
      } else {
        // Clear all locks
        newLockedCells = [];
      }
    } else {
      // Lock the cell(s)
      newLockedCells = shiftKey 
        ? [...lockedCells, index]  // Add to existing locks
        : [index];                 // Replace all locks with just this one
    }
    updateState({ lockedCells: newLockedCells });
  };

  return {
    handleCellLock,
    handleBoxLock,
    handleRopeLock,
    handleLockStateUpdate,
    handleMouseDown,
    handleMouseMovement
  };
} 