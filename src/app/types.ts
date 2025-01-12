import type { ReactNode } from 'react';
import { useToolActions } from './hooks/useToolActions';
import { useGridTransformActions } from './hooks/useGridTransformActions';
import { useSelectionActions } from './hooks/useSelectionActions';
import { useLockActions } from './hooks/useLockActions';

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

export type CoreState = {
  dimensions: { width: number; height: number };
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

export type UIState = {
  previewPalette: string[] | null;
  tempSelectedCells: number[];
  tempLockedCells: number[];
  isSelecting: boolean;
  isLocking: boolean;
  selectionStart: number | null;
  lockStart: number | null;
  ropePoints: number[];
  lockRopePoints: number[];
  rotationPreview: string[] | null;
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




export interface SelectionActionsBarProps {
  selectedCellsCount: number;
  onCopy: () => void;
  onClearCells: () => void;
  onClearSelection: () => void;
}

export interface RowControlsProps {
  height: number;
  copiedRow: number | null;
  onRowHover: (rowIndex: number) => void;
  onHoverEnd: () => void;
  onRowSelect: (rowIndex: number, event?: React.MouseEvent) => void;
}
export interface GridCellsProps {
  dimensions: { width: number; height: number };
  palette: string[];
  previewPalette?: string[] | null;
  rotationPreview?: string[] | null;
  lockedCells: number[];
  selectedTool: string | null;
  selectedCell: number | null;
  selectedCells: number[];
  tempSelectedCells: number[];
  tempLockedCells: number[];
  handleCellClick: (index: number, e: React.MouseEvent) => void;
  handleMouseDown: (index: number, e: React.MouseEvent) => void;
  handleMouseMove: (index: number) => void;
  handleMouseUp: (e: React.MouseEvent) => void;
  handleCellHover: (index: number) => void;
  handleHoverEnd: () => void;
  isSelecting: boolean;
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


// Direction type
export type Direction = "top" | "bottom" | "left" | "right";


// Add ColumnControlsProps interface
export interface ColumnControlsProps {
  width: number;
  copiedColumn: number | null;
  onColumnHover: (columnIndex: number) => void;
  onHoverEnd: () => void;
  onColumnSelect: (columnIndex: number, event?: React.MouseEvent) => void;
}


export interface ColumnPopControlsProps {
  width: number;
  height: number;
  onColumnPop: (columnIndex: number) => void;
}

export interface RowPopControlsProps {
  width: number;
  height: number;
  onRowPop: (rowIndex: number) => void;
}


export type PaletteContextType = {
  state: CoreState;
  uiState: UIState;
  actions: {
    tool: ReturnType<typeof useToolActions>;
    grid: ReturnType<typeof useGridTransformActions>;
    selection: ReturnType<typeof useSelectionActions>;
    lock: ReturnType<typeof useLockActions>;
  };
  history: {
    undo: () => void;
    redo: () => void;
    canUndo: boolean;
    canRedo: boolean;
  };
  updateState: (updates: Partial<CoreState>) => void;
  setUIState: React.Dispatch<React.SetStateAction<UIState>>;
};