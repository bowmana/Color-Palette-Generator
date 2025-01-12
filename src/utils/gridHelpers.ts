import { Direction, Dimensions } from "@/app/types";

export function reshapeGrid(
  colors: string[],
  oldDimensions: Dimensions,
  newDimensions: Dimensions
): string[] {
  const newGrid: string[] = [];

  // Calculate minimum dimensions
  const minHeight = Math.min(oldDimensions.height, newDimensions.height);
  const minWidth = Math.min(oldDimensions.width, newDimensions.width);

  // Fill new grid with white initially
  for (let i = 0; i < newDimensions.width * newDimensions.height; i++) {
    newGrid[i] = "#ffffff";
  }

  // Copy existing colors that fit within new dimensions
  for (let y = 0; y < minHeight; y++) {
    for (let x = 0; x < minWidth; x++) {
      const oldIndex = y * oldDimensions.width + x;
      const newIndex = y * newDimensions.width + x;
      newGrid[newIndex] = colors[oldIndex];
    }
  }

  return newGrid;
}

export function popGridSection(
  colors: string[],
  dimensions: Dimensions,
  direction: Direction
): {
  newColors: string[];
  newDimensions: Dimensions;
} {
  let newWidth = dimensions.width;
  let newHeight = dimensions.height;
  const newColors: string[] = [...colors];

  switch (direction) {
    case "left":
    case "right":
      if (dimensions.width <= 1)
        return { newColors, newDimensions: dimensions };
      newWidth--;
      break;
    case "top":
    case "bottom":
      if (dimensions.height <= 1)
        return { newColors, newDimensions: dimensions };
      newHeight--;
      break;
  }

  const tempGrid: string[] = [];

  for (let y = 0; y < newHeight; y++) {
    for (let x = 0; x < newWidth; x++) {
      let sourceX = x;
      let sourceY = y;

      if (direction === "right") sourceX = x;
      if (direction === "left") sourceX = x + 1;
      if (direction === "bottom") sourceY = y;
      if (direction === "top") sourceY = y + 1;

      const newIndex = y * newWidth + x;
      const oldIndex = sourceY * dimensions.width + sourceX;
      tempGrid[newIndex] = colors[oldIndex];
    }
  }

  return {
    newColors: tempGrid,
    newDimensions: { width: newWidth, height: newHeight },
  };
}
