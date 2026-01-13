import { useEffect } from 'react';
import { useCanvasStore } from '../store/useCanvasStore';

export const useCanvasHotkeys = () => {
    const { canvas } = useCanvasStore();

    useEffect(() => {
        if (!canvas) return;

        const handleKeyDown = (e: KeyboardEvent) => {
            // Delete / Backspace
            if (e.key === 'Delete' || e.key === 'Backspace') {
                const activeObjects = canvas.getActiveObjects();
                if (activeObjects.length) {
                    canvas.discardActiveObject();
                    activeObjects.forEach((obj: any) => {
                        canvas.remove(obj);
                    });
                    canvas.requestRenderAll();
                }
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [canvas]);
};
