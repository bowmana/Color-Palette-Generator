import React, { useState, useEffect } from "react";
import { previewCopiedCells, invokeCellClick } from "@/utils/cellHelpers";
import { getCellsInBox, getCellsInRope, handleRowSelect as selectRow, handleColumnSelect as selectColumn } from "@/utils/selectionHelpers";
import { getMovedPalette } from "@/utils/paletteHelpers";
import { ColumnControls } from "./ColumnControls";
import { RowControls } from "./RowControls";
import { SelectionActionsBar } from "./SelectionActionsBar";
import { GridCells } from "./GridCells";
import { ColumnPopControls } from "./ColumnPopControls";
import { RowPopControls } from "./RowPopControls";
import { usePaletteContext } from '@/app/context/PaletteContext';

export function PaletteGrid() {
  const { state, handlers, updateState } = usePaletteContext();
  const {
    dimensions,
    palette,
    lockedCells,
    selectedCell,
    selectedCells,
    copiedCells,
    copiedColumn,
    copiedRow,
    selectedColor,
    selectedTool
  } = state;

  const {
    handleTransform,
    handleSelectionCopy: onCopyCells,
    handleSelectionPaste: onPasteCells,
    handleCellUpdate,
    handleCellsUpdate,
    handleCopyPalette: setPalette,
    handleColumnRemove: onColumnRemove,
    handleRowRemove: onRowRemove
  } = handlers;

  const [previewPalette, setPreviewPalette] = useState<string[] | null>(null);
  const [selectionStart, setSelectionStart] = useState<number | null>(null);
  const [isSelecting, setIsSelecting] = useState(false);
  const [ropePoints, setRopePoints] = useState<number[]>([]);
  const [tempSelectedCells, setTempSelectedCells] = useState<number[]>([]);
  const [tempLockedCells, setTempLockedCells] = useState<number[]>([]);
  const [rotationPreview, setRotationPreview] = useState<string[] | null>(null);

  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && copiedCells) {
        updateState({ copiedCells: null });
        setPreviewPalette(null);
      }
    };

    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [copiedCells, updateState]);

  const handleContextMenu = (event: React.MouseEvent) => {
    event.preventDefault();
    if (copiedCells) {
      updateState({ copiedCells: null });
      setPreviewPalette(null);
    }
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && (selectedTool === "rotateLeft90" || selectedTool === "rotateRight90")) {
        setRotationPreview(null);
        updateState({ selectedTool: undefined });
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedTool, updateState]);

  useEffect(() => {
    if (selectedTool && ["rotateLeft90", "rotateRight90"].includes(selectedTool) && selectedCells.length > 0) {
      const newPalette = [...palette];
      
      selectedCells.forEach(cellIndex => {
        newPalette[cellIndex] = "#ffffff";
      });
      
      selectedCells.forEach(cellIndex => {
        const row = Math.floor(cellIndex / dimensions.width);
        const col = cellIndex % dimensions.width;
        let targetIndex;
        
        if (selectedTool === "rotateLeft90") {
          targetIndex = ((col + dimensions.width) % dimensions.width) * dimensions.width + (dimensions.height - 1 - row);
        } else {
          targetIndex = ((dimensions.width - 1 - col) + dimensions.width) % dimensions.width * dimensions.width + row;
        }
        
        if (!lockedCells.includes(targetIndex)) {
          newPalette[targetIndex] = palette[cellIndex];
        }
      });
      
      setPreviewPalette(newPalette);
    } else {
      setPreviewPalette(null);
    }
  }, [selectedTool, selectedCells, dimensions, palette, lockedCells]);

  function handleCellHoverLocal(index: number) {
    previewCopiedCells(index, copiedCells, palette, dimensions, setPreviewPalette);
  }

  function handleCellClickLocal(index: number, event: React.MouseEvent) {
    if (selectedTool === "paint" && !event.shiftKey) {
      handleCellUpdate(index, selectedColor);
    } else if (copiedCells && !event.shiftKey) {
      onPasteCells(index);
      setPreviewPalette(null);
    } else {
      const newSelection = event.shiftKey 
        ? [...new Set([...selectedCells, index])]
        : [index];
      updateState({ 
        selectedCell: index,
        selectedCells: newSelection 
      });
    }
  }

  function handleMouseDown(index: number, event: React.MouseEvent) {
    if (selectedTool === "boxselect") {
      setSelectionStart(index);
      setIsSelecting(true);
      if (!event.shiftKey) {
        updateState({ selectedCells: [] });
      }
      setTempSelectedCells([index]);
      return;
    }
    if (selectedTool === "ropeselect") {
      setRopePoints([index]);
      if (!event.shiftKey) {
        updateState({ selectedCells: [] });
      }
      setTempSelectedCells([index]);
    }
    if (selectedTool === "boxlock") {
      setSelectionStart(index);
      setIsSelecting(true);
      if (!event.shiftKey) {
        updateState({ lockedCells: [] });
      }
      setTempLockedCells([index]);
    }
    if (selectedTool === "ropelock") {
      setRopePoints([index]);
      if (!event.shiftKey) {
        updateState({ lockedCells: [] });
      }
      setTempLockedCells([index]);
    }
  }

  function handleMouseMove(index: number) {
    if (selectedTool === "boxselect" && isSelecting && selectionStart !== null) {
      setTempSelectedCells(getCellsInBox(selectionStart, index, dimensions));
      return;
    }
    if (selectedTool === "ropeselect" && ropePoints.length > 0) {
      if (ropePoints[ropePoints.length - 1] !== index) {
        const newPoints = [...ropePoints, index];
        setRopePoints(newPoints);
        setTempSelectedCells(getCellsInRope(newPoints, dimensions));
      }
      return;
    }
    if (selectedTool === "move" && selectedCells.length > 0) {
      const startRow = Math.floor(selectedCells[0] / dimensions.width);
      const startCol = selectedCells[0] % dimensions.width;
      const targetRow = Math.floor(index / dimensions.width);
      const targetCol = index % dimensions.width;
      const rowOffset = targetRow - startRow;
      const colOffset = targetCol - startCol;

      setPreviewPalette(getMovedPalette(
        palette,
        selectedCells,
        dimensions,
        rowOffset,
        colOffset,
        lockedCells
      ));
      setTempSelectedCells([]);
    }
  }

  function handleMouseUp(event: React.MouseEvent) {
    if (selectedTool === "boxselect" && tempSelectedCells.length > 0) {
      const newSelection = event.shiftKey 
        ? [...new Set([...selectedCells, ...tempSelectedCells])]
        : tempSelectedCells;
      updateState({ selectedCells: newSelection });
    } else if (selectedTool === "ropeselect" && tempSelectedCells.length > 0) {
      const newSelection = event.shiftKey 
        ? [...new Set([...selectedCells, ...tempSelectedCells])]
        : tempSelectedCells;
      updateState({ selectedCells: newSelection });
    } else if (selectedTool === "boxlock" && tempLockedCells.length > 0) {
      const newLocked = event.shiftKey 
        ? [...new Set([...lockedCells, ...tempLockedCells])]
        : tempLockedCells;
      updateState({ lockedCells: newLocked });
    } else if (selectedTool === "ropelock" && tempLockedCells.length > 0) {
      const newLocked = event.shiftKey 
        ? [...new Set([...lockedCells, ...tempLockedCells])]
        : tempLockedCells;
      updateState({ lockedCells: newLocked });
    }
    setIsSelecting(false);
    setSelectionStart(null);
    setRopePoints([]);
    setTempSelectedCells([]);
    setTempLockedCells([]);
  }

  const handleRowSelect = (rowIndex: number, event?: React.MouseEvent) => {
    const newSelection = selectRow(rowIndex, dimensions, selectedCells, event);
    updateState({ selectedCells: newSelection });
  };

  const handleColumnSelect = (columnIndex: number, event?: React.MouseEvent) => {
    const newSelection = selectColumn(columnIndex, dimensions, selectedCells, event);
    updateState({ selectedCells: newSelection });
  };

  const handleColumnHover = (columnIndex: number) => {
    if (!copiedColumn) return;
    
    const newPalette = [...palette];
    for (let row = 0; row < dimensions.height; row++) {
      const sourceIndex = row * dimensions.width + copiedColumn;
      const targetIndex = row * dimensions.width + columnIndex;
      if (!lockedCells.includes(targetIndex)) {
        newPalette[targetIndex] = palette[sourceIndex];
      }
    }
    setPreviewPalette(newPalette);
  };

  const handleRowHover = (rowIndex: number) => {
    if (!copiedRow) return;
    
    const newPalette = [...palette];
    for (let col = 0; col < dimensions.width; col++) {
      const sourceIndex = copiedRow * dimensions.width + col;
      const targetIndex = rowIndex * dimensions.width + col;
      if (!lockedCells.includes(targetIndex)) {
        newPalette[targetIndex] = palette[sourceIndex];
      }
    }
    setPreviewPalette(newPalette);
  };

  const handleHoverEnd = () => {
    setPreviewPalette(null);
  };

  // Callback for popping a particular column
  function handleColumnPop(columnIndex: number) {
    // If you already have an “onColumnRemove” function that calls removeColumn,
    // you can simply call it here:
    onColumnRemove(columnIndex);
  }

  // Callback for popping a particular row
  function handleRowPop(rowIndex: number) {
    onRowRemove(rowIndex);
  }

  return (
    <div className="relative" onContextMenu={handleContextMenu}>
      <SelectionActionsBar
        selectedCellsCount={selectedCells.length}
        onCopy={() => {
          if (selectedCells.length === 0) return;
          onCopyCells?.();
        }}
        onClearCells={() => {
          const newPalette = [...palette];
          selectedCells.forEach((index) => {
            newPalette[index] = "#ffffff";
          });
          setPalette?.(newPalette);
        }}
        onClearSelection={() => {
          updateState({ selectedCells: [] });
          updateState({ selectedCell: null });
        }}
      />

      <ColumnControls
        width={dimensions.width}
        copiedColumn={copiedColumn}
        onColumnHover={handleColumnHover}
        onHoverEnd={handleHoverEnd}
        onColumnSelect={handleColumnSelect}
      />

      <RowControls
        height={dimensions.height}
        copiedRow={copiedRow}
        onRowHover={handleRowHover}
        onHoverEnd={handleHoverEnd}
        onRowSelect={handleRowSelect}
      />

      <ColumnPopControls
        width={dimensions.width}
        height={dimensions.height}
        onColumnPop={handleColumnPop}
      />

      <RowPopControls
        width={dimensions.width}
        height={dimensions.height}
        onRowPop={handleRowPop}
      />

      <GridCells
        dimensions={dimensions}
        palette={palette}
        previewPalette={previewPalette}
        rotationPreview={rotationPreview}
        lockedCells={lockedCells}
        selectedTool={selectedTool}
        selectedCell={selectedCell}
        selectedCells={selectedCells}
        tempSelectedCells={tempSelectedCells}
        tempLockedCells={tempLockedCells}
        handleCellHover={handleCellHoverLocal}
        handleCellClick={handleCellClickLocal}
        handleMouseDown={handleMouseDown}
        handleMouseMove={handleMouseMove}
        handleMouseUp={handleMouseUp}
        handleHoverEnd={handleHoverEnd}
        isSelecting={isSelecting}
      />
    </div>
  );
}
