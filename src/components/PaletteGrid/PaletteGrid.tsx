import React, { useState } from "react";

interface PaletteGridProps {
  dimensions: { width: number; height: number };
  selectedColor: string;
  palette: string[];
  onCellClick: (index: number) => void;
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
}

export function PaletteGrid({
  dimensions,
  selectedColor,
  palette,
  onCellClick,
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
}: PaletteGridProps) {
  const [showColumnMenu, setShowColumnMenu] = useState<number | null>(null);
  const [showRowMenu, setShowRowMenu] = useState<number | null>(null);

  return (
    <div>
      {/* Legend */}
      <div className="mb-6 p-4 bg-gray-50 rounded-lg text-sm">
        <h3 className="font-medium text-gray-700 mb-2">Grid Controls</h3>
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <div className="flex gap-1">
              <span className="w-6 h-6 bg-blue-100 text-blue-500 flex items-center justify-center rounded">
                ⎘
              </span>
              <span className="w-6 h-6 bg-red-100 text-red-500 flex items-center justify-center rounded">
                ×
              </span>
            </div>
            <span className="text-gray-600">
              Hover over column tops to copy or clear column / column data
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex gap-1">
              <span className="w-6 h-6 bg-blue-100 text-blue-500 flex items-center justify-center rounded">
                ⎘
              </span>
              <span className="w-6 h-6 bg-red-100 text-red-500 flex items-center justify-center rounded">
                ×
              </span>
            </div>
            <span className="text-gray-600">
              Hover over row sides to copy or clear row / row data
            </span>
          </div>
          {(copiedColumn !== null || copiedRow !== null) && (
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 bg-green-100 text-green-500 flex items-center justify-center rounded">
                ⎗
              </span>
              <span className="text-gray-600">
                Paste button appears when you have copied data
              </span>
            </div>
          )}
        </div>
      </div>

      <div className="relative">
        {/* Column Controls */}
        <div
          className="absolute -top-20 left-0 right-0 flex gap-0.5 px-0.5"
          style={{
            gridTemplateColumns: `repeat(${dimensions.width}, 2rem)`,
          }}
        >
          {Array.from({ length: dimensions.width }).map((_, columnIndex) => (
            <div
              key={`col-controls-${columnIndex}`}
              className="flex flex-col gap-1"
            >
              <button
                onClick={() => onColumnCopy?.(columnIndex)}
                className={`w-8 h-6 group relative opacity-0 hover:opacity-100 
                  ${
                    copiedColumn === columnIndex
                      ? "bg-blue-500 text-white"
                      : "bg-blue-100 hover:bg-blue-500 text-blue-500 hover:text-white"
                  } 
                  text-xs rounded-t flex items-center justify-center transition-all duration-200`}
                title="Copy column"
              >
                <span className="transform scale-75">⎘</span>
              </button>
              {copiedColumn !== null && (
                <button
                  onClick={() => onColumnPaste?.(columnIndex)}
                  className="w-8 h-6 group relative opacity-0 hover:opacity-100 
                    bg-green-100 hover:bg-green-500 text-green-500 hover:text-white
                    text-xs rounded-t flex items-center justify-center transition-all duration-200"
                  title="Paste column"
                >
                  <span className="transform translate-y-0.5 group-hover:translate-y-0 transition-transform">
                    ⎗
                  </span>
                </button>
              )}
              <div className="relative">
                <button
                  onClick={() => setShowColumnMenu(columnIndex)}
                  onBlur={() => setTimeout(() => setShowColumnMenu(null), 100)}
                  className="w-8 h-6 group relative opacity-0 hover:opacity-100 
                    bg-red-100 hover:bg-red-500 text-red-500 hover:text-white"
                  title="Delete options"
                >
                  <span className="transform translate-y-0.5 group-hover:translate-y-0">
                    ×
                  </span>
                </button>
                {showColumnMenu === columnIndex && (
                  <div className="absolute top-full left-0 mt-1 w-32 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-10">
                    <button
                      onClick={() => {
                        onColumnClear?.(columnIndex);
                        setShowColumnMenu(null);
                      }}
                      className="w-full px-3 py-1 text-left text-sm hover:bg-gray-100 text-gray-700"
                    >
                      Clear data
                    </button>
                    <button
                      onClick={() => {
                        onColumnRemove?.(columnIndex);
                        setShowColumnMenu(null);
                      }}
                      className="w-full px-3 py-1 text-left text-sm hover:bg-gray-100 text-gray-700"
                    >
                      Remove column
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Row Controls */}
        <div
          className="absolute -left-20 top-0 bottom-0 flex flex-col gap-0.5 py-0.5"
          style={{
            gridTemplateRows: `repeat(${dimensions.height}, 2rem)`,
          }}
        >
          {Array.from({ length: dimensions.height }).map((_, rowIndex) => (
            <div key={`row-controls-${rowIndex}`} className="flex gap-1">
              <button
                onClick={() => onRowCopy?.(rowIndex)}
                className={`h-8 w-6 group relative opacity-0 hover:opacity-100 
                  ${
                    copiedRow === rowIndex
                      ? "bg-blue-500 text-white"
                      : "bg-blue-100 hover:bg-blue-500 text-blue-500 hover:text-white"
                  } 
                  text-xs rounded-l flex items-center justify-center transition-all duration-200`}
                title="Copy row"
              >
                <span className="transform scale-75">⎘</span>
              </button>
              {copiedRow !== null && (
                <button
                  onClick={() => onRowPaste?.(rowIndex)}
                  className="h-8 w-6 group relative opacity-0 hover:opacity-100 
                    bg-green-100 hover:bg-green-500 text-green-500 hover:text-white
                    text-xs rounded-l flex items-center justify-center transition-all duration-200"
                  title="Paste row"
                >
                  <span className="transform translate-x-0.5 group-hover:translate-x-0 transition-transform">
                    ⎗
                  </span>
                </button>
              )}
              <div className="relative">
                <button
                  onClick={() => setShowRowMenu(rowIndex)}
                  onBlur={() => setTimeout(() => setShowRowMenu(null), 100)}
                  className="h-8 w-6 group relative opacity-0 hover:opacity-100 
                    bg-red-100 hover:bg-red-500 text-red-500 hover:text-white"
                  title="Delete options"
                >
                  <span className="transform translate-x-0.5 group-hover:translate-x-0">
                    ×
                  </span>
                </button>
                {showRowMenu === rowIndex && (
                  <div className="absolute left-full top-0 ml-1 w-32 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-10">
                    <button
                      onClick={() => {
                        onRowClear?.(rowIndex);
                        setShowRowMenu(null);
                      }}
                      className="w-full px-3 py-1 text-left text-sm hover:bg-gray-100 text-gray-700"
                    >
                      Clear data
                    </button>
                    <button
                      onClick={() => {
                        onRowRemove?.(rowIndex);
                        setShowRowMenu(null);
                      }}
                      className="w-full px-3 py-1 text-left text-sm hover:bg-gray-100 text-gray-700"
                    >
                      Remove row
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Grid */}
        <div
          className="grid gap-0.5 border border-gray-200 p-0.5 rounded mt-1"
          style={{
            gridTemplateColumns: `repeat(${dimensions.width}, 2rem)`,
          }}
        >
          {palette.map((color, index) => (
            <button
              key={index}
              onClick={() => onCellClick(index)}
              className="aspect-square hover:ring-2 hover:ring-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
              style={{ backgroundColor: color }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
