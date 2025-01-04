import { AppState } from "@/app/page";
import { useState } from "react";
import { HexColorPicker } from "react-colorful";

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
  | "columnselect";

interface ToolGroup {
  name: string;
  tools: {
    id: Tool;
    icon: React.ReactNode;
    title: string;
  }[];
}

export interface ColorPickerProps {
  color: string;
  onChange: (color: string) => void;
  selectedTool: Tool;
  onToolChange: (tool: Tool) => void;
  updateState: (state: Partial<AppState>) => void;
  dimensions: { width: number; height: number };
  palette: string[];
  selectedCells: number[];
  lockedCells: number[];
}

export function ColorPicker({ 
  color, 
  onChange, 
  selectedTool, 
  onToolChange, 
  updateState, 
  dimensions,
  palette,
  selectedCells,
  lockedCells 
}: ColorPickerProps) {
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  const toolGroups: ToolGroup[] = [
    {
      name: "Basic",
      tools: [
        {
          id: "paint",
          title: "Paint Tool",
          icon: (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
              d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" 
            />
          ),
        },
        {
          id: "fillall",
          title: "Fill All",
          icon: (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
              d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" 
            />
          ),
        },
        {
          id: "fillselected",
          title: "Fill Selected",
          icon: (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
              d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" 
            />
          ),
        },
        {
          id: "fillrow",
          title: "Fill Row",
          icon: (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
              d="M4 7h16M4 12h16" 
            />
          ),
        },
        {
          id: "fillcolumn",
          title: "Fill Column",
          icon: (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
              d="M12 4v16M7 4v16" 
            />
          ),
        },
      ],
    },
    {
      name: "Selection",
      tools: [
        {
          id: "select",
          title: "Single Select",
          icon: (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
              d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" 
            />
          ),
        },
        {
          id: "multiselect",
          title: "Select/Unselect Tool",
          icon: (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
              d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" 
            />
          ),
        },
        {
          id: "rowselect",
          title: "Row Select",
          icon: (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
              d="M4 7h16M4 12h16" 
            />
          ),
        },
        {
          id: "columnselect",
          title: "Column Select",
          icon: (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
              d="M12 4v16M7 4v16" 
            />
          ),
        },
        {
          id: "boxselect",
          title: "Box Select",
          icon: (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
              d="M4 4h16v16H4z" 
            />
          ),
        },
        {
          id: "ropeselect",
          title: "Rope Select",
          icon: (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
              d="M12 4v16M4 12h16" 
            />
          ),
        },
      ],
    },
    {
      name: "Utility",
      tools: [
        {
          id: "lock",
          title: "Lock/Unlock Tool",
          icon: (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
              d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" 
            />
          ),
        },
        {
          id: "lockselected",
          title: "Lock Selected",
          icon: (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
              d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2 M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2z" 
            />
          ),
        },
        {
          id: "unlockselected",
          title: "Unlock Selected",
          icon: (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
              d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2 M8 11V7a4 4 0 118 0m-4 8v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2z" 
            />
          ),
        },
        {
          id: "boxlock",
          title: "Box Lock Tool",
          icon: (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
              d="M4 4h16v16H4z M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2z" 
            />
          ),
        },
        {
          id: "ropelock",
          title: "Rope Lock Tool",
          icon: (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
              d="M12 4v16M4 12h16 M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2z" 
            />
          ),
        },
        {
          id: "lockall",
          title: "Lock All",
          icon: (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
              d="M8 11V7a4 4 0 118 0v4m-4 5v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2z" 
            />
          ),
        },
        {
          id: "unlockall",
          title: "Unlock All",
          icon: (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
              d="M8 11V7a4 4 0 118 0m-4 8v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2z" 
            />
          ),
        }
      ],
    },
  ];

  const handleToolClick = (toolId: Tool) => {
    if (toolId === "lockselected" && selectedCells.length > 0) {
      const newLockedCells = [...new Set([...lockedCells, ...selectedCells])];
      updateState({ lockedCells: newLockedCells });
      return;
    }
    if (toolId === "unlockselected" && selectedCells.length > 0) {
      const newLockedCells = lockedCells.filter(cell => !selectedCells.includes(cell));
      updateState({ lockedCells: newLockedCells });
      return;
    }
    if (toolId === "lockall") {
      const allCells = Array.from({ length: dimensions.width * dimensions.height }, (_, i) => i);
      updateState({ lockedCells: allCells });
      return;
    } else if (toolId === "unlockall") {
      updateState({ lockedCells: [] });
      return;
    } else if (toolId === "fillall") {
      const newPalette = palette.map((_, i) => 
        lockedCells.includes(i) ? palette[i] : color
      );
      updateState({ palette: newPalette });
      return;
    } else if (toolId === "fillselected") {
      const newPalette = [...palette];
      selectedCells.forEach(index => {
        if (!lockedCells.includes(index)) {
          newPalette[index] = color;
        }
      });
      updateState({ palette: newPalette });
      return;
    } else if (toolId === "fillrow") {
      onToolChange(toolId);
      setOpenDropdown(null);
      return;
    } else if (toolId === "fillcolumn") {
      onToolChange(toolId);
      setOpenDropdown(null);
      return;
    }
    onToolChange(toolId);
    setOpenDropdown(null);
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex gap-2 mb-2">
        {toolGroups.map((group) => (
          <div key={group.name} className="relative">
            <button
              onClick={() => setOpenDropdown(openDropdown === group.name ? null : group.name)}
              className={`p-2 rounded-lg transition-colors ${
                group.tools.some(tool => tool.id === selectedTool)
                  ? "bg-blue-500 text-white"
                  : "bg-gray-100 hover:bg-gray-200 text-gray-700"
              }`}
              title={group.name}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {group.tools.find(tool => tool.id === selectedTool)?.icon || group.tools[0].icon}
              </svg>
            </button>
            
            {openDropdown === group.name && (
              <div className="absolute top-full left-0 mt-1 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-10">
                {group.tools.map((tool) => (
                  <button
                    key={tool.id}
                    onClick={() => handleToolClick(tool.id)}
                    className={`w-full flex items-center gap-2 px-3 py-2 hover:bg-gray-50 ${
                      selectedTool === tool.id ? "bg-blue-50 text-blue-600" : "text-gray-700"
                    }`}
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      {tool.icon}
                    </svg>
                    <span className="text-sm whitespace-nowrap">{tool.title}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
      
      <div className="p-4 bg-white rounded-lg shadow-sm border border-gray-200">
        <HexColorPicker color={color} onChange={onChange} />
      </div>
    </div>
  );
}
