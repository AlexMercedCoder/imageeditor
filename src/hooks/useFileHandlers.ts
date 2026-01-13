import { useCanvasStore } from '../store/useCanvasStore';
import * as fabric from 'fabric';

export const useFileHandlers = () => {
    const { canvas } = useCanvasStore();

    const saveToFile = () => {
        if (!canvas) return;
        const json = canvas.toJSON();
        const blob = new Blob([JSON.stringify(json)], { type: 'application/json' });
        const href = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = href;
        link.download = `drawing-${Date.now()}.json`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const loadFromFile = (file: File) => {
        if (!canvas) return;
        const reader = new FileReader();
        reader.onload = (e) => {
            const content = e.target?.result as string;
            try {
                const json = JSON.parse(content);
                canvas.loadFromJSON(json, () => {
                    canvas.requestRenderAll();
                });
            } catch (err) {
                console.error('Failed to load file', err);
                alert('Invalid file format');
            }
        };
        reader.readAsText(file);
    };

    const exportImage = (format: 'png' | 'jpeg' | 'svg' = 'png') => {
        if (!canvas) return;

        if (format === 'svg') {
            const svg = canvas.toSVG();
            const blob = new Blob([svg], { type: 'image/svg+xml' });
            const href = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = href;
            link.download = `drawing-${Date.now()}.svg`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            return;
        }

        const dataUrl = canvas.toDataURL({
            format,
            quality: 1,
            multiplier: 2, // High res
        });
        const link = document.createElement('a');
        link.href = dataUrl;
        link.download = `export-${Date.now()}.${format}`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const importSVG = (file: File) => {
        if (!canvas) return;
        const reader = new FileReader();
        reader.onload = (e) => {
            const svgContent = e.target?.result as string;
            fabric.loadSVGFromString(svgContent).then(({ objects, options }) => {
                const group = fabric.util.groupSVGElements(objects as any[], options);
                // Center logic
                const center = canvas.getCenterPoint();
                group.set({
                    left: center.x,
                    top: center.y,
                    originX: 'center',
                    originY: 'center'
                });
                canvas.add(group);
                canvas.setActiveObject(group);
                canvas.requestRenderAll();
            });
        };
        reader.readAsText(file);
    };

    return { saveToFile, loadFromFile, exportImage, importSVG };
};
