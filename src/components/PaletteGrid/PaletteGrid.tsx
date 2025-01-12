import React from "react";


import { ColumnControls } from "./ColumnControls";
import { RowControls } from "./RowControls";
import { SelectionActionsBar } from "./SelectionActionsBar";
import { GridCells } from "./GridCells";
import { ColumnPopControls } from "./ColumnPopControls";
import { RowPopControls } from "./RowPopControls";
import { usePaletteContext } from '@/app/context/PaletteContext';
import { PaletteContextType } from "@/app/types";
import { useLockActions } from "@/app/hooks/useLockActions";

export function PaletteGrid() {
  const { 
    state, 
    uiState,
    actions,
    setUIState
  } = usePaletteContext() as PaletteContextType;

  const { tool: toolActions, grid: gridTransform, selection: selectionActions, lock: lockActions } = actions;

  function handleCellClickLocal(index: number, event: React.MouseEvent) {
    const { selectedTool, copiedCells } = state;
    
    if (selectedTool === "paint" && !event.shiftKey) {
      toolActions.handlePaintTool(index);
    } else if (selectedTool === "fillrow") {
      toolActions.handleFillRowTool(index);
    } else if (selectedTool === "fillcolumn") {
      toolActions.handleFillColumnTool(index);
    } else if (selectedTool === "lock") {
      lockActions.handleCellLock(index, event.shiftKey);
    } else if (selectedTool === "rowselect") {
      const rowIndex = Math.floor(index / state.dimensions.width);
      selectionActions.handleRowSelect(rowIndex, event);
    } else if (selectedTool === "columnselect") {
      const columnIndex = index % state.dimensions.width;
      selectionActions.handleColumnSelect(columnIndex, event);
    } else if (copiedCells && !event.shiftKey) {
      selectionActions.handleSelectionPaste(index);
      setUIState(prev => ({ ...prev, previewPalette: null }));
    } else {
      selectionActions.handleCellSelect(index, event.shiftKey);
    }
  }

  function handleMouseMove(index: number) {
    const { selectedTool } = state;
    if (selectedTool === "boxselect" || selectedTool === "ropeselect") {
      selectionActions.handleMouseMovement(
        index, 
        uiState.isSelecting, 
        uiState.selectionStart, 
        uiState.ropePoints
      );
    } else if (selectedTool === "boxlock" || selectedTool === "ropelock") {
      lockActions.handleMouseMovement(
        index,
        uiState.isLocking,
        uiState.lockStart,
        uiState.lockRopePoints
      );
    }
  }

  function handleMouseUp(event: React.MouseEvent) {
    const { selectedTool } = state;
    if (selectedTool === "boxselect" || selectedTool === "ropeselect") {
      selectionActions.handleSelectionStateUpdate(uiState.tempSelectedCells, event.shiftKey);
      setUIState(prev => ({ 
        ...prev, 
        isSelecting: false, 
        selectionStart: null, 
        ropePoints: [] 
      }));
    } else if (selectedTool === "boxlock" || selectedTool === "ropelock") {
      lockActions.handleLockStateUpdate(uiState.tempLockedCells, event.shiftKey);
      setUIState(prev => ({ 
        ...prev, 
        isLocking: false, 
        lockStart: null, 
        lockRopePoints: [] 
      }));
    }
  }


  const handleColumnHover = (columnIndex: number) => {
    const { copiedColumn, lockedCells, palette, dimensions } = state;
    
    if (!copiedColumn) return;
    
    const newPalette = [...palette];
    for (let row = 0; row < dimensions.height; row++) {
      const sourceIndex = row * dimensions.width + copiedColumn;
      const targetIndex = row * dimensions.width + columnIndex;
      if (!lockedCells.includes(targetIndex)) {
        newPalette[targetIndex] = palette[sourceIndex];
      }
    }
    setUIState(prev => ({ ...prev, previewPalette: newPalette }));
  };

  const handleRowHover = (rowIndex: number) => {
    const { copiedRow, lockedCells, palette, dimensions } = state;
    
    if (!copiedRow) return;
    
    const newPalette = [...palette];
    for (let col = 0; col < dimensions.width; col++) {
      const sourceIndex = copiedRow * dimensions.width + col;
      const targetIndex = rowIndex * dimensions.width + col;
      if (!lockedCells.includes(targetIndex)) {
        newPalette[targetIndex] = palette[sourceIndex];
      }
    }
    setUIState(prev => ({ ...prev, previewPalette: newPalette }));
    };

  const handleHoverEnd = () => {
    setUIState(prev => ({ ...prev, previewPalette: null }));
  };


  function handleCellHoverLocal(index: number) {
    const { selectedTool } = state;
    if ((selectedTool === "boxselect" || selectedTool === "ropeselect") && uiState.isSelecting) {
      handleMouseMove(index);
    } else {
      selectionActions.handleCellHover(index);
    }
  }

  function handleMouseDown(index: number, event: React.MouseEvent) {
    const { selectedTool } = state;
    
    if (selectedTool === "boxselect" || selectedTool === "ropeselect") {
      selectionActions.handleMouseDown(index, event);
    } else if (selectedTool === "boxlock" || selectedTool === "ropelock") {
      lockActions.handleMouseDown(index, event);
    }
  }

  function handleContextMenu(event: React.MouseEvent) {
    event.preventDefault();
  }

  return (
    <div className="relative" onContextMenu={handleContextMenu}>
<SelectionActionsBar
  selectedCellsCount={state.selectedCells.length}
  onCopy={selectionActions.handleSelectionCopy}
  onClearCells={selectionActions.handleClearSelectedCells}
  onClearSelection={selectionActions.handleClearSelection}
/>

      <ColumnControls
        width={state.dimensions.width}
        copiedColumn={state.copiedColumn}
        onColumnHover={handleColumnHover}
        onHoverEnd={handleHoverEnd}
        onColumnSelect={selectionActions.handleColumnSelect}
      />

      <RowControls
        height={state.dimensions.height}
        copiedRow={state.copiedRow}
        onRowHover={handleRowHover}
        onHoverEnd={handleHoverEnd}
        onRowSelect={selectionActions.handleRowSelect}
      />

      <ColumnPopControls
        width={state.dimensions.width}
        height={state.dimensions.height}
        onColumnPop={gridTransform.handleColumnRemove}
      />

      <RowPopControls
        width={state.dimensions.width}
        height={state.dimensions.height}
        onRowPop={gridTransform.handleRowRemove}
      />

      <GridCells
        dimensions={state.dimensions}
        palette={state.palette}
        previewPalette={uiState.previewPalette}
        rotationPreview={uiState.rotationPreview}
        lockedCells={state.lockedCells}
        selectedTool={state.selectedTool}
        selectedCell={state.selectedCell}
        selectedCells={state.selectedCells}
        tempSelectedCells={uiState.tempSelectedCells}
        tempLockedCells={uiState.tempLockedCells}
        isSelecting={uiState.isSelecting}
        handleCellClick={handleCellClickLocal}
        handleMouseDown={handleMouseDown}
        handleMouseMove={handleMouseMove}
        handleMouseUp={handleMouseUp}
        handleCellHover={handleCellHoverLocal}
        handleHoverEnd={handleHoverEnd}
      />
    </div>
  );
}
