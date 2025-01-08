import { DimensionControlsProps } from "@/app/types";

const PRESET_TOTAL_CELLS = [
  { name: "16 cells", total: 16 },
  { name: "32 cells", total: 32 },
  { name: "64 cells", total: 64 },
  { name: "128 cells", total: 128 },
  { name: "256 cells", total: 256 },
] as const;

export function DimensionControls({
  dimensions,
  onDimensionsChange,
}: DimensionControlsProps) {
  // Helper to get the default square-like dimensions for a total
  const getDefaultDimensions = (total: number) => {
    const sqrt = Math.sqrt(total);
    const width = Math.ceil(sqrt);
    const height = Math.ceil(total / width);
    return { width, height };
  };

  const handlePresetClick = (total: number) => {
    const defaultDims = getDefaultDimensions(total);
    onDimensionsChange(defaultDims);
  };

  const handleCustomChange = (axis: "width" | "height", value: string) => {
    const numValue = parseInt(value, 10);
    if (!isNaN(numValue) && numValue > 0 && numValue <= 256) {
      onDimensionsChange({
        ...dimensions,
        [axis]: numValue,
      });
    }
  };

  const currentTotal = dimensions.width * dimensions.height;

  return (
    <div className="mb-6 space-y-4">
      <div className="space-y-2">
        <h2 className="text-sm font-medium text-gray-700">
          Grid Size & Layout
        </h2>
        <div className="flex gap-4 items-start">
          {/* Preset Cell Counts */}
          <div className="flex-1 flex flex-wrap gap-2">
            {PRESET_TOTAL_CELLS.map((preset) => (
              <button
                key={preset.name}
                onClick={() => handlePresetClick(preset.total)}
                className={`px-4 py-2 text-sm rounded-lg transition-colors
                  ${
                    currentTotal === preset.total
                      ? "bg-blue-500 text-white"
                      : "bg-gray-100 hover:bg-gray-200 text-gray-800"
                  }`}
              >
                {preset.name}
              </button>
            ))}
          </div>

          {/* Layout Selection */}
          <select
            value={
              dimensions.height === 1
                ? "horizontal"
                : dimensions.width === 1
                ? "vertical"
                : "square"
            }
            onChange={(e) => {
              const layout = e.target.value;
              if (layout === "horizontal") {
                onDimensionsChange({ width: currentTotal, height: 1 });
              } else if (layout === "vertical") {
                onDimensionsChange({ width: 1, height: currentTotal });
              } else {
                onDimensionsChange(getDefaultDimensions(currentTotal));
              }
            }}
            className="px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm"
          >
            <option value="horizontal">Horizontal Layout</option>
            <option value="vertical">Vertical Layout</option>
            <option value="square">Square-like Layout</option>
          </select>
        </div>
      </div>

      {/* Custom Layout */}
      <div className="space-y-2">
        <h2 className="text-sm font-medium text-gray-700">Custom Layout</h2>
        <div className="flex gap-4 items-center">
          <div className="flex items-center gap-2">
            <label htmlFor="width" className="text-sm font-medium">
              Width:
            </label>
            <input
              id="width"
              type="number"
              min="1"
              max="512"
              value={dimensions.width}
              onChange={(e) => handleCustomChange("width", e.target.value)}
              className="w-20 px-2 py-1 border border-gray-300 rounded text-sm"
            />
          </div>

          <div className="flex items-center gap-2">
            <label htmlFor="height" className="text-sm font-medium">
              Height:
            </label>
            <input
              id="height"
              type="number"
              min="1"
              max="512"
              value={dimensions.height}
              onChange={(e) => handleCustomChange("height", e.target.value)}
              className="w-20 px-2 py-1 border border-gray-300 rounded text-sm"
            />
          </div>

          <div className="text-sm text-gray-500">
            Total Cells: {currentTotal}
          </div>
        </div>
      </div>
    </div>
  );
}
