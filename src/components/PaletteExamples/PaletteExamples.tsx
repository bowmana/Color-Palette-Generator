import { useRef } from "react";

interface ExamplePalette {
  name: string;
  dimensions: { width: number; height: number };
  colors: string[];
}

interface PaletteExamplesProps {
  onCopyPalette: (
    colors: string[],
    dimensions: { width: number; height: number }
  ) => void;
}

const EXAMPLE_PALETTES: ExamplePalette[] = [
  {
    name: "Sunset Gradient",
    dimensions: { width: 8, height: 1 },
    colors: [
      "#FF6B6B",
      "#FF8E72",
      "#FFB88C",
      "#FFD8A8",
      "#FFF3E0",
      "#FFE0B2",
      "#FFCC80",
      "#FFA726",
    ],
  },
  {
    name: "Ocean Blues",
    dimensions: { width: 4, height: 2 },
    colors: [
      "#E3F2FD",
      "#90CAF9",
      "#42A5F5",
      "#1E88E5",
      "#1565C0",
      "#0D47A1",
      "#01579B",
      "#014377",
    ],
  },
  {
    name: "Forest Greens",
    dimensions: { width: 2, height: 4 },
    colors: [
      "#E8F5E9",
      "#A5D6A7",
      "#66BB6A",
      "#43A047",
      "#2E7D32",
      "#1B5E20",
      "#004D40",
      "#00251A",
    ],
  },
];

// Add more example palettes
const MORE_EXAMPLE_PALETTES: ExamplePalette[] = [
  {
    name: "Autumn Warmth",
    dimensions: { width: 4, height: 2 },
    colors: [
      "#D84315",
      "#F4511E",
      "#FF7043",
      "#FF8A65",
      "#795548",
      "#8D6E63",
      "#A1887F",
      "#BCAAA4",
    ],
  },
  // Add more examples here...
];

export function PaletteExamples({ onCopyPalette }: PaletteExamplesProps) {
  const moreExamplesRef = useRef<HTMLDivElement>(null);

  const scrollToMore = () => {
    moreExamplesRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  return (
    <div className="space-y-6">
      <h2 className="text-lg font-medium text-gray-900">Example Palettes</h2>

      {/* Featured Examples */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-1">
        {EXAMPLE_PALETTES.map((example) => (
          <div
            key={example.name}
            className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex justify-between items-start mb-3">
              <h3 className="font-medium text-gray-700">{example.name}</h3>
              <button
                onClick={() =>
                  onCopyPalette(example.colors, example.dimensions)
                }
                className="text-sm px-3 py-1 bg-blue-100 hover:bg-blue-500 text-blue-500 hover:text-white rounded transition-colors"
              >
                Use Palette
              </button>
            </div>

            <div
              className="grid gap-0.5 border border-gray-200 p-0.5 rounded"
              style={{
                gridTemplateColumns: `repeat(${example.dimensions.width}, 1fr)`,
              }}
            >
              {example.colors.map((color, index) => (
                <div
                  key={index}
                  className="aspect-square"
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>

            <div className="mt-2 text-sm text-gray-500">
              {example.dimensions.width}×{example.dimensions.height} grid
            </div>
          </div>
        ))}
      </div>

      {/* More Below Button */}
      <button
        onClick={scrollToMore}
        className="w-full py-3 flex flex-col items-center gap-1 text-blue-500 hover:text-blue-600 transition-colors group"
      >
        <span className="text-sm font-medium">More below</span>
        <svg
          className="w-5 h-5 animate-bounce"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 14l-7 7m0 0l-7-7m7 7V3"
          />
        </svg>
      </button>

      {/* More Examples Section */}
      <div ref={moreExamplesRef} className="pt-6">
        <h3 className="text-lg font-medium text-gray-900 mb-6">
          More Palettes
        </h3>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-1">
          {MORE_EXAMPLE_PALETTES.map((example) => (
            <div
              key={example.name}
              className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex justify-between items-start mb-3">
                <h3 className="font-medium text-gray-700">{example.name}</h3>
                <button
                  onClick={() =>
                    onCopyPalette(example.colors, example.dimensions)
                  }
                  className="text-sm px-3 py-1 bg-blue-100 hover:bg-blue-500 text-blue-500 hover:text-white rounded transition-colors"
                >
                  Use Palette
                </button>
              </div>

              <div
                className="grid gap-0.5 border border-gray-200 p-0.5 rounded"
                style={{
                  gridTemplateColumns: `repeat(${example.dimensions.width}, 1fr)`,
                }}
              >
                {example.colors.map((color, index) => (
                  <div
                    key={index}
                    className="aspect-square"
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>

              <div className="mt-2 text-sm text-gray-500">
                {example.dimensions.width}×{example.dimensions.height} grid
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
