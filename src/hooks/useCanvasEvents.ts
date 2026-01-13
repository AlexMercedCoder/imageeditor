import { useEffect, useRef } from 'react';
import * as fabric from 'fabric';
import { useCanvasStore } from '../store/useCanvasStore';

export const useCanvasEvents = () => {
    const { canvas, activeTool, setActiveTool } = useCanvasStore();
    const isDrawing = useRef(false);
    const startPos = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
    const activeObject = useRef<any>(null);

    // Handle Mode Switches (Drawing vs Selection vs Others)
    useEffect(() => {
        if (!canvas) return;

        // Reset Defaults
        canvas.isDrawingMode = false;
        canvas.selection = false;
        canvas.defaultCursor = 'default';

        canvas.forEachObject((obj: any) => {
            obj.selectable = false;
            obj.evented = false; // Disable events on objects when not in select mode usually
        });

        if (activeTool === 'select') {
            canvas.selection = true;
            canvas.defaultCursor = 'default';
            canvas.hoverCursor = 'move';
            canvas.forEachObject((obj: any) => {
                obj.selectable = true;
                obj.evented = true;
            });
        } else if (activeTool === 'draw') {
            canvas.isDrawingMode = true;
            // Configure brush
            canvas.freeDrawingBrush = new fabric.PencilBrush(canvas);
            canvas.freeDrawingBrush.width = 5;
            canvas.freeDrawingBrush.color = '#3b82f6'; // blue-500
        } else {
            // Shape creation modes (rect, circle, text)
            canvas.defaultCursor = 'crosshair';
            canvas.hoverCursor = 'crosshair';
            canvas.discardActiveObject();
        }

        canvas.requestRenderAll();
    }, [canvas, activeTool]);

    useEffect(() => {
        if (!canvas) return;

        const handleMouseDown = (opt: any) => {
            if (activeTool === 'select' || activeTool === 'draw') return;

            const pointer = canvas.getScenePoint(opt.e);
            startPos.current = { x: pointer.x, y: pointer.y };

            // Handle Text Creation
            if (activeTool === 'text') {
                const text = new fabric.IText('Type here', {
                    left: pointer.x,
                    top: pointer.y,
                    fontFamily: 'Inter',
                    fill: '#374151', // gray-700
                    fontSize: 20,
                });
                canvas.add(text);
                canvas.setActiveObject(text);
                text.enterEditing();
                text.selectAll();
                setActiveTool('select'); // Switch back to select after creating text
                return;
            }

            // Handle Shape Creation
            isDrawing.current = true;
            let shape: any = null;

            if (activeTool === 'rect') {
                shape = new fabric.Rect({
                    left: pointer.x,
                    top: pointer.y,
                    width: 0,
                    height: 0,
                    fill: '#bfdbfe', // blue-200
                    stroke: '#3b82f6', // blue-500
                    strokeWidth: 2,
                    transparentCorners: false,
                });
            } else if (activeTool === 'circle') {
                shape = new fabric.Circle({
                    left: pointer.x,
                    top: pointer.y,
                    radius: 0,
                    fill: '#bbf7d0', // green-200
                    stroke: '#22c55e', // green-500
                    strokeWidth: 2,
                    transparentCorners: false,
                    originX: 'center',
                });
            } else if (activeTool === 'line') {
                shape = new fabric.Line([pointer.x, pointer.y, pointer.x, pointer.y], {
                    stroke: '#3b82f6',
                    strokeWidth: 4,
                    strokeLineCap: 'round',
                });
            }

            if (shape) {
                canvas.add(shape);
                activeObject.current = shape;
                canvas.setActiveObject(shape);
            }
        };

        const handleMouseMove = (opt: any) => {
            if (!isDrawing.current || !activeObject.current) return;

            const pointer = canvas.getScenePoint(opt.e);
            const shape = activeObject.current;

            if (activeTool === 'rect' && shape instanceof fabric.Rect) {
                const width = Math.abs(pointer.x - startPos.current.x);
                const height = Math.abs(pointer.y - startPos.current.y);

                shape.set({
                    width: width,
                    height: height,
                    left: Math.min(pointer.x, startPos.current.x),
                    top: Math.min(pointer.y, startPos.current.y),
                });
            } else if (activeTool === 'circle' && shape instanceof fabric.Circle) {
                const dist = Math.sqrt(
                    Math.pow(pointer.x - startPos.current.x, 2) +
                    Math.pow(pointer.y - startPos.current.y, 2)
                );
                shape.set({ radius: dist / 2 });
                // Simple radius from start point:
                const width = Math.abs(pointer.x - startPos.current.x);
                const height = Math.abs(pointer.y - startPos.current.y);
                const radius = Math.max(width, height) / 2;

                shape.set({
                    radius: radius,
                    left: Math.min(pointer.x, startPos.current.x),
                    top: Math.min(pointer.y, startPos.current.y)
                });
            } else if (activeTool === 'line' && shape instanceof fabric.Line) {
                shape.set({
                    x2: pointer.x,
                    y2: pointer.y,
                });
            }

            canvas.requestRenderAll();
        };

        const handleMouseUp = (opt: any) => {
            if (isDrawing.current) {
                // Line Snapping Logic
                if (activeTool === 'line' && activeObject.current) {
                    const line = activeObject.current;
                    const objects = canvas.getObjects();
                    const pointer = canvas.getScenePoint(opt.e);

                    // Helper to check if point is inside object (very basic bbox check)
                    const findTargetAt = (point: { x: number, y: number }) => {
                        // Reverse iterate to find top-most object, skipping the line itself
                        for (let i = objects.length - 1; i >= 0; i--) {
                            const obj = objects[i];
                            if (obj === line) continue;
                            if (obj.containsPoint(point)) return obj;
                        }
                        return null;
                    };

                    const startObj = findTargetAt(startPos.current);
                    const endObj = findTargetAt(pointer);

                    if (startObj) {
                        line.set({
                            x1: startObj.left,
                            y1: startObj.top,
                            startObject: startObj
                        });
                    }

                    if (endObj) {
                        line.set({
                            x2: endObj.left,
                            y2: endObj.top,
                            endObject: endObj
                        });
                    }

                    if (startObj || endObj) {
                        line.setCoords();
                        canvas.requestRenderAll();
                    }
                }

                isDrawing.current = false;
                activeObject.current = null;
                canvas.selection = true;
                // Optionally switch back to select tool
                setActiveTool('select');
            }
        };

        canvas.on('mouse:down', handleMouseDown);
        canvas.on('mouse:move', handleMouseMove);
        canvas.on('mouse:up', handleMouseUp);

        return () => {
            canvas.off('mouse:down', handleMouseDown);
            canvas.off('mouse:move', handleMouseMove);
            canvas.off('mouse:up', handleMouseUp);
        };
    }, [canvas, activeTool, setActiveTool]);
};
