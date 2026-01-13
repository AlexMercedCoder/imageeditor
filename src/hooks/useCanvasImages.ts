import { useEffect } from 'react';
import * as fabric from 'fabric';
import { useCanvasStore } from '../store/useCanvasStore';

export const useCanvasImages = () => {
    const { canvas } = useCanvasStore();

    useEffect(() => {
        if (!canvas) return;

        const handleImageFile = (file: File, x: number, y: number) => {
            const reader = new FileReader();
            reader.onload = (f) => {
                const data = f.target?.result as string;
                fabric.FabricImage.fromURL(data).then((img: any) => {
                    img.set({
                        left: x,
                        top: y,
                        originX: 'center',
                        originY: 'center',
                    });

                    // Scale down if too big
                    if (img.width > 500) {
                        img.scaleToWidth(500);
                    }

                    canvas.add(img);
                    canvas.setActiveObject(img);
                    canvas.requestRenderAll();
                });
            };
            reader.readAsDataURL(file);
        };

        const handleDrop = (e: DragEvent) => {
            e.preventDefault();
            e.stopPropagation();

            if (e.dataTransfer?.files && e.dataTransfer.files[0]) {
                const file = e.dataTransfer.files[0];
                if (file.type.startsWith('image/')) {
                    handleImageFile(file, e.clientX, e.clientY);
                }
            }
        };

        const handlePaste = (e: ClipboardEvent) => {
            if (e.clipboardData?.files && e.clipboardData.files[0]) {
                const file = e.clipboardData.files[0];
                if (file.type.startsWith('image/')) {
                    // Paste at center of canvas or view
                    const center = canvas.getCenterPoint();
                    handleImageFile(file, center.x, center.y);
                    e.preventDefault();
                }
            }
        };

        const handleDragOver = (e: DragEvent) => {
            e.preventDefault();
            e.stopPropagation();
        };

        window.addEventListener('drop', handleDrop);
        window.addEventListener('dragover', handleDragOver);
        window.addEventListener('paste', handlePaste);

        return () => {
            window.removeEventListener('drop', handleDrop);
            window.removeEventListener('dragover', handleDragOver);
            window.removeEventListener('paste', handlePaste);
        };
    }, [canvas]);
};
