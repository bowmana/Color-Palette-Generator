"use client";

import { useState } from "react";
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

interface PaletteGridProps {
  setPalette?: (newPalette: string[]) => void;
  onSelectionClear?: () => void;
}

export default function Home() {
  const [selectedColor, setSelectedColor] = useState("#000000");
  const [selectedTool, setSelectedTool] = useState<Tool>("paint");
  const [dimensions, setDimensions] = useState({ width: 16, height: 16 });
  const [palette, setPalette] = useState<string[]>(
    Array(dimensions.width * dimensions.height).fill("#ffffff")
  );
  const [copiedColumn, setCopiedColumn] = useState<number | null>(null);
  const [copiedRow, setCopiedRow] = useState<number | null>(null);
  const [selectedCell, setSelectedCell] = useState<number | null>(null);
  const [selectedCells, setSelectedCells] = useState<number[]>([]);
  const [copiedCells, setCopiedCells] = useState<{indices: number[], colors: string[]} | null>(null);

  const handleDimensionsChange = (newDimensions: {
    width: number;
    height: number;
  }) => {
    const newPalette = reshapeGrid(palette, dimensions, newDimensions);
    setDimensions(newDimensions);
    setPalette(newPalette);
  };

  const handlePop = (direction: Direction) => {
    const { newColors, newDimensions } = popGridSection(
      palette,
      dimensions,
      direction
    );
    setDimensions(newDimensions);
    setPalette(newColors);
  };

  const handleCellClick = (index: number) => {
    console.log('handleCellClick called with index:', index);
    console.log('Current tool:', selectedTool);

    if (selectedTool === "paint") {
      const newPalette = [...palette];
      newPalette[index] = selectedColor;
      setPalette(newPalette);
    } else if (selectedTool === "select") {
      setSelectedCell(index);
      setSelectedCells([index]);
      setSelectedColor(palette[index]);
    } else if (selectedTool === "multiselect") {
      setSelectedCell(null);
      setSelectedCells(prev => {
        const newSelection = prev.includes(index) 
          ? prev.filter(i => i !== index)
          : [...prev, index];
        return newSelection;
      });
    }
  };

  const handleTransform = (layout: "horizontal" | "vertical" | "square") => {
    const { newColors, newDimensions } = transformGridLayout(
      palette,
      dimensions,
      layout
    );
    setDimensions(newDimensions);
    setPalette(newColors);
  };

  const handleColumnClear = (columnIndex: number) => {
    const newPalette = [...palette];
    for (let row = 0; row < dimensions.height; row++) {
      const index = row * dimensions.width + columnIndex;
      newPalette[index] = "#ffffff";
    }
    setPalette(newPalette);
  };

  const handleRowClear = (rowIndex: number) => {
    const newPalette = [...palette];
    for (let col = 0; col < dimensions.width; col++) {
      const index = rowIndex * dimensions.width + col;
      newPalette[index] = "#ffffff";
    }
    setPalette(newPalette);
  };

  const handleColumnCopy = (columnIndex: number) => {
    setCopiedColumn(columnIndex);
    setCopiedRow(null); // Clear copied row
  };

  const handleColumnPaste = (columnIndex: number) => {
    if (copiedColumn === null || copiedColumn === columnIndex) return;

    const newPalette = [...palette];
    for (let row = 0; row < dimensions.height; row++) {
      const sourceIndex = row * dimensions.width + copiedColumn;
      const targetIndex = row * dimensions.width + columnIndex;
      newPalette[targetIndex] = palette[sourceIndex];
    }
    setPalette(newPalette);
    setCopiedColumn(null); // Clear copied column after pasting
  };

  const handleRowCopy = (rowIndex: number) => {
    setCopiedRow(rowIndex);
    setCopiedColumn(null); // Clear copied column
  };

  const handleRowPaste = (rowIndex: number) => {
    if (copiedRow === null || copiedRow === rowIndex) return;

    const newPalette = [...palette];
    for (let col = 0; col < dimensions.width; col++) {
      const sourceIndex = copiedRow * dimensions.width + col;
      const targetIndex = rowIndex * dimensions.width + col;
      newPalette[targetIndex] = palette[sourceIndex];
    }
    setPalette(newPalette);
    setCopiedRow(null); // Clear copied row after pasting
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

    setDimensions({ ...dimensions, width: newWidth });
    setPalette(newPalette);
  };

  const handleRowRemove = (rowIndex: number) => {
    const newPalette = palette.filter(
      (_, index) => Math.floor(index / dimensions.width) !== rowIndex
    );

    setDimensions({ ...dimensions, height: dimensions.height - 1 });
    setPalette(newPalette);
  };

  const handleCopyPalette = (
    colors: string[],
    newDimensions: { width: number; height: number }
  ) => {
    setDimensions(newDimensions);
    setPalette(colors);
  };

  const handleCellAdjustment = (index: number, newColor: string) => {
    const newPalette = [...palette];
    newPalette[index] = newColor;
    setPalette(newPalette);
  };

  const handleMultiCellAdjustment = (newColor: string) => {
    const newPalette = [...palette];
    selectedCells.forEach(index => {
      newPalette[index] = newColor;
    });
    setPalette(newPalette);
  };

  const handleRowSelect = (rowIndex: number) => {
    setSelectedTool("multiselect");
    const rowCells = Array.from({ length: dimensions.width }, (_, colIndex) => 
      rowIndex * dimensions.width + colIndex
    );
    setSelectedCells(rowCells);
    setSelectedCell(null);
  };

  const handleColumnSelect = (columnIndex: number) => {
    setSelectedTool("multiselect");
    const columnCells = Array.from({ length: dimensions.height }, (_, rowIndex) => 
      rowIndex * dimensions.width + columnIndex
    );
    setSelectedCells(columnCells);
    setSelectedCell(null);
  };

  const handleCopyCells = (indices: number[]) => {
    const colors = indices.map(index => palette[index]);
    setCopiedCells({ indices, colors });
    // Clear existing row/column copy states
    setCopiedColumn(null);
    setCopiedRow(null);
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
      // Calculate relative position from start
      const relativeRow = Math.floor(sourceIndex / dimensions.width) - startRow;
      const relativeCol = (sourceIndex % dimensions.width) - startCol;
      
      // Calculate target position
      const targetIndex = (targetRow + relativeRow) * dimensions.width + (targetCol + relativeCol);
      
      // Only paste if target position is within grid bounds
      if (
        targetRow + relativeRow >= 0 &&
        targetRow + relativeRow < dimensions.height &&
        targetCol + relativeCol >= 0 &&
        targetCol + relativeCol < dimensions.width
      ) {
        newPalette[targetIndex] = colors[i];
      }
    });
    
    setPalette(newPalette);
  };

  return (
    <main className="min-h-screen p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Color Palette Generator</h1>

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
                  onChange={setSelectedColor}
                  selectedTool={selectedTool}
                  onToolChange={setSelectedTool}
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
                  setPalette={setPalette}
                  setSelectedCell={setSelectedCell}
                  setSelectedCells={setSelectedCells}
                  copiedCells={copiedCells}
                  onCopyCells={handleCopyCells}
                  onPasteCells={handlePasteCells}
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
              onPaletteChange={setPalette}
            />
            
            <PaletteExamples onCopyPalette={handleCopyPalette} />
          </div>
        </div>
      </div>
    </main>
  );
}
