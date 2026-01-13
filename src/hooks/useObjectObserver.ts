import { useEffect } from 'react';
import { useCanvasStore } from '../store/useCanvasStore';

export const useObjectObserver = () => {
    const { canvas, setObjects } = useCanvasStore();

    useEffect(() => {
        if (!canvas) return;

        const updateObjects = () => {
            setObjects([...canvas.getObjects()]);
        };

        canvas.on('object:added', updateObjects);
        canvas.on('object:removed', updateObjects);
        canvas.on('object:modified', updateObjects);
        // Also update on reordering
        // Fabric doesn't have a specific 'order:changed' event easily, but 'object:modified' covers some not all?
        // We might need to manually trigger on z-index ops. For now, added/removed covers creation.

        updateObjects(); // Init

        return () => {
            canvas.off('object:added', updateObjects);
            canvas.off('object:removed', updateObjects);
            canvas.off('object:modified', updateObjects);
        };
    }, [canvas, setObjects]);
};
