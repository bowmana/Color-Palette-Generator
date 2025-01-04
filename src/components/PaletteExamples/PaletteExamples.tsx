import { useRef } from "react";
import { ExamplePalette, PaletteExamplesProps } from "@/app/types";

const EXAMPLE_PALETTES: ExamplePalette[] = [
  {
    name: "Sunset Gradient",
    dimensions: { width: 4, height: 4 },
    colors: [
      "#FF6B6B", "#FF8E72", "#FFA07A", "#FFB88C",
      "#FF9E9E", "#FFA785", "#FFB494", "#FFC5A3",
      "#FFD1D1", "#FFC0A8", "#FFD1B8", "#FFD8C4",
      "#FFE9E9", "#FFD8CB", "#FFE4D6", "#FFF0E6"
    ],
  },
  {
    name: "Ocean Blues",
    dimensions: { width: 4, height: 4 },
    colors: [
      "#001F3F", "#083358", "#0F4C81", "#1665AA",
      "#003366", "#0A4A7F", "#1162A8", "#1D7FD1",
      "#004D99", "#0C61A6", "#1379CF", "#24A6F8",
      "#0066CC", "#0E78CD", "#158AF6", "#2BBFFF"
    ],
  },
];

const MORE_EXAMPLE_PALETTES: ExamplePalette[] = [
  {
    name: "Forest Greens",
    dimensions: { width: 4, height: 4 },
    colors: [
      "#1B4332", "#2D6A4F", "#40916C", "#52B788",
      "#2D5A27", "#3E8948", "#4FA660", "#74C69D",
      "#3F7119", "#50943A", "#61B75B", "#95D5B2",
      "#518B1C", "#62AF2F", "#73D34D", "#B7E4C7"
    ],
  },
  {
    name: "Desert Sands",
    dimensions: { width: 4, height: 4 },
    colors: [
      "#C2B280", "#D4C292", "#E6D2A4", "#F8E2B6",
      "#B1A374", "#C3B486", "#D5C598", "#E7D6AA",
      "#A09468", "#B2A57A", "#C4B68C", "#D6C79E",
      "#8F8558", "#A1966A", "#B3A77C", "#C5B88E"
    ],
  },
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
