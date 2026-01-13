import { MousePointer2, Square, Circle, Type, Image as ImageIcon, Pencil, Slash, HelpCircle } from 'lucide-react';
import clsx from 'clsx';
import { useState } from 'react';
import { useCanvasStore } from '../../store/useCanvasStore';
import { HelpModal } from '../ui/HelpModal';

export const Toolbar = () => {
    const { activeTool, setActiveTool } = useCanvasStore();
    const [isHelpOpen, setIsHelpOpen] = useState(false);

    const tools = [
        { id: 'select', icon: MousePointer2, label: 'Select' },
        { id: 'draw', icon: Pencil, label: 'Draw' },
        { id: 'line', icon: Slash, label: 'Line' },
        { id: 'rect', icon: Square, label: 'Rectangle' },
        { id: 'circle', icon: Circle, label: 'Circle' },
        { id: 'text', icon: Type, label: 'Text' },
        { id: 'image', icon: ImageIcon, label: 'Image' },
    ];

    return (
        <>
            <div className="pointer-events-auto bg-white/90 backdrop-blur-sm shadow-xl border border-gray-200/50 rounded-2xl px-2 py-1.5 flex items-center gap-1">
                {tools.map((tool) => (
                    <button
                        key={tool.id}
                        onClick={() => setActiveTool(tool.id)}
                        className={clsx(
                            "p-2.5 rounded-xl transition-all duration-200",
                            activeTool === tool.id
                                ? "bg-blue-50 text-blue-600 shadow-sm"
                                : "text-gray-500 hover:text-gray-900 hover:bg-gray-100/50"
                        )}
                        title={tool.label}
                    >
                        <tool.icon size={20} strokeWidth={2} />
                    </button>
                ))}

                <div className="w-px h-6 bg-gray-200 mx-1" />

                <button
                    onClick={() => setIsHelpOpen(true)}
                    className="p-2.5 rounded-xl text-gray-500 hover:text-gray-900 hover:bg-gray-100/50 transition-all duration-200"
                    title="Help & Shortcuts"
                >
                    <HelpCircle size={20} strokeWidth={2} />
                </button>
            </div>

            <HelpModal isOpen={isHelpOpen} onClose={() => setIsHelpOpen(false)} />
        </>
    );
};
