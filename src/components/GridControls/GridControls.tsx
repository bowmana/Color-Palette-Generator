import {GridControlsProps } from "@/app/types";



export function GridControls({
  onPop,
  onTransform,
  dimensions,
}: GridControlsProps) {
  const totalCells = dimensions.width * dimensions.height;

  return (
    <div className="space-y-4 mb-4">
      {/* Transform Controls Section */}
      <div className="space-y-2">
        <h2 className="text-sm font-medium text-gray-700">Transform Layout</h2>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => onTransform("horizontal")}
            className={`px-3 py-1 text-sm rounded transition-colors ${
              dimensions.height === 1
                ? "bg-blue-500 text-white"
                : "bg-gray-100 hover:bg-gray-200"
            }`}
          >
            1×{totalCells}
          </button>
          <button
            onClick={() => onTransform("vertical")}
            className={`px-3 py-1 text-sm rounded transition-colors ${
              dimensions.width === 1
                ? "bg-blue-500 text-white"
                : "bg-gray-100 hover:bg-gray-200"
            }`}
          >
            {totalCells}×1
          </button>
          <button
            onClick={() => onTransform("square")}
            className="px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 rounded"
          >
            Square-like
          </button>
        </div>
      </div>

      {/* Pop Controls Section */}
      <div className="space-y-2">
        <h2 className="text-sm font-medium text-gray-700">
          Remove Rows/Columns
        </h2>
        <div className="flex justify-between items-center">
          <button
            onClick={() => onPop("left")}
            disabled={dimensions.width <= 1}
            className="px-3 py-1 bg-gray-100 rounded hover:bg-gray-200 disabled:opacity-50"
          >
            Pop Left
          </button>
          <button
            onClick={() => onPop("right")}
            disabled={dimensions.width <= 1}
            className="px-3 py-1 bg-gray-100 rounded hover:bg-gray-200 disabled:opacity-50"
          >
            Pop Right
          </button>
        </div>
        <div className="flex justify-between items-center">
          <button
            onClick={() => onPop("top")}
            disabled={dimensions.height <= 1}
            className="px-3 py-1 bg-gray-100 rounded hover:bg-gray-200 disabled:opacity-50"
          >
            Pop Top
          </button>
          <button
            onClick={() => onPop("bottom")}
            disabled={dimensions.height <= 1}
            className="px-3 py-1 bg-gray-100 rounded hover:bg-gray-200 disabled:opacity-50"
          >
            Pop Bottom
          </button>
        </div>
      </div>
    </div>
  );
}
