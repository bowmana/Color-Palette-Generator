import type { ReactNode } from 'react';

// Dimensions interface
export interface Dimensions {
  width: number;
  height: number;
}

// Tool type
export type Tool =
  | "paint"
  | "select"
  | "multiselect"
  | "boxselect"
  | "ropeselect"
  | "lock"
  | "lockselected"
  | "unlockselected"
  | "boxlock"
  | "ropelock"
  | "lockall"
  | "unlockall"
  | "fillall"
  | "fillselected"
  | "fillrow"
  | "fillcolumn"
  | "rowselect"
  | "columnselect"
  | "transform"
  | "move"
  | "rotateLeft90"
  | "rotateRight90";

// AppState interface
export interface AppState {
  dimensions: Dimensions;
  palette: string[];
  selectedColor: string;
  selectedTool: Tool;
  selectedCell: number | null;
  selectedCells: number[];
  copiedCells: { indices: number[]; colors: string[] } | null;
  copiedColumn: number | null;
  copiedRow: number | null;
  lockedCells: number[];
}

// ToolGroup interface
export interface ToolGroup {
  name: string;
  tools: {
    id: Tool;
    icon: ReactNode;
    title: string;
    dropdown?: {
      id: Tool;
      key: string;
      title: string;
      icon: ReactNode;
    }[];
  }[];
}

// ColorPickerProps interface
export interface ColorPickerProps {
  color: string;
  onChange: (color: string) => void;
  selectedTool: Tool;
  onToolChange: (tool: Tool) => void;
  updateState: (state: Partial<AppState>) => void;
  dimensions: Dimensions;
  palette: string[];
  selectedCells: number[];
  lockedCells: number[];
  handleTransform: (transformType: string) => void;
}

// ExamplePalette interface
export interface ExamplePalette {
  name: string;
  dimensions: Dimensions;
  colors: string[];
}

// PaletteExamplesProps interface
export interface PaletteExamplesProps {
  onCopyPalette: (colors: string[], dimensions: Dimensions) => void;
}

// PaletteAdjustmentsProps interface
export interface PaletteAdjustmentsProps {
  palette: string[];
  onPaletteChange: (newPalette: string[]) => void;
}

// ColorValues interface
export interface ColorValues {
  h: number;
  s: number;
  l: number;
}

// CellAdjustmentsProps interface
export interface CellAdjustmentsProps {
  colors: string[];
  onColorChange: (newColor: string) => void;
}

// DimensionControlsProps interface
export interface DimensionControlsProps {
  dimensions: Dimensions;
  onDimensionsChange: (dimensions: Dimensions) => void;
}

// Direction type
export type Direction = "top" | "bottom" | "left" | "right";

// Layout type
export type Layout = "horizontal" | "vertical" | "square";

// SidebarProps interface
export interface SidebarProps {
  currentTool: Tool;
  selectedCell: number | null;
  selectedCells: number[];
  palette: string[];
  handleCellAdjustment: (index: number, newColor: string) => void;
  handleMultiCellAdjustment: (newColor: string) => void;
  updateState: (updates: Partial<AppState>) => void;
  handleCopyPalette: (colors: string[], newDimensions: Dimensions) => void;
}

// Add ColumnControlsProps interface
export interface ColumnControlsProps {
  width: number;
  copiedColumn: number | null;
  onColumnHover: (columnIndex: number) => void;
  onHoverEnd: () => void;
  onColumnSelect: (columnIndex: number, event?: React.MouseEvent) => void;
}

// Add GridControlsProps interface
export interface GridControlsProps {
  onPop: (direction: Direction) => void;
  onTransform: (layout: Layout) => void;
  dimensions: Dimensions;
}

// Add PaletteGridProps interface
export interface PaletteGridProps {
  dimensions: Dimensions;
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
  copiedCells?: { indices: number[]; colors: string[] } | null;
  updateState: (updates: Partial<AppState>) => void;
  lockedCells: number[];
  onToolChange: (tool: Tool | null) => void;
}
