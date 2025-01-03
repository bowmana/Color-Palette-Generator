import { HexColorPicker } from "react-colorful";

export type Tool = "paint" | "select" | "multiselect";

interface ColorPickerProps {
  color: string;
  onChange: (color: string) => void;
  selectedTool: Tool;
  onToolChange: (tool: Tool) => void;
}

export function ColorPicker({ color, onChange, selectedTool, onToolChange }: ColorPickerProps) {
  return (
    <div className="flex flex-col gap-4">
      {/* Tool Selection */}
      <div className="flex gap-2 mb-2">
        <button
          onClick={() => onToolChange("paint")}
          className={`p-2 rounded-lg transition-colors ${
            selectedTool === "paint"
              ? "bg-blue-500 text-white"
              : "bg-gray-100 hover:bg-gray-200 text-gray-700"
          }`}
          title="Paint Tool"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
          </svg>
        </button>
        <button
          onClick={() => onToolChange("select")}
          className={`p-2 rounded-lg transition-colors ${
            selectedTool === "select"
              ? "bg-blue-500 text-white"
              : "bg-gray-100 hover:bg-gray-200 text-gray-700"
          }`}
          title="Select Tool"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" />
          </svg>
        </button>
        <button
          onClick={() => onToolChange("multiselect")}
          className={`p-2 rounded-lg transition-colors ${
            selectedTool === "multiselect"
              ? "bg-blue-500 text-white"
              : "bg-gray-100 hover:bg-gray-200 text-gray-700"
          }`}
          title="Multi-Select Tool"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
        </button>
      </div>

      <HexColorPicker color={color} onChange={onChange} />
      <div className="flex items-center gap-2">
        <div
          className="w-6 h-6 border border-gray-200 rounded"
          style={{ backgroundColor: color }}
        />
        <span className="font-mono text-sm">{color}</span>
      </div>
    </div>
  );
}
