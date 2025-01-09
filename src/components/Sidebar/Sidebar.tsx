import React from 'react';
import { CellAdjustments } from '@/components/CellAdjustments/CellAdjustments';
import { PaletteAdjustments } from '@/components/PaletteAdjustments/PaletteAdjustments';
import { PaletteExamples } from '@/components/PaletteExamples/PaletteExamples';
import { usePaletteContext } from '@/app/context/PaletteContext';

export function Sidebar() {
  const { state, handlers, updateState } = usePaletteContext();
  const { 
    selectedTool: currentTool,
    selectedCell,
    selectedCells,
    palette 
  } = state;
  
  const { 
    handleCellUpdate: handleCellAdjustment,
    handleCellsUpdate: handleMultiCellAdjustment,
    handleCopyPalette
  } = handlers;

  return (
    <div className="space-y-6">
      <div className="p-4 bg-gray-50 rounded-lg text-sm">
        <div>Selected Tool: {currentTool}</div>
        <div>
          Selected Cell: {selectedCell !== null ? selectedCell : 'none'}
        </div>
        <div>Selected Cells: {selectedCells.length}</div>
      </div>

      {currentTool === "select" && selectedCell !== null && (
        <CellAdjustments
          colors={[palette[selectedCell]]}
          onColorChange={(newColor) =>
            handleCellAdjustment(selectedCell, newColor)
          }
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
  );
} 