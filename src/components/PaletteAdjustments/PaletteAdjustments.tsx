import { useState, useCallback, useEffect } from "react";
import { TinyColor } from "@ctrl/tinycolor";

interface PaletteAdjustmentsProps {
  palette: string[];
  onPaletteChange: (newPalette: string[]) => void;
}

interface ColorValues {
  h: number;
  s: number;
  l: number;
}

const getColorValues = (hex: string): ColorValues => {
  console.log(hex);

  const color = new TinyColor(hex);
  console.log(color);

  const { h, s, l } = color.toHsl();
  return { h, s, l };
};

export function PaletteAdjustments({
  palette,
  onPaletteChange,
}: PaletteAdjustmentsProps) {
  const [adjustments, setAdjustments] = useState({
    hue: 0,
    saturation: 0,
    lightness: 0,
  });

  // Update originalColors whenever palette changes
  const [originalColors, setOriginalColors] = useState(() =>
    palette.map((color) => getColorValues(color))
  );

  useEffect(() => {
    setOriginalColors(palette.map((color) => getColorValues(color)));
  }, [palette]);

  const adjustColor = useCallback(
    (hex: string, index: number) => {
      const original = originalColors[index];
      if (!original) return hex;

      if (
        adjustments.hue === 0 &&
        adjustments.saturation === 0 &&
        adjustments.lightness === 0
      ) {
        return hex;
      }

      const color = new TinyColor(hex);
      let { h, s, l } = color.toHsl();

      // Adjust hue (always safe as it wraps around 360)
      h = (h + adjustments.hue) % 360;

      // Adjust saturation with bounds checking
      if (adjustments.saturation > 0) {
        // Can only increase up to 100%
        s = Math.min(1, s + adjustments.saturation / 100);
      } else {
        // Can only decrease down to 0%
        s = Math.max(0, s + adjustments.saturation / 100);
      }

      // Adjust lightness with bounds checking
      if (adjustments.lightness > 0) {
        // Can only increase up to 100%
        l = Math.min(1, l + adjustments.lightness / 100);
      } else {
        // Can only decrease down to 0%
        l = Math.max(0, l + adjustments.lightness / 100);
      }

      return new TinyColor({ h, s, l }).toHexString();
    },
    [adjustments, originalColors]
  );

  const handleSliderChange = useCallback(
    (name: string, value: number) => {
      setAdjustments((prev) => ({ ...prev, [name]: value }));
      const newPalette = palette.map((color, index) =>
        adjustColor(color, index)
      );
      onPaletteChange(newPalette);
    },
    [palette, adjustColor, onPaletteChange]
  );

  return (
    <div className="space-y-6 bg-white p-6 rounded-lg border border-gray-200">
      <h2 className="text-lg font-medium text-gray-900">Palette Adjustments</h2>
      <div className="space-y-4">
        <div className="color-slider">
          <div className="flex justify-between">
            <label className="text-sm font-medium text-gray-700">Hue</label>
            <span className="text-sm text-gray-500">{adjustments.hue}°</span>
          </div>
          <input
            type="range"
            min="0"
            max="360"
            value={adjustments.hue}
            onChange={(e) =>
              handleSliderChange("hue", parseInt(e.target.value))
            }
            className="w-full"
            style={{
              background: `linear-gradient(to right, 
                hsl(0, ${adjustments.saturation}%, ${adjustments.lightness}%), 
                hsl(360, ${adjustments.saturation}%, ${adjustments.lightness}%))`,
            }}
          />
        </div>

        <div className="color-slider">
          <div className="flex justify-between">
            <label className="text-sm font-medium text-gray-700">
              Saturation
            </label>
            <span className="text-sm text-gray-500">
              {adjustments.saturation}%
            </span>
          </div>
          <input
            type="range"
            min="-100"
            max="100"
            value={adjustments.saturation}
            onChange={(e) =>
              handleSliderChange("saturation", parseInt(e.target.value))
            }
            className="w-full"
            style={{
              background: `linear-gradient(to right, 
                hsl(${adjustments.hue}, 0%, ${adjustments.lightness}%), 
                hsl(${adjustments.hue}, 100%, ${adjustments.lightness}%))`,
            }}
          />
        </div>

        <div className="color-slider">
          <div className="flex justify-between">
            <label className="text-sm font-medium text-gray-700">
              Lightness
            </label>
            <span className="text-sm text-gray-500">
              {adjustments.lightness}%
            </span>
          </div>
          <input
            type="range"
            min="-100"
            max="100"
            value={adjustments.lightness}
            onChange={(e) =>
              handleSliderChange("lightness", parseInt(e.target.value))
            }
            className="w-full"
            style={{
              background: `linear-gradient(to right, 
                hsl(${adjustments.hue}, ${adjustments.saturation}%, 0%), 
                hsl(${adjustments.hue}, ${adjustments.saturation}%, 100%))`,
            }}
          />
        </div>

        <button
          onClick={() => {
            const resetValues = { hue: 0, saturation: 0, lightness: 0 };
            setAdjustments(resetValues);
            onPaletteChange(palette);
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
