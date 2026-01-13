import { useEffect } from 'react';
import { useCanvasStore } from '../store/useCanvasStore';

export const useSelection = () => {
    const { canvas, setSelectedObjects } = useCanvasStore();

    useEffect(() => {
        if (!canvas) return;

        const handleSelection = () => {
            const activeObjects = canvas.getActiveObjects();
            setSelectedObjects(activeObjects);
        };

        const handleClear = () => {
            setSelectedObjects([]);
        };

        canvas.on('selection:created', handleSelection);
        canvas.on('selection:updated', handleSelection);
        canvas.on('selection:cleared', handleClear);

        return () => {
            canvas.off('selection:created', handleSelection);
            canvas.off('selection:updated', handleSelection);
            canvas.off('selection:cleared', handleClear);
        };
    }, [canvas, setSelectedObjects]);
};
