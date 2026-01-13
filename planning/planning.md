# Implementation Plan

## 1. Tech Stack
-   **Framework**: [React](https://react.dev/) (v18+)
-   **Build Tool**: [Vite](https://vitejs.dev/)
-   **Language**: [TypeScript](https://www.typescriptlang.org/)
-   **Canvas Engine**: [Fabric.js](http://fabricjs.com/) (v6 beta or v5) or **Konva** via `react-konva`. *Recommendation: Fabric.js for superior object model and SVG import/export capabilities.*
-   **UI Framework**: [MUI (Material UI)](https://mui.com/) or **Tailwind CSS** with a headless UI library (like Headless UI) styled to look like Material Design. *Recommendation: Tailwind CSS + custom components for lighter weight and complete control over the "Premium" aesthetic.*
-   **State Management**: [Zustand](https://github.com/pmndrs/zustand) (Simpler than Redux, perfect for canvas state).
-   **Icons**: [Lucide React](https://lucide.dev/) or Material Symbols.

## 2. Architecture

### 2.1 Directory Structure
```
/src
  /components
    /canvas       # Canvas wrapper and interaction logic
    /ui           # Generic UI components (Buttons, Panels)
    /toolbar      # Main tool selection
    /properties   # Object property editor (sidebar)
    /layers       # Layers panel
  /store          # Zustand stores (useCanvasStore, useUIStore)
  /utils          # Geometry, File IO, Helpers
  /types          # TS Interfaces
  /hooks          # Custom hooks (useKeyboardShortcuts, etc.)
```

### 2.2 Data Model
The canvas state will be the "source of truth".
-   **Canvas Objects**: Serialized JSON from Fabric.js/Konva.
-   **App State**:
    -   `selectedTool`: 'select' | 'rect' | 'circle' | 'text' | ...
    -   `selection`: ID[] (Array of selected object IDs)
    -   `theme`: 'light' | 'dark'

### 2.3 Key Modules
1.  **CanvasManager**: A class or hook encapsulating direct Canvas API calls (init, resize, dispose, add object, event listeners).
2.  **ToolStrategy**: Pattern to handle different tool behaviors (e.g., `DrawRectStrategy` vs `SelectStrategy`) on mouse events.
3.  **HistoryManager**: Stack-based Undo/Redo system.

## 3. Development Phases

### Phase 1: Foundation
1.  Initialize Vite + TS + Tailwind.
2.  Set up the Canvas Engine (Fabric.js).
3.  Implement basic responsive layout (Toolbar, Canvas, Sidebar).
4.  Implement Pan/Zoom.

### Phase 2: Core Tools
1.  Shape primitives (Rect, Circle).
2.  Selection logic (Click, Drag select).
3.  Transformation (Move, Scale, Rotate).
4.  Shape properties (Color, Stroke, Opacity).

### Phase 3: Advanced Editing
1.  Top/Bottom Layer ordering (z-index).
2.  Layers Panel UI.
3.  Text editing support.
4.  Image Drag & Drop support.

### Phase 4: IO & Persistence
1.  Serialization to JSON (Save).
2.  Deserialization (Load).
3.  Export to PNG/JPG (Canvas `toDataURL` / `toBlob`).
4.  SVG Import/Export.

### Phase 5: Polish & UI
1.  Material Design styling refinements (animations, shadows).
2.  Mobile touch support improvements.
3.  Dark Mode.

## 4. Dependencies to Install
```json
{
  "dependencies": {
    "fabric": "^6.0.0-beta", // or "konva" & "react-konva"
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "zustand": "^4.5.0",
    "lucide-react": "^0.300.0",
    "clsx": "^2.1.0",
    "tailwind-merge": "^2.2.0"
  },
  "devDependencies": {
    "typescript": "^5.2.0",
    "vite": "^5.0.0",
    "tailwindcss": "^3.4.0",
    "autoprefixer": "^10.4.0",
    "postcss": "^8.4.0"
  }
}
```
