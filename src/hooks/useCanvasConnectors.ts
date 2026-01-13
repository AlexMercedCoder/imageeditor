import { useEffect } from 'react';

import { useCanvasStore } from '../store/useCanvasStore';

export const useCanvasConnectors = () => {
    const { canvas } = useCanvasStore();

    useEffect(() => {
        if (!canvas) return;

        const updateConnections = (opt: any) => {
            const movingObj = opt.target;

            // Find all lines connected to this object
            canvas.getObjects('line').forEach((line: any) => {
                if (line.startObject === movingObj) {
                    line.set({
                        x1: movingObj.left,
                        y1: movingObj.top
                    });
                }
                if (line.endObject === movingObj) {
                    line.set({
                        x2: movingObj.left,
                        y2: movingObj.top
                    });
                }
            });

            // Also force render if we moved something
            // canvas.requestRenderAll(); // handled by default move event usually, but good to ensure
        };

        canvas.on('object:moving', updateConnections);

        return () => {
            canvas.off('object:moving', updateConnections);
        };
    }, [canvas]);
};
