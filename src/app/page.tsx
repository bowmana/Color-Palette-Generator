"use client";

import { useState } from "react";
import { ColorPicker } from "@/components/ColorPicker/ColorPicker";
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

export default function Home() {
  const [selectedColor, setSelectedColor] = useState("#000000");
  const [dimensions, setDimensions] = useState({ width: 16, height: 16 });
  const [palette, setPalette] = useState<string[]>(
    Array(dimensions.width * dimensions.height).fill("#ffffff")
  );
  const [copiedColumn, setCopiedColumn] = useState<number | null>(null);
  const [copiedRow, setCopiedRow] = useState<number | null>(null);

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
    const newPalette = [...palette];
    newPalette[index] = selectedColor;
    setPalette(newPalette);
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
    setCopiedRow(null); // Clear row copy when copying column
  };

  const handleColumnPaste = (targetColumnIndex: number) => {
    if (copiedColumn === null) return;

    const newPalette = [...palette];
    for (let row = 0; row < dimensions.height; row++) {
      const sourceIndex = row * dimensions.width + copiedColumn;
      const targetIndex = row * dimensions.width + targetColumnIndex;
      newPalette[targetIndex] = palette[sourceIndex];
    }
    setPalette(newPalette);
  };

  const handleRowCopy = (rowIndex: number) => {
    setCopiedRow(rowIndex);
    setCopiedColumn(null); // Clear column copy when copying row
  };

  const handleRowPaste = (targetRowIndex: number) => {
    if (copiedRow === null) return;

    const newPalette = [...palette];
    for (let col = 0; col < dimensions.width; col++) {
      const sourceIndex = copiedRow * dimensions.width + col;
      const targetIndex = targetRowIndex * dimensions.width + col;
      newPalette[targetIndex] = palette[sourceIndex];
    }
    setPalette(newPalette);
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
                />
              </div>

              <div className="flex-1">
                <PaletteGrid
                  dimensions={dimensions}
                  selectedColor={selectedColor}
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
                />
              </div>
            </div>
          </div>

          <div className="space-y-6">
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
