import { create } from 'zustand';

interface CanvasState {
    canvas: any;
    activeTool: string;
    selectedObjects: any[];
    objects: any[];
    setCanvas: (canvas: any) => void;
    setActiveTool: (tool: string) => void;
    setSelectedObjects: (objects: any[]) => void;
    setObjects: (objects: any[]) => void;
}

export const useCanvasStore = create<CanvasState>((set) => ({
    canvas: null,
    activeTool: 'select',
    selectedObjects: [],
    objects: [],
    setCanvas: (canvas) => set({ canvas }),
    setActiveTool: (tool) => set({ activeTool: tool }),
    setSelectedObjects: (objects) => set({ selectedObjects: objects }),
    setObjects: (objects) => set({ objects }),
}));
