"use client";

import { useState, useCallback, useEffect } from "react";
import { ColorPicker, Tool } from "@/components/ColorPicker/ColorPicker";
import { PaletteGrid } from "@/components/PaletteGrid/PaletteGrid";
import { DimensionControls } from "@/components/DimensionControls/DimensionControls";
import { GridControls } from "@/components/GridControls/GridControls";
import {
  reshapeGrid,
  popGridSection,
  Direction,
  transformGridLayout,
} from "@/utils/GridOperations";
import { PaletteExamples } from "@/components/PaletteExamples/PaletteExamples";
import { PaletteAdjustments } from "@/components/PaletteAdjustments/PaletteAdjustments";
import { CellAdjustments } from "@/components/CellAdjustments/CellAdjustments";
import { useHistory } from "@/utils/useHistory";

interface PaletteGridProps {
  setPalette?: (newPalette: string[]) => void;
  onSelectionClear?: () => void;
  updateState: (updates: Partial<AppState>) => void;
}

export interface AppState {
  dimensions: { width: number; height: number };
  palette: string[];
  selectedColor: string;
  selectedTool: Tool;
  selectedCell: number | null;
  selectedCells: number[];
  copiedCells: { indices: number[]; colors: string[] } | null;
  copiedColumn: number | null;
  copiedRow: number | null;
}

export default function Home() {
  const {
    state,
    pushState,
    undo,
    redo,
    canUndo,
    canRedo,
  } = useHistory<AppState>({
    dimensions: { width: 16, height: 16 },
    palette: Array(16 * 16).fill("#ffffff"),
    selectedColor: "#000000",
    selectedTool: "paint",
    selectedCell: null,
    selectedCells: [],
    copiedCells: null,
    copiedColumn: null,
    copiedRow: null,
  });

  // Destructure state for easier access
  const {
    dimensions,
    palette,
    selectedColor,
    selectedTool,
    selectedCell,
    selectedCells,
    copiedCells,
    copiedColumn,
    copiedRow,
  } = state;

  // Create a helper function to update state
  const updateState = (updates: Partial<AppState>) => {
    pushState({ ...state, ...updates });
  };

  // Add keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'z') {
        e.preventDefault();
        undo();
      }
      if ((e.ctrlKey || e.metaKey) && e.key === 'y') {
        e.preventDefault();
        redo();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [undo, redo]);

  const handleDimensionsChange = (newDimensions: {
    width: number;
    height: number;
  }) => {
    const newPalette = reshapeGrid(palette, dimensions, newDimensions);
    updateState({
      dimensions: newDimensions,
      palette: newPalette,
    });
  };

  const handlePop = (direction: Direction) => {
    const { newColors, newDimensions } = popGridSection(
      palette,
      dimensions,
      direction
    );
    updateState({
      dimensions: newDimensions,
      palette: newColors,
    });
  };

  const handleCellClick = (index: number) => {
    console.log('handleCellClick called with index:', index);
    console.log('Current tool:', selectedTool);

    if (selectedTool === "paint") {
      const newPalette = [...palette];
      newPalette[index] = selectedColor;
      updateState({
        palette: newPalette
      });
    } else if (selectedTool === "select") {
      updateState({
        selectedCell: index,
        selectedCells: [index],
        selectedColor: palette[index]
      });
    } else if (selectedTool === "multiselect") {
      if (copiedCells) {
        handlePasteCells(index);
        return;
      }
      
      const newSelectedCells = selectedCells.includes(index)
        ? selectedCells.filter(i => i !== index)
        : [...selectedCells, index];
      
      updateState({
        selectedCell: null,
        selectedCells: newSelectedCells
      });
    }
  };

  const handleTransform = (layout: "horizontal" | "vertical" | "square") => {
    const { newColors, newDimensions } = transformGridLayout(
      palette,
      dimensions,
      layout
    );
    updateState({
      dimensions: newDimensions,
      palette: newColors,
    });
  };

  const handleColumnClear = (columnIndex: number) => {
    const newPalette = [...palette];
    for (let row = 0; row < dimensions.height; row++) {
      const index = row * dimensions.width + columnIndex;
      newPalette[index] = "#ffffff";
    }
    updateState({
      palette: newPalette,
    });
  };

  const handleRowClear = (rowIndex: number) => {
    const newPalette = [...palette];
    for (let col = 0; col < dimensions.width; col++) {
      const index = rowIndex * dimensions.width + col;
      newPalette[index] = "#ffffff";
    }
    updateState({
      palette: newPalette,
    });
  };

  const handleColumnCopy = (columnIndex: number) => {
    updateState({
      copiedColumn: columnIndex,
      copiedRow: null, // Clear copied row
    });
  };

  const handleColumnPaste = (columnIndex: number) => {
    if (copiedColumn === null || copiedColumn === columnIndex) return;

    const newPalette = [...palette];
    for (let row = 0; row < dimensions.height; row++) {
      const sourceIndex = row * dimensions.width + copiedColumn;
      const targetIndex = row * dimensions.width + columnIndex;
      newPalette[targetIndex] = palette[sourceIndex];
    }
    updateState({
      palette: newPalette,
      copiedColumn: null, // Clear copied column after pasting
    });
  };

  const handleRowCopy = (rowIndex: number) => {
    updateState({
      copiedRow: rowIndex,
      copiedColumn: null, // Clear copied column
    });
  };

  const handleRowPaste = (rowIndex: number) => {
    if (copiedRow === null || copiedRow === rowIndex) return;

    const newPalette = [...palette];
    for (let col = 0; col < dimensions.width; col++) {
      const sourceIndex = copiedRow * dimensions.width + col;
      const targetIndex = rowIndex * dimensions.width + col;
      newPalette[targetIndex] = palette[sourceIndex];
    }
    updateState({
      palette: newPalette,
      copiedRow: null, // Clear copied row after pasting
    });
  };

  const handleColumnRemove = (columnIndex: number) => {
    const newPalette = [];
    const newWidth = dimensions.width - 1;

    for (let row = 0; row < dimensions.height; row++) {
      for (let col = 0; col < dimensions.width; col++) {
        if (col !== columnIndex) {
          const index = row * dimensions.width + col;
          newPalette.push(palette[index]);
        }
      }
    }

    updateState({
      dimensions: { ...dimensions, width: newWidth },
      palette: newPalette,
    });
  };

  const handleRowRemove = (rowIndex: number) => {
    const newPalette = palette.filter(
      (_, index) => Math.floor(index / dimensions.width) !== rowIndex
    );

    updateState({
      dimensions: { ...dimensions, height: dimensions.height - 1 },
      palette: newPalette,
    });
  };

  const handleCopyPalette = (
    colors: string[],
    newDimensions: { width: number; height: number }
  ) => {
    updateState({
      dimensions: newDimensions,
      palette: colors,
    });
  };

  const handleCellAdjustment = (index: number, newColor: string) => {
    const newPalette = [...palette];
    newPalette[index] = newColor;
    updateState({
      palette: newPalette,
    });
  };

  const handleMultiCellAdjustment = (newColor: string) => {
    const newPalette = [...palette];
    selectedCells.forEach(index => {
      newPalette[index] = newColor;
    });
    updateState({
      palette: newPalette,
    });
  };

  const handleRowSelect = (rowIndex: number) => {
    const rowCells = Array.from({ length: dimensions.width }, (_, colIndex) => 
      rowIndex * dimensions.width + colIndex
    );
    
    updateState({
      selectedTool: "multiselect",
      selectedCells: rowCells,
      selectedCell: null,
    });
    
    // If we have copied cells, paste them at the first cell of the selected row
    if (copiedCells) {
      handlePasteCells(rowCells[0]);
      return;
    }
  };

  const handleColumnSelect = (columnIndex: number) => {
    const columnCells = Array.from({ length: dimensions.height }, (_, rowIndex) => 
      rowIndex * dimensions.width + columnIndex
    );
    
    updateState({
      selectedTool: "multiselect",
      selectedCells: columnCells,
      selectedCell: null,
    });
    
    // If we have copied cells, paste them at the first cell of the selected column
    if (copiedCells) {
      handlePasteCells(columnCells[0]);
      return;
    }
  };

  const handleCopyCells = (indices: number[]) => {
    const colors = indices.map(index => palette[index]);
    updateState({
      copiedCells: { indices, colors },
      // Clear existing row/column copy states
      copiedColumn: null,
      copiedRow: null,
    });
  };

  const handlePasteCells = (targetStartIndex: number) => {
    if (!copiedCells) return;
    
    const newPalette = [...palette];
    const { indices, colors } = copiedCells;
    
    // Calculate relative positions
    const startRow = Math.floor(indices[0] / dimensions.width);
    const startCol = indices[0] % dimensions.width;
    const targetRow = Math.floor(targetStartIndex / dimensions.width);
    const targetCol = targetStartIndex % dimensions.width;
    
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
    
    updateState({
      palette: newPalette,
      copiedCells: null  // Clear the copied cells after pasting
    });
  };

  const handleColorChange = (color: string) => {
    updateState({
      selectedColor: color
    });
  };

  return (
    <main className="min-h-screen p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Color Palette Generator</h1>

        <div className="flex justify-between items-center mb-4">
          <div className="flex gap-2">
            <button
              onClick={undo}
              disabled={!canUndo}
              className={`p-2 rounded-lg ${
                canUndo ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-400'
              }`}
              title="Undo (Ctrl+Z)"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
              </svg>
            </button>
            <button
              onClick={redo}
              disabled={!canRedo}
              className={`p-2 rounded-lg ${
                canRedo ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-400'
              }`}
              title="Redo (Ctrl+Y)"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 10h-10a8 8 0 00-8 8v2M21 10l-6 6m6-6l-6-6" />
              </svg>
            </button>
          </div>
          {/* ... rest of your header content ... */}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[2fr,1fr] gap-8">
          <div className="space-y-6">
            <DimensionControls
              dimensions={dimensions}
              onDimensionsChange={handleDimensionsChange}
            />

            <GridControls
              dimensions={dimensions}
              onPop={handlePop}
              onTransform={handleTransform}
            />

            <div className="flex gap-8">
              <div className="w-64">
                <ColorPicker
                  color={selectedColor}
                  onChange={handleColorChange}
                  selectedTool={selectedTool}
                  onToolChange={(tool) => updateState({ selectedTool: tool })}
                />
              </div>

              <div className="flex-1">
                <PaletteGrid
                  dimensions={dimensions}
                  selectedColor={selectedColor}
                  selectedTool={selectedTool}
                  palette={palette}
                  onCellClick={handleCellClick}
                  onColumnClear={handleColumnClear}
                  onRowClear={handleRowClear}
                  onColumnCopy={handleColumnCopy}
                  onColumnPaste={handleColumnPaste}
                  onRowCopy={handleRowCopy}
                  onRowPaste={handleRowPaste}
                  copiedColumn={copiedColumn}
                  copiedRow={copiedRow}
                  onColumnRemove={handleColumnRemove}
                  onRowRemove={handleRowRemove}
                  selectedCell={selectedCell}
                  selectedCells={selectedCells}
                  onRowSelect={handleRowSelect}
                  onColumnSelect={handleColumnSelect}
                  updateState={updateState}
                  setSelectedCell={(cell) => updateState({ selectedCell: cell })}
                  setSelectedCells={(cells) => updateState({ selectedCells: cells })}
                  onCopyCells={handleCopyCells}
                  onPasteCells={handlePasteCells}
                  copiedCells={copiedCells}
                />
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="p-4 bg-gray-50 rounded-lg text-sm">
              <div>Selected Tool: {selectedTool}</div>
              <div>Selected Cell: {selectedCell !== null ? selectedCell : 'none'}</div>
              <div>Selected Cells: {selectedCells.length}</div>
            </div>

            {selectedTool === "select" && selectedCell !== null && (
              <CellAdjustments
                colors={[palette[selectedCell]]}
                onColorChange={(newColor) => handleCellAdjustment(selectedCell, newColor)}
              />
            )}
            
            {selectedTool === "multiselect" && selectedCells.length > 0 && (
              <CellAdjustments
                colors={selectedCells.map(index => palette[index])}
                onColorChange={handleMultiCellAdjustment}
              />
            )}
            
            <PaletteAdjustments
              palette={palette}
              onPaletteChange={(newPalette) => updateState({ palette: newPalette })}
            />
            
            <PaletteExamples onCopyPalette={handleCopyPalette} />
          </div>
        </div>
      </div>
    </main>
  );
}
