import { useEffect, useRef } from 'react';
import * as fabric from 'fabric';
import { useCanvasStore } from '../../store/useCanvasStore';
import { useCanvasEvents } from '../../hooks/useCanvasEvents';
import { useCanvasHotkeys } from '../../hooks/useCanvasHotkeys';
import { useCanvasImages } from '../../hooks/useCanvasImages';
import { useSelection } from '../../hooks/useSelection';
import { useObjectObserver } from '../../hooks/useObjectObserver';

export const CanvasWrapper = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const { setCanvas } = useCanvasStore();

    useCanvasEvents(); // Initialize event listeners
    useCanvasHotkeys();
    useCanvasImages();
    useSelection();
    useObjectObserver();

    useEffect(() => {
        if (!canvasRef.current || !containerRef.current) return;

        // Create the canvas instance
        const canvas = new fabric.Canvas(canvasRef.current, {
            width: containerRef.current.clientWidth,
            height: containerRef.current.clientHeight,
            backgroundColor: '#f3f4f6', // Match bg-gray-100/50
        });

        setCanvas(canvas);

        const handleResize = () => {
            if (containerRef.current) {
                canvas.setDimensions({
                    width: containerRef.current.clientWidth,
                    height: containerRef.current.clientHeight,
                });
            }
        };

        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
            canvas.dispose();
            setCanvas(null);
        };
    }, [setCanvas]);

    return (
        <div ref={containerRef} className="absolute inset-0 overflow-hidden bg-gray-50">
            <canvas ref={canvasRef} />
        </div>
    );
};
