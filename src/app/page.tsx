"use client";

import { useEffect } from "react";
import { AppState } from "@/app/types";
import { PaletteToolbar } from "@/components/ToolBar/PaletteToolbar";
import { PaletteGrid } from "@/components/PaletteGrid/PaletteGrid";
import { DimensionControls } from "@/components/DimensionControls/DimensionControls";
import { GridControls } from "@/components/GridControls/GridControls";
import { PaletteExamples } from "@/components/PaletteExamples/PaletteExamples";
import { PaletteAdjustments } from "@/components/PaletteAdjustments/PaletteAdjustments";
import { CellAdjustments } from "@/components/CellAdjustments/CellAdjustments";
import { useHistory } from "@/app/hooks/useHistory";
import { useGridHandlers } from "@/app/hooks/useGridHandlers";

export default function Home() {
  const { state, pushState, undo, redo, canUndo, canRedo } = useHistory<AppState>({
    dimensions: { width: 16, height: 16 },
    palette: Array(16 * 16).fill("#ffffff"),
    selectedColor: "#000000",
    selectedTool: "paint",
    selectedCell: null,
    selectedCells: [],
    copiedCells: null,
    copiedColumn: null,
    copiedRow: null,
    lockedCells: [],
  });

  const {
    dimensions,
    palette,
    selectedColor,
    selectedTool: currentTool,
    selectedCell,
    selectedCells,
    copiedCells,
    copiedColumn,
    copiedRow,
    lockedCells,
  } = state;

  const updateState = (updates: Partial<AppState>) => {
    pushState({ ...state, ...updates });
  };

  // Bring in our refactored handlers:
  const {
    handleDimensionsChange,
    handlePop,
    handleColumnClear,
    handleRowClear,
    handleColumnCopy,
    handleColumnPaste,
    handleRowCopy,
    handleRowPaste,
    handleColumnRemove,
    handleRowRemove,
    handleTransform,
    handleCopyCells,
    handlePasteCells,
    handleCopyPalette,
    handleCellAdjustment,
    handleMultiCellAdjustment,
  } = useGridHandlers(state, updateState);

  // Optional: Provide real or no-op for rowSelect / colSelect
  const handleRowSelect = (rowIndex: number) => {
    // Example "no-op" or your custom logic
    console.log("Row selected:", rowIndex);
  };

  const handleColumnSelect = (columnIndex: number) => {
    // Example "no-op" or your custom logic
    console.log("Column selected:", columnIndex);
  };

  // For onToolChange, you can just map to setState:
  const handleToolChange = (tool: any) => {
    updateState({ selectedTool: tool });
  };

  // Also define setSelectedCell and setSelectedCells
  const setSelectedCell = (cell: number | null) => {
    updateState({ selectedCell: cell });
  };

  const setSelectedCells = (cells: number[]) => {
    updateState({ selectedCells: cells });
  };

  // Keyboard shortcuts remain the same
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

  return (
    <main className="min-h-screen p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Color Palette Generator</h1>

        {/* Undo/Redo UI */}
        <div className="flex justify-between items-center mb-4">
          <div className="flex gap-2">
            <button
              onClick={undo}
              disabled={!canUndo}
              className={`p-2 rounded-lg ${
                canUndo ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-400"
              }`}
              title="Undo (Ctrl+Z)"
            >
              Undo
            </button>
            <button
              onClick={redo}
              disabled={!canRedo}
              className={`p-2 rounded-lg ${
                canRedo ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-400"
              }`}
              title="Redo (Ctrl+Y)"
            >
              Redo
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[2fr,1fr] gap-8">
          <div className="space-y-6">
            {/* Dimension controls */}
            <DimensionControls
              dimensions={dimensions}
              onDimensionsChange={handleDimensionsChange}
            />

            {/* Grid controls */}
            <GridControls
              dimensions={dimensions}
              onPop={handlePop}
              onTransform={handleTransform}
            />

            <div className="flex gap-8">
              <div className="w-64">
                <PaletteToolbar
                  color={selectedColor}
                  onChange={(color) => updateState({ selectedColor: color })}
                  selectedTool={currentTool}
                  onToolChange={handleToolChange}
                  updateState={updateState}
                  dimensions={dimensions}
                  palette={palette}
                  selectedCells={selectedCells}
                  lockedCells={lockedCells}
                  handleTransform={handleTransform}
                />
              </div>

              <div className="flex-1">
                <PaletteGrid
                  dimensions={dimensions}
                  selectedColor={selectedColor}
                  selectedTool={currentTool}
                  palette={palette}
                  onCellClick={() => {
                    /* possibly pass real or inline logic */
                  }}
                  // Row/Col handlers:
                  onColumnClear={handleColumnClear}
                  onRowClear={handleRowClear}
                  onColumnCopy={handleColumnCopy}
                  onColumnPaste={handleColumnPaste}
                  copiedColumn={copiedColumn}
                  copiedRow={copiedRow}
                  onRowCopy={handleRowCopy}
                  onRowPaste={handleRowPaste}
                  onColumnRemove={handleColumnRemove}
                  onRowRemove={handleRowRemove}
                  // Additional required props for selection & tool:
                  onToolChange={handleToolChange}
                  onRowSelect={handleRowSelect}
                  onColumnSelect={handleColumnSelect}
                  setSelectedCell={setSelectedCell}
                  setSelectedCells={setSelectedCells}

                  // Selection and state
                  selectedCell={selectedCell}
                  selectedCells={selectedCells}
                  copiedCells={copiedCells}
                  lockedCells={lockedCells}
                  updateState={updateState}
                  onCopyCells={handleCopyCells}
                  onPasteCells={handlePasteCells}
                  handleTransform={handleTransform}
                  // This palette setter is from your updateState helper:
                  setPalette={(newPalette) => updateState({ palette: newPalette })}
                />
              </div>
            </div>
          </div>

          <div className="space-y-6">
            {/* Debug or status pane */}
            <div className="p-4 bg-gray-50 rounded-lg text-sm">
              <div>Selected Tool: {currentTool}</div>
              <div>Selected Cell: {selectedCell !== null ? selectedCell : "none"}</div>
              <div>Selected Cells: {selectedCells.length}</div>
            </div>

            {/* Cell adjustments */}
            {currentTool === "select" && selectedCell !== null && (
              <CellAdjustments
                colors={[palette[selectedCell]]}
                onColorChange={(newColor) => handleCellAdjustment(selectedCell, newColor)}
              />
            )}
            {currentTool === "multiselect" && selectedCells.length > 0 && (
              <CellAdjustments
                colors={selectedCells.map((index) => palette[index])}
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
