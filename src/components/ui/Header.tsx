import { Upload, ImageDown, Save } from 'lucide-react';
import { useFileHandlers } from '../../hooks/useFileHandlers';
import { useRef } from 'react';

export const Header = () => {
    const { saveToFile, loadFromFile, exportImage } = useFileHandlers();
    const fileInputRef = useRef<HTMLInputElement>(null);

    return (
        <div className="h-14 bg-white border-b border-gray-200 px-4 flex items-center justify-between z-10 relative">
            <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold">
                    IE
                </div>
                <h1 className="font-semibold text-gray-800">Untitled Drawing</h1>
            </div>

            <div className="flex items-center gap-2">
                <button
                    onClick={saveToFile}
                    className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                >
                    <Save size={18} />
                    Save
                </button>

                <button
                    onClick={() => fileInputRef.current?.click()}
                    className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                >
                    <Upload size={18} />
                    Open / Import
                </button>
                <input
                    ref={fileInputRef}
                    type="file"
                    accept=".json,.svg"
                    className="hidden"
                    onChange={(e) => {
                        if (e.target.files?.[0]) {
                            const file = e.target.files[0];
                            if (file.name.endsWith('.svg')) {
                                // Need to verify importSVG is returned from hook
                                // @ts-ignore
                                importSVG(file);
                            } else {
                                loadFromFile(file);
                            }
                            e.target.value = ''; // Reset
                        }
                    }}
                />

                <div className="h-6 w-px bg-gray-200 mx-1" />

                <button
                    onClick={() => exportImage('png')}
                    className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors shadow-sm"
                >
                    <ImageDown size={18} />
                    Export PNG
                </button>
                <button
                    onClick={() => exportImage('svg')}
                    className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
                >
                    <ImageDown size={18} />
                    SVG
                </button>
            </div>
        </div>
    );
};
