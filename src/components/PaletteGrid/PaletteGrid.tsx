import React, { useState, useEffect } from "react";

import { getMovedPalette, getRotatedPalette } from "@/utils/paletteHelpers";
import { ColumnControls } from "./ColumnControls";
import { RowControls } from "./RowControls";
import { SelectionActionsBar } from "./SelectionActionsBar";
import { GridCells } from "./GridCells";
import { ColumnPopControls } from "./ColumnPopControls";
import { RowPopControls } from "./RowPopControls";
import { usePaletteContext } from '@/app/context/PaletteContext';
import { useToolActions } from '@/app/hooks/useToolActions';
import { useSelectionActions } from '@/app/hooks/useSelectionActions';

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
    
    handleSelectionCopy: onCopyCells,
    handleSelectionPaste: onPasteCells,

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

  const toolActions = useToolActions(state, {
    handleCellUpdate: handlers.handleCellUpdate,
    handleCopyPalette: handlers.handleCopyPalette
  }, updateState);
  
  const selectionActions = useSelectionActions(state, updateState, {
    setPreviewPalette,
    setTempSelectedCells,
    setIsSelecting,
    setSelectionStart,
    setRopePoints
  });

  function handleCellClickLocal(index: number, event: React.MouseEvent) {
    if (selectedTool === "paint" && !event.shiftKey) {
      toolActions.handlePaintTool(index);
    } else if (selectedTool === "fillrow") {
      toolActions.handleFillRowTool(index);
    } else if (selectedTool === "fillcolumn") {
      toolActions.handleFillColumnTool(index);
    } else if (copiedCells && !event.shiftKey) {
      onPasteCells(index);
      setPreviewPalette(null);
    } else {
      selectionActions.handleCellSelect(index, event.shiftKey);
    }
  }

  function handleMouseMove(index: number) {
    if (selectedTool === "move") {
      const startRow = Math.floor(selectedCells[0] / dimensions.width);
      const startCol = selectedCells[0] % dimensions.width;
      const targetRow = Math.floor(index / dimensions.width);
      const targetCol = index % dimensions.width;
      
      const newPalette = getMovedPalette(
        palette,
        selectedCells,
        dimensions,
        targetRow - startRow,
        targetCol - startCol,
        lockedCells
      );
      setPreviewPalette(newPalette);
    } else {
      selectionActions.handleMouseMovement(index, isSelecting, selectionStart, ropePoints);
    }
  }

  function handleMouseUp(event: React.MouseEvent) {
    selectionActions.handleSelectionStateUpdate(tempSelectedCells, event.shiftKey);
    setIsSelecting(false);
    setSelectionStart(null);
    setRopePoints([]);
    setTempSelectedCells([]);
    setTempLockedCells([]);
  }


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

  function handleCellHoverLocal(index: number) {
    if (selectedTool === "move") {
      handleMouseMove(index);
    } else {
      selectionActions.handleCellHover(index);
    }
  }

  function handleMouseDown(index: number, event: React.MouseEvent) {
    selectionActions.handleMouseDown(index, event);
  }

  function handleContextMenu(event: React.MouseEvent) {
    event.preventDefault();
  }

  return (
    <div className="relative" onContextMenu={handleContextMenu}>
<SelectionActionsBar
  selectedCellsCount={selectedCells.length}
  onCopy={selectionActions.handleSelectionCopy}
  onClearCells={selectionActions.handleClearSelectedCells}
  onClearSelection={selectionActions.handleClearSelection}
/>

      <ColumnControls
        width={dimensions.width}
        copiedColumn={copiedColumn}
        onColumnHover={handleColumnHover}
        onHoverEnd={handleHoverEnd}
        onColumnSelect={selectionActions.handleColumnSelect}
      />

      <RowControls
        height={dimensions.height}
        copiedRow={copiedRow}
        onRowHover={handleRowHover}
        onHoverEnd={handleHoverEnd}
        onRowSelect={selectionActions.handleRowSelect}
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
