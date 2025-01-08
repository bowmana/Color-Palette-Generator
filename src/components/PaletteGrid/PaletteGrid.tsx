import React, { useState, useEffect } from "react";
import { previewCopiedCells, invokeCellClick } from "@/utils/cellHelpers";
import { getCellsInBox, getCellsInRope } from "@/utils/selectionHelpers";
import { getMovedPalette } from "@/utils/paletteHelpers";
import { PaletteGridProps } from "@/app/types";
import { ColumnControls } from "./ColumnControls";
import { RowControls } from "./RowControls";
import { SelectionActionsBar } from "./SelectionActionsBar";
import { GridCells } from "./GridCells";

export function PaletteGrid({
  // Grid Config
  dimensions,
  palette,
  lockedCells,
  
  // Selection State
  selectedCell,
  selectedCells,
  setSelectedCell,
  setSelectedCells,
  
  // Copy/Paste State
  copiedCells,
  copiedColumn,
  copiedRow,
  onCopyCells,
  onPasteCells,
  
  // Tool State
  selectedColor,
  selectedTool,
  onToolChange,
  
  // Transform Operations
  handleTransform,
  setPalette,
  
  // State Management
  updateState,
  
  // Other
  onCellClick,
}: PaletteGridProps) {
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
        onToolChange(null);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedTool, onToolChange]);

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
    invokeCellClick(index, event, onCellClick);
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
    const rowCells = Array.from({ length: dimensions.width }, (_, i) => 
      rowIndex * dimensions.width + i
    );

    if (event?.shiftKey && selectedCells.length > 0) {
      const lastSelectedRow = Math.floor(selectedCells[selectedCells.length - 1] / dimensions.width);
      const startRow = Math.min(lastSelectedRow, rowIndex);
      const endRow = Math.max(lastSelectedRow, rowIndex);
      
      const newSelection = [];
      for (let row = startRow; row <= endRow; row++) {
        for (let col = 0; col < dimensions.width; col++) {
          newSelection.push(row * dimensions.width + col);
        }
      }
      
      updateState({ selectedCells: [...new Set([...selectedCells, ...newSelection])] });
    } else if (event?.ctrlKey || event?.metaKey) {
      const isRowSelected = rowCells.every(cell => selectedCells.includes(cell));
      
      if (isRowSelected) {
        const newSelection = selectedCells.filter(cell => !rowCells.includes(cell));
        updateState({ selectedCells: newSelection });
      } else {
        updateState({ selectedCells: [...selectedCells, ...rowCells] });
      }
    } else {
      updateState({ selectedCells: rowCells });
    }
  };

  const handleColumnSelect = (columnIndex: number, event?: React.MouseEvent) => {
    const columnCells = Array.from({ length: dimensions.height }, (_, i) => 
      i * dimensions.width + columnIndex
    );

    if (event?.shiftKey && selectedCells.length > 0) {
      const lastSelectedColumn = selectedCells[selectedCells.length - 1] % dimensions.width;
      const startCol = Math.min(lastSelectedColumn, columnIndex);
      const endCol = Math.max(lastSelectedColumn, columnIndex);
      
      const newSelection = [];
      for (let row = 0; row < dimensions.height; row++) {
        for (let col = startCol; col <= endCol; col++) {
          newSelection.push(row * dimensions.width + col);
        }
      }
      
      updateState({ selectedCells: [...new Set([...selectedCells, ...newSelection])] });
    } else if (event?.ctrlKey || event?.metaKey) {
      const isColumnSelected = columnCells.every(cell => selectedCells.includes(cell));
      
      if (isColumnSelected) {
        const newSelection = selectedCells.filter(cell => !columnCells.includes(cell));
        updateState({ selectedCells: newSelection });
      } else {
        updateState({ selectedCells: [...selectedCells, ...columnCells] });
      }
    } else {
      updateState({ selectedCells: columnCells });
    }
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

  return (
    <div className="relative" onContextMenu={handleContextMenu}>
      <SelectionActionsBar
        selectedCellsCount={selectedCells.length}
        onCopy={() => {
          if (selectedCells.length === 0) return;
          onCopyCells?.(selectedCells);
        }}
        onClearCells={() => {
          const newPalette = [...palette];
          selectedCells.forEach((index) => {
            newPalette[index] = "#ffffff";
          });
          setPalette?.(newPalette);
        }}
        onClearSelection={() => {
          setSelectedCells([]);
          setSelectedCell(null);
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
