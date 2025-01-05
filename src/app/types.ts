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

export interface PaletteToolbarProps {
  color: string;
  onChange: (color: string) => void;
  selectedTool: Tool;
  onToolChange: (tool: Tool) => void;
  updateState: (state: Partial<AppState>) => void;
  dimensions: { width: number; height: number };
  palette: string[];
  selectedCells: number[];
  lockedCells: number[];
  handleTransform: (transformType: string) => void;
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

// Basic grid configuration
interface GridConfig {
  dimensions: Dimensions;
  palette: string[];
  lockedCells: number[];
}

// Selection state and handlers
interface SelectionState {
  selectedCell: number | null;
  selectedCells: number[];
  setSelectedCell: (cell: number | null) => void;
  setSelectedCells: (cells: number[]) => void;
}

// Copy/Paste functionality
interface CopyPasteState {
  copiedCells: { indices: number[]; colors: string[] } | null;
  copiedColumn: number | null;
  copiedRow: number | null;
  onCopyCells?: (indices: number[]) => void;
  onPasteCells?: (targetIndex: number) => void;
}

// Tool-related props
interface ToolState {
  selectedColor: string;
  selectedTool: Tool | null;
  onToolChange: (tool: Tool | null) => void;
}

// Transform operations
interface TransformOperations {
  handleTransform: (transformType: string, targetIndex?: number) => void;
}

// State management
interface StateManagement {
  updateState: (updates: Partial<AppState>) => void;
}

// Grid operations
interface GridOperations {
  onColumnClear: (columnIndex: number) => void;
  onRowClear: (rowIndex: number) => void;
  onColumnCopy: (columnIndex: number) => void;
  onColumnPaste: (columnIndex: number) => void;
  onRowCopy: (rowIndex: number) => void;
  onRowPaste: (rowIndex: number) => void;
  onColumnRemove: (columnIndex: number) => void;
  onRowRemove: (rowIndex: number) => void;
  onRowSelect: (rowIndex: number, event?: React.MouseEvent) => void;
  onColumnSelect: (columnIndex: number, event?: React.MouseEvent) => void;
  setPalette?: (newPalette: string[]) => void;
}

// Main PaletteGridProps interface
export interface PaletteGridProps extends 
  GridConfig,
  SelectionState,
  CopyPasteState,
  ToolState,
  TransformOperations,
  StateManagement,
  GridOperations {
  onCellClick: (index: number) => void;
}
