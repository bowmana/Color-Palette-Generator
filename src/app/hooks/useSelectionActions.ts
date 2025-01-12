import { CoreState } from "@/app/types";
import { getCellsInBox, getCellsInRope, selectRow, selectColumn } from "@/utils/selectionHelpers";

export function useSelectionActions(
  state: CoreState,
  updateState: (updates: Partial<CoreState>) => void,
  setters: {
    setPreviewPalette: (palette: string[] | null) => void;
    setTempSelectedCells: (cells: number[]) => void;
    setIsSelecting: (selecting: boolean) => void;
    setSelectionStart: (index: number | null) => void;
    setRopePoints: (points: number[]) => void;
  }
) {
  const { palette, selectedCells, dimensions, lockedCells, selectedColor } = state;

  // Basic Selection
  const handleCellSelect = (index: number, shiftKey: boolean) => {
    const newSelection = shiftKey 
      ? [...new Set([...selectedCells, index])]
      : [index];
    updateState({ 
      selectedCell: index,
      selectedCells: newSelection 
    });
  };

  const handleRowSelect = (rowIndex: number, event?: React.MouseEvent) => {
    const newSelection = selectRow(rowIndex, dimensions, selectedCells, event);
    updateState({ selectedCells: newSelection });
  };

  const handleColumnSelect = (columnIndex: number, event?: React.MouseEvent) => {
    const newSelection = selectColumn(columnIndex, dimensions, selectedCells, event);
    updateState({ selectedCells: newSelection });
  };
  // Box/Rope Selection
  const handleBoxSelect = (startIndex: number, currentIndex: number) => {
    const selectedCells = getCellsInBox(startIndex, currentIndex, dimensions);
    setters.setTempSelectedCells(selectedCells);
    
    // Create preview palette
    const newPalette = [...palette];
    selectedCells.forEach(index => {
      if (!lockedCells.includes(index)) {
        newPalette[index] = selectedColor || '#ffffff';
      }
    });
    setters.setPreviewPalette(newPalette);
  };

  const handleRopeSelect = (points: number[]) => {
    const selectedCells = getCellsInRope(points, dimensions);
    setters.setTempSelectedCells(selectedCells);
    
    // Create preview palette
    const newPalette = [...palette];
    selectedCells.forEach(index => {
      if (!lockedCells.includes(index)) {
        newPalette[index] = selectedColor || '#ffffff';
      }
    });
    setters.setPreviewPalette(newPalette);
  };

  const handleSelectionStateUpdate = (
    tempSelectedCells: number[],
    shiftKey: boolean
  ) => {
    const newSelection = shiftKey 
      ? [...new Set([...selectedCells, ...tempSelectedCells])]
      : tempSelectedCells;
    updateState({ selectedCells: newSelection });
    
    // Clear preview states
    setters.setPreviewPalette(null);
    setters.setTempSelectedCells([]);
    setters.setIsSelecting(false);
    setters.setSelectionStart(null);
    setters.setRopePoints([]);
  };

  // Copy/Paste
  const handleSelectionCopy = () => {
    if (selectedCells.length === 0) return;
    const colors = selectedCells.map(index => palette[index]);
    updateState({
      copiedCells: { indices: selectedCells, colors }
    });
  };

  const handleSelectionPaste = (targetIndex: number) => {
    if (!state.copiedCells) return;
    const { indices, colors } = state.copiedCells;
    const newPalette = [...palette];
    
    const startRow = Math.floor(indices[0] / dimensions.width);
    const startCol = indices[0] % dimensions.width;
    const targetRow = Math.floor(targetIndex / dimensions.width);
    const targetCol = targetIndex % dimensions.width;
    
    indices.forEach((sourceIndex, i) => {
      const relativeRow = Math.floor(sourceIndex / dimensions.width) - startRow;
      const relativeCol = (sourceIndex % dimensions.width) - startCol;
      const newIndex = (targetRow + relativeRow) * dimensions.width + (targetCol + relativeCol);
      
      if (!lockedCells.includes(newIndex)) {
        newPalette[newIndex] = colors[i];
      }
    });
    
    updateState({
      palette: newPalette,
      copiedCells: null
    });
  };

  const handleMouseMovement = (
    index: number, 
    isSelecting: boolean, 
    selectionStart: number | null, 
    ropePoints: number[]
  ) => {
    if (state.selectedTool === "boxselect" && isSelecting && selectionStart !== null) {
      handleBoxSelect(selectionStart, index);
    } else if (state.selectedTool === "ropeselect" && ropePoints.length > 0) {
      handleRopeSelect([...ropePoints, index]);
    }
  };

  const handleClearSelectedCells = () => {
    const newPalette = [...palette];
    selectedCells.forEach((index) => {
      if (!lockedCells.includes(index)) {
        newPalette[index] = "#ffffff";
      }
    });
    updateState({ palette: newPalette });
  };

  const handleClearSelection = () => {
    updateState({ 
      selectedCells: [],
      selectedCell: null 
    });
  };

  const handleCellHover = (index: number) => {
    if (state.copiedCells && state.selectedTool !== "move") {
      const { indices, colors } = state.copiedCells;
      const newPalette = [...palette];
      
      const startRow = Math.floor(indices[0] / dimensions.width);
      const startCol = indices[0] % dimensions.width;
      const targetRow = Math.floor(index / dimensions.width);
      const targetCol = index % dimensions.width;
      
      indices.forEach((sourceIndex, i) => {
        const relativeRow = Math.floor(sourceIndex / dimensions.width) - startRow;
        const relativeCol = (sourceIndex % dimensions.width) - startCol;
        const newIndex = (targetRow + relativeRow) * dimensions.width + (targetCol + relativeCol);
        
        if (!lockedCells.includes(newIndex)) {
          newPalette[newIndex] = colors[i];
        }
      });
      
      setters.setPreviewPalette(newPalette);
    }
  };

  const handleMouseDown = (index: number, event: React.MouseEvent) => {
    if (state.selectedTool === "boxselect" || state.selectedTool === "ropeselect") {
      setters.setIsSelecting(true);
      setters.setSelectionStart(index);
      setters.setRopePoints([index]);
      
      if (!event.shiftKey) {
        updateState({ selectedCells: [] });
      }
    }
  };

  return {
    handleCellSelect,
    handleRowSelect,
    handleColumnSelect,
    handleBoxSelect,
    handleRopeSelect,
    handleSelectionStateUpdate,
    handleSelectionCopy,
    handleSelectionPaste,
    handleMouseMovement,
    handleClearSelectedCells,
    handleClearSelection,
    handleCellHover,
    handleMouseDown
  };
} 