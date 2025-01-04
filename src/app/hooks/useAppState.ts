import { useState } from "react";
import { AppState } from "@/app/types";

export function useAppState(initialState: AppState) {
  const [state, setState] = useState<AppState>(initialState);

  const updateState = (updates: Partial<AppState>) => {
    setState((prevState) => ({ ...prevState, ...updates }));
  };

  return { state, updateState };
} 