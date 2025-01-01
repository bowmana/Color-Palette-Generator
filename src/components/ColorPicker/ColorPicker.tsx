import { HexColorPicker } from "react-colorful";

interface ColorPickerProps {
  color: string;
  onChange: (color: string) => void;
}

export function ColorPicker({ color, onChange }: ColorPickerProps) {
  return (
    <div className="flex flex-col gap-4">
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
