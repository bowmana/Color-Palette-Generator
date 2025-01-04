import React, { useState, useEffect } from "react";
import { Tool } from "../ColorPicker/ColorPicker";
import { AppState } from "../../app/page";
import { ColumnControls } from "./ColumnControls";
import { RowControls } from "./RowControls";
import { SelectionActionsBar } from "./SelectionActionsBar";
import { GridCells } from "./GridCells";

interface PaletteGridProps {
  dimensions: { width: number; height: number };
  selectedColor: string;
  selectedTool: Tool | null;
  palette: string[];
  onCellClick: (index: number) => void;
  handleTransform: (transformType: string, targetIndex?: number) => void;
  onColumnClear?: (columnIndex: number) => void;
  onRowClear?: (rowIndex: number) => void;
  onColumnCopy?: (columnIndex: number) => void;
  onColumnPaste?: (columnIndex: number) => void;
  onRowCopy?: (rowIndex: number) => void;
  onRowPaste?: (rowIndex: number) => void;
  copiedColumn: number | null;
  copiedRow: number | null;
  onColumnRemove?: (columnIndex: number) => void;
  onRowRemove?: (rowIndex: number) => void;
  selectedCell: number | null;
  selectedCells: number[];
  onRowSelect: (rowIndex: number) => void;
  onColumnSelect: (columnIndex: number) => void;
  setPalette?: (newPalette: string[]) => void;
  setSelectedCell: (cell: number | null) => void;
  setSelectedCells: (cells: number[]) => void;
  onCopyCells?: (indices: number[]) => void;
  onPasteCells?: (targetIndex: number) => void;
  copiedCells?: { indices: number[], colors: string[] } | null;
  updateState: (updates: Partial<AppState>) => void;
  lockedCells: number[];
  onToolChange: (tool: Tool | null) => void;
}

export function PaletteGrid(props: PaletteGridProps) {
  const {
    dimensions,
    selectedColor,
    selectedTool,
    palette,
    onCellClick,
    handleTransform,
    onColumnClear,
    onRowClear,
    onColumnCopy,
    onColumnPaste,
    onRowCopy,
    onRowPaste,
    copiedColumn,
    copiedRow,
    onColumnRemove,
    onRowRemove,
    selectedCell,
    selectedCells,
    onRowSelect,
    onColumnSelect,
    setPalette,
    setSelectedCell,
    setSelectedCells,
    onCopyCells,
    onPasteCells,
    copiedCells,
    updateState,
    lockedCells,
    onToolChange,
  } = props;

  const [showColumnMenu, setShowColumnMenu] = useState<number | null>(null);
  const [showRowMenu, setShowRowMenu] = useState<number | null>(null);
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

  const handleCellClick = (index: number, e: React.MouseEvent) => {
    if (selectedTool === "move" && selectedCells.length > 0) {
      handleTransform("move", index);
      onToolChange("select");
      return;
    }

    if ((selectedTool === "rotateLeft90" || selectedTool === "rotateRight90") && selectedCells.length > 0) {
      handleTransform(selectedTool);
      onToolChange("select");
      setPreviewPalette(null);
      return;
    }

    if ((selectedTool === "paint" || !selectedTool) && lockedCells.includes(index)) {
      return;
    }

    if (selectedTool === "rowselect") {
      const rowIndex = Math.floor(index / dimensions.width);
      handleRowSelect(rowIndex, e);
      return;
    }

    if (selectedTool === "columnselect") {
      const columnIndex = index % dimensions.width;
      handleColumnSelect(columnIndex, e);
      return;
    }

    if (selectedTool === "fillrow") {
      const rowIndex = Math.floor(index / dimensions.width);
      const newPalette = [...palette];
      for (let i = 0; i < dimensions.width; i++) {
        const targetIndex = rowIndex * dimensions.width + i;
        if (!lockedCells.includes(targetIndex)) {
          newPalette[targetIndex] = selectedColor;
        }
      }
      updateState({ palette: newPalette });
      return;
    }

    if (selectedTool === "fillcolumn") {
      const columnIndex = index % dimensions.width;
      const newPalette = [...palette];
      for (let i = 0; i < dimensions.height; i++) {
        const targetIndex = i * dimensions.width + columnIndex;
        if (!lockedCells.includes(targetIndex)) {
          newPalette[targetIndex] = selectedColor;
        }
      }
      updateState({ palette: newPalette });
      return;
    }

    if (selectedTool === "lock") {
      const newLockedCells = lockedCells.includes(index)
        ? lockedCells.filter(i => i !== index)
        : [...lockedCells, index];
      updateState({ lockedCells: newLockedCells });
      return;
    }

    if (selectedTool === "select") {
      if (selectedCell === index) {
        updateState({
          selectedCell: null,
          selectedCells: [],
        });
      } else {
        updateState({
          selectedCell: index,
          selectedCells: [index],
          selectedColor: palette[index]
        });
      }
      return;
    }

    if (copiedCells) {
      onPasteCells?.(index);
      return;
    }
    
    onCellClick(index);
  };

  const handleColumnHover = (columnIndex: number) => {
    if (copiedColumn === null || columnIndex === copiedColumn) {
      setPreviewPalette(null);
      return;
    }

    const newPalette = [...palette];
    for (let row = 0; row < dimensions.height; row++) {
      const sourceIndex = row * dimensions.width + copiedColumn;
      const targetIndex = row * dimensions.width + columnIndex;
      newPalette[targetIndex] = palette[sourceIndex];
    }
    setPreviewPalette(newPalette);
  };

  const handleRowHover = (rowIndex: number) => {
    if (copiedRow === null || rowIndex === copiedRow) {
      setPreviewPalette(null);
      return;
    }

    const newPalette = [...palette];
    for (let col = 0; col < dimensions.width; col++) {
      const sourceIndex = copiedRow * dimensions.width + col;
      const targetIndex = rowIndex * dimensions.width + col;
      newPalette[targetIndex] = palette[sourceIndex];
    }
    setPreviewPalette(newPalette);
  };

  const handleHoverEnd = () => {
    setPreviewPalette(null);
  };

  const handleCellHover = (index: number) => {
    if (!copiedCells) {
      setPreviewPalette(null);
      return;
    }

    const newPalette = [...palette];
    const { indices, colors } = copiedCells;
    
    const startRow = Math.floor(indices[0] / dimensions.width);
    const startCol = indices[0] % dimensions.width;
    const targetRow = Math.floor(index / dimensions.width);
    const targetCol = index % dimensions.width;
    
    indices.forEach((sourceIndex, i) => {
      const relativeRow = Math.floor(sourceIndex / dimensions.width) - startRow;
      const relativeCol = (sourceIndex % dimensions.width) - startCol;
      
      const targetIndex = (targetRow + relativeRow) * dimensions.width + (targetCol + relativeCol);
      
      if (
        targetRow + relativeRow >= 0 &&
        targetRow + relativeRow < dimensions.height &&
        targetCol + relativeCol >= 0 &&
        targetCol + relativeCol < dimensions.width
      ) {
        newPalette[targetIndex] = colors[i];
      }
    });
    
    setPreviewPalette(newPalette);
  };

  const isSelectedRow = (cells: number[], width: number): number | null => {
    if (cells.length !== width) return null;
    const rowIndex = Math.floor(cells[0] / width);
    return cells.every(cell => Math.floor(cell / width) === rowIndex) ? rowIndex : null;
  };

  const isSelectedColumn = (cells: number[], width: number, height: number): number | null => {
    if (cells.length !== height) return null;
    const columnIndex = cells[0] % width;
    return cells.every(cell => cell % width === columnIndex) ? columnIndex : null;
  };

  const getCellsInBox = (start: number, end: number): number[] => {
    const startRow = Math.floor(start / dimensions.width);
    const startCol = start % dimensions.width;
    const endRow = Math.floor(end / dimensions.width);
    const endCol = end % dimensions.width;

    const minRow = Math.min(startRow, endRow);
    const maxRow = Math.max(startRow, endRow);
    const minCol = Math.min(startCol, endCol);
    const maxCol = Math.max(startCol, endCol);

    const cells: number[] = [];
    for (let row = minRow; row <= maxRow; row++) {
      for (let col = minCol; col <= maxCol; col++) {
        cells.push(row * dimensions.width + col);
      }
    }
    return cells;
  };

  const getCellsInRope = (points: number[]): number[] => {
    if (points.length < 2) return points;
    
    const cells = new Set<number>();
    for (let i = 1; i < points.length; i++) {
      const start = points[i - 1];
      const end = points[i];
      
      const startRow = Math.floor(start / dimensions.width);
      const startCol = start % dimensions.width;
      const endRow = Math.floor(end / dimensions.width);
      const endCol = end % dimensions.width;
      
      let x = startCol;
      let y = startRow;
      const dx = Math.abs(endCol - startCol);
      const dy = Math.abs(endRow - startRow);
      const sx = startCol < endCol ? 1 : -1;
      const sy = startRow < endRow ? 1 : -1;
      let err = dx - dy;
      
      while (true) {
        cells.add(y * dimensions.width + x);
        if (x === endCol && y === endRow) break;
        const e2 = 2 * err;
        if (e2 > -dy) {
          err -= dy;
          x += sx;
        }
        if (e2 < dx) {
          err += dx;
          y += sy;
        }
      }
    }
    return Array.from(cells);
  };

  const handleMouseDown = (index: number, event: React.MouseEvent) => {
    if (selectedTool === "boxselect") {
      setSelectionStart(index);
      setIsSelecting(true);
      if (!event.shiftKey) {
        updateState({ selectedCells: [] });
      }
      setTempSelectedCells([index]);
    } else if (selectedTool === "ropeselect") {
      setRopePoints([index]);
      if (!event.shiftKey) {
        updateState({ selectedCells: [] });
      }
      setTempSelectedCells([index]);
    } else if (selectedTool === "boxlock") {
      setSelectionStart(index);
      setIsSelecting(true);
      if (!event.shiftKey) {
        updateState({ lockedCells: [] });
      }
      setTempLockedCells([index]);
    } else if (selectedTool === "ropelock") {
      setRopePoints([index]);
      if (!event.shiftKey) {
        updateState({ lockedCells: [] });
      }
      setTempLockedCells([index]);
    }
  };

  const handleMouseMove = (index: number) => {
    if (selectedTool === "boxselect" && isSelecting && selectionStart !== null) {
      const newSelection = getCellsInBox(selectionStart, index);
      setTempSelectedCells(newSelection);
    } else if (selectedTool === "boxlock" && isSelecting && selectionStart !== null) {
      const cellsToLock = getCellsInBox(selectionStart, index);
      setTempLockedCells(cellsToLock);
    } else if (selectedTool === "ropeselect" && ropePoints.length > 0) {
      if (ropePoints[ropePoints.length - 1] !== index) {
        const newPoints = [...ropePoints, index];
        setRopePoints(newPoints);
        const newSelection = getCellsInRope(newPoints);
        setTempSelectedCells(newSelection);
      }
    } else if (selectedTool === "ropelock" && ropePoints.length > 0) {
      if (ropePoints[ropePoints.length - 1] !== index) {
        const newPoints = [...ropePoints, index];
        setRopePoints(newPoints);
        const cellsToLock = getCellsInRope(newPoints);
        setTempLockedCells(cellsToLock);
      }
    } else if (selectedTool === "move" && selectedCells.length > 0) {
      const startRow = Math.floor(selectedCells[0] / dimensions.width);
      const startCol = selectedCells[0] % dimensions.width;
      const targetRow = Math.floor(index / dimensions.width);
      const targetCol = index % dimensions.width;
      
      const rowOffset = targetRow - startRow;
      const colOffset = targetCol - startCol;
      
      const newPalette = [...palette];
      
      selectedCells.forEach(cellIndex => {
        newPalette[cellIndex] = "#ffffff";
      });
      
      selectedCells.forEach(cellIndex => {
        const cellRow = Math.floor(cellIndex / dimensions.width);
        const cellCol = cellIndex % dimensions.width;
        const newRow = cellRow + rowOffset;
        const newCol = cellCol + colOffset;
        
        if (
          newRow >= 0 && 
          newRow < dimensions.height && 
          newCol >= 0 && 
          newCol < dimensions.width
        ) {
          const targetIndex = newRow * dimensions.width + newCol;
          if (!lockedCells.includes(targetIndex)) {
            newPalette[targetIndex] = palette[cellIndex];
          }
        }
      });
      
      setPreviewPalette(newPalette);
      setTempSelectedCells([]);
    }
  };

  const handleMouseUp = (event: React.MouseEvent) => {
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
  };

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

  return (
    <div className="relative">
      <SelectionActionsBar
        selectedCellsCount={props.selectedCells.length}
        onCopy={() => {
          if (props.selectedCells.length === 0) return;
          props.onCopyCells?.(props.selectedCells);
        }}
        onClearCells={() => {
          const newPalette = [...palette];
          props.selectedCells.forEach((index) => {
            newPalette[index] = "#ffffff";
          });
          props.setPalette?.(newPalette);
        }}
        onClearSelection={() => {
          props.setSelectedCells([]);
          props.setSelectedCell(null);
        }}
      />

      <ColumnControls
        width={dimensions.width}
        copiedColumn={props.copiedColumn}
        onColumnHover={handleColumnHover}
        onHoverEnd={handleHoverEnd}
        onColumnSelect={handleColumnSelect}
      />

      <RowControls
        height={dimensions.height}
        copiedRow={props.copiedRow}
        onRowHover={handleRowHover}
        onHoverEnd={handleHoverEnd}
        onRowSelect={handleRowSelect}
      />

      <GridCells
        dimensions={dimensions}
        palette={palette}
        previewPalette={previewPalette}
        rotationPreview={rotationPreview}
        lockedCells={props.lockedCells}
        selectedTool={selectedTool}
        selectedCell={props.selectedCell}
        selectedCells={props.selectedCells}
        tempSelectedCells={tempSelectedCells}
        tempLockedCells={tempLockedCells}
        handleCellClick={handleCellClick}
        handleMouseDown={handleMouseDown}
        handleMouseMove={handleMouseMove}
        handleMouseUp={handleMouseUp}
        handleCellHover={handleCellHover}
        handleHoverEnd={handleHoverEnd}
        isSelecting={isSelecting}
      />
    </div>
  );
}
