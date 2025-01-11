// import { usePaletteContext } from "@/app/context/PaletteContext";

// export function GridControls() {
//   const { state, handlers } = usePaletteContext();
//   const { dimensions } = state;
//   const { handleTransform } = handlers;

//   const totalCells = dimensions.width * dimensions.height;

//   return (
//     <div className="space-y-4 mb-4">
//       {/* Transform Controls Section */}
//       <div className="space-y-2">
//         <h2 className="text-sm font-medium text-gray-700">Transform Layout</h2>
//         <div className="flex flex-wrap gap-2">
//           <button
//             onClick={() => handleTransform("horizontal")}
//             className={`px-3 py-1 text-sm rounded transition-colors ${
//               dimensions.height === 1
//                 ? "bg-blue-500 text-white"
//                 : "bg-gray-100 hover:bg-gray-200"
//             }`}
//           >
//             1×{totalCells}
//           </button>
//           <button
//             onClick={() => handleTransform("vertical")}
//             className={`px-3 py-1 text-sm rounded transition-colors ${
//               dimensions.width === 1
//                 ? "bg-blue-500 text-white"
//                 : "bg-gray-100 hover:bg-gray-200"
//             }`}
//           >
//             {totalCells}×1
//           </button>
//           <button
//             onClick={() => handleTransform("square")}
//             className="px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 rounded"
//           >
//             Square-like
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }
