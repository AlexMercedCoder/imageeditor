import { useEffect } from 'react';
import { CanvasWrapper } from './components/canvas/CanvasWrapper';
import { Toolbar } from './components/toolbar/Toolbar';
import { Sidebar } from './components/properties/Sidebar';
import { Header } from './components/ui/Header';
import { Dashboard } from './components/ui/Dashboard';
import { useProjectStore } from './store/useProjectStore';
import { useCanvasStore } from './store/useCanvasStore';

function App() {
  const { currentProjectId } = useProjectStore();
  const { canvas } = useCanvasStore();

  // Handle loading saved data when project ID changes or canvas initializes
  useEffect(() => {
    if (!currentProjectId || !canvas) return;

    const data = localStorage.getItem(`image_editor_project_${currentProjectId}`);
    if (data) {
      try {
        const json = JSON.parse(data);
        // Clear existing canvas first to prevent duplicates if any
        canvas.clear();
        canvas.backgroundColor = '#f3f4f6';
        canvas.requestRenderAll();

        canvas.loadFromJSON(json, () => {
          canvas.requestRenderAll();
          console.log('Project Loaded:', currentProjectId);
        });
      } catch (e) {
        console.error('Failed to load project data', e);
      }
    } else {
      // New project or empty
      canvas.clear();
      canvas.backgroundColor = '#f3f4f6';
      canvas.requestRenderAll();
    }

  }, [currentProjectId, canvas]);


  if (!currentProjectId) {
    return <Dashboard />;
  }

  return (
    <div className="h-screen w-screen flex flex-col overflow-hidden bg-gray-50">
      <Header />

      <div className="flex-1 relative flex overflow-hidden">
        {/* Main Canvas Area */}
        <div className="flex-1 relative flex flex-col min-w-0">
          <CanvasWrapper />

          {/* Floating Toolbar */}
          <div className="absolute top-4 left-1/2 -translate-x-1/2 z-20">
            <Toolbar />
          </div>
        </div>

        {/* Right Sidebar */}
        <Sidebar />
      </div>
    </div>
  );
}

export default App;
