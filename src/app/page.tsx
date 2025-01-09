"use client";

import { PaletteProvider } from '@/app/context/PaletteContext';
import { PaletteToolbar } from "@/components/ToolBar/PaletteToolbar";
import { PaletteGrid } from "@/components/PaletteGrid/PaletteGrid";
import { DimensionControls } from "@/components/DimensionControls/DimensionControls";
import { GridControls } from "@/components/GridControls/GridControls";
import { Sidebar } from "@/components/Sidebar/Sidebar";

function MainContent() {
  return (
    <main className="min-h-screen p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Color Palette Generator</h1>
        {/* <UndoRedoControls /> */}
        
        <div className="grid grid-cols-1 lg:grid-cols-[2fr,1fr] gap-8">
          <div className="space-y-6">
            <DimensionControls />
            <GridControls />
            
            <div className="flex gap-8">
              <div className="w-64">
                <PaletteToolbar />
              </div>
              <div className="flex-1">
                <PaletteGrid />
              </div>
            </div>
          </div>
          
          <Sidebar />
        </div>
      </div>
    </main>
  );
}

export default function Home() {
  return (
    <PaletteProvider>
      <MainContent />
    </PaletteProvider>
  );
}