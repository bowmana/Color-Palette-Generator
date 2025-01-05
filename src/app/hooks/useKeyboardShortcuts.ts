// import { useEffect } from "react";

// export function useKeyboardShortcuts(undo: () => void, redo: () => void) {
//   useEffect(() => {
//     const handleKeyDown = (e: KeyboardEvent) => {
//       if ((e.ctrlKey || e.metaKey) && e.key === 'z') {
//         e.preventDefault();
//         undo();
//       }
//       if ((e.ctrlKey || e.metaKey) && e.key === 'y') {
//         e.preventDefault();
//         redo();
//       }
//     };
//     window.addEventListener('keydown', handleKeyDown);
//     return () => window.removeEventListener('keydown', handleKeyDown);
//   }, [undo, redo]);
// } 