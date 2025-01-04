import { useState, useEffect } from "react";
import { TinyColor } from "@ctrl/tinycolor";
import { CellAdjustmentsProps } from "@/app/types";

export function CellAdjustments({ colors, onColorChange }: CellAdjustmentsProps) {
  const [adjustments, setAdjustments] = useState({
    hue: 0,
    saturation: 0,
    lightness: 0,
  });

  // Reset adjustments when selected color changes
  useEffect(() => {
    setAdjustments({ hue: 0, saturation: 0, lightness: 0 });
  }, [colors]);

  const handleAdjustment = (name: string, value: number) => {
    const newAdjustments = { ...adjustments, [name]: value };
    setAdjustments(newAdjustments);

    const tinyColor = new TinyColor(colors[0]);
    const { h, s, l } = tinyColor.toHsl();

    // Apply adjustments
    const newColor = new TinyColor({
      h: (h + newAdjustments.hue) % 360,
      s: Math.max(0, Math.min(1, s + newAdjustments.saturation / 100)),
      l: Math.max(0, Math.min(1, l + newAdjustments.lightness / 100)),
    });

    onColorChange(newColor.toHexString());
  };

  return (
    <div className="space-y-6 bg-white p-6 rounded-lg border border-gray-200">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-medium text-gray-900">
          {colors.length > 1 ? 'Multiple Cells Selected' : 'Cell Adjustment'}
        </h2>
        <div className="flex items-center gap-2">
          {colors.length === 1 ? (
            <>
              <div
                className="w-6 h-6 rounded border border-gray-200"
                style={{ backgroundColor: colors[0] }}
              />
              <span className="text-sm font-mono text-gray-600">{colors[0]}</span>
            </>
          ) : (
            <span className="text-sm text-gray-600">
              {colors.length} cells selected
            </span>
          )}
        </div>
      </div>
      
      <div className="space-y-4">
        <div className="color-slider">
          <div className="flex justify-between mb-2">
            <label className="text-sm font-medium text-gray-700">Hue</label>
            <span className="text-sm text-gray-500">{adjustments.hue}°</span>
          </div>
          <input
            type="range"
            min="-180"
            max="180"
            value={adjustments.hue}
            onChange={(e) => handleAdjustment("hue", parseInt(e.target.value))}
            className="w-full h-2 bg-gradient-to-r from-red-500 via-yellow-500 via-green-500 via-blue-500 to-red-500 rounded-lg appearance-none cursor-pointer"
          />
        </div>

        <div className="color-slider">
          <div className="flex justify-between mb-2">
            <label className="text-sm font-medium text-gray-700">Saturation</label>
            <span className="text-sm text-gray-500">{adjustments.saturation}%</span>
          </div>
          <input
            type="range"
            min="-100"
            max="100"
            value={adjustments.saturation}
            onChange={(e) => handleAdjustment("saturation", parseInt(e.target.value))}
            className="w-full h-2 bg-gradient-to-r from-gray-400 to-blue-500 rounded-lg appearance-none cursor-pointer"
            style={{
              background: `linear-gradient(to right, 
                hsl(${adjustments.hue}, 0%, 50%), 
                hsl(${adjustments.hue}, 100%, 50%))`,
            }}
          />
        </div>

        <div className="color-slider">
          <div className="flex justify-between mb-2">
            <label className="text-sm font-medium text-gray-700">Lightness</label>
            <span className="text-sm text-gray-500">{adjustments.lightness}%</span>
          </div>
          <input
            type="range"
            min="-100"
            max="100"
            value={adjustments.lightness}
            onChange={(e) => handleAdjustment("lightness", parseInt(e.target.value))}
            className="w-full h-2 bg-gradient-to-r from-black via-gray-500 to-white rounded-lg appearance-none cursor-pointer"
          />
        </div>

        <button
          onClick={() => {
            setAdjustments({ hue: 0, saturation: 0, lightness: 0 });
            onColorChange(colors[0]); // Reset to original color
          }}
          className="w-full px-4 py-2 bg-gray-100 text-gray-700 rounded-md 
            hover:bg-gray-200 transition-colors text-sm font-medium"
        >
          Reset Adjustments
        </button>
      </div>
    </div>
  );
}
