
import { CanvasWrapper } from './components/canvas/CanvasWrapper';
import { Toolbar } from './components/toolbar/Toolbar';
import { Sidebar } from './components/properties/Sidebar';
import { Header } from './components/ui/Header';

function App() {
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
