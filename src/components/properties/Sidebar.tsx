import { useState } from 'react';
import clsx from 'clsx';
import { Layers, Settings, Trash2, Eye, EyeOff, Wand2 } from 'lucide-react';
import * as fabric from 'fabric';
import { removeBackground } from '@imgly/background-removal';
import { useCanvasStore } from '../../store/useCanvasStore';

export const Sidebar = () => {
    const { selectedObjects, objects, canvas } = useCanvasStore();
    const [activeTab, setActiveTab] = useState<'properties' | 'layers'>('properties');
    const [, forceUpdate] = useState(0);
    const [isRemovingBackground, setIsRemovingBackground] = useState(false);
    const selectedObject = selectedObjects[0];

    const updateProperty = (key: string, value: any) => {
        if (!canvas || !selectedObject) return;
        selectedObject.set(key, value);
        canvas.requestRenderAll();
        forceUpdate((n) => n + 1);
    };

    const applyFilter = (filterName: string, value: any = null) => {
        if (!canvas || !selectedObject || selectedObject.type !== 'image') return;

        // Cast to any to bypass strict Fabric v7 typing for filters which can be complex
        const img = selectedObject as any;
        const Filters = (fabric.Image as any).filters || (fabric as any).filters;


        // Map simplified names to Fabric Filter classes
        let FilterClass: any;
        let options: any = {};

        switch (filterName) {
            case 'Grayscale':
                FilterClass = Filters.Grayscale;
                break;
            case 'Sepia':
                FilterClass = Filters.Sepia;
                break;
            case 'Invert':
                FilterClass = Filters.Invert;
                break;
            case 'Blur':
                FilterClass = Filters.Blur;
                options = { blur: value };
                break;
            case 'Brightness':
                FilterClass = Filters.Brightness;
                options = { brightness: value }; // -1 to 1
                break;
            case 'Contrast':
                FilterClass = Filters.Contrast;
                options = { contrast: value }; // -1 to 1
                break;
            case 'Pixelate':
                FilterClass = Filters.Pixelate;
                options = { blocksize: value };
                break;
        }

        if (!FilterClass) return;

        // Check if filter exists
        // Note: fabric.Image.filters array contains instances.
        const existingFilter = img.filters?.find((f: any) => f instanceof FilterClass) as any;

        if (['Grayscale', 'Sepia', 'Invert'].includes(filterName)) {
            if (existingFilter) {
                const index = img.filters?.indexOf(existingFilter);
                if (index !== undefined && index > -1) {
                    img.filters?.splice(index, 1);
                }
            } else {
                img.filters?.push(new FilterClass());
            }
        } else {
            // Slider based
            if (existingFilter) {
                // Update existing
                if (existingFilter.setOptions) {
                    existingFilter.setOptions(options);
                } else {
                    Object.assign(existingFilter, options);
                }
            } else {
                // Add new
                img.filters?.push(new FilterClass(options));
            }
        }

        img.applyFilters();
        canvas.requestRenderAll();
        forceUpdate((n) => n + 1);
    };

    const hasFilter = (filterName: string) => {
        if (!selectedObject || selectedObject.type !== 'image') return false;
        const img = selectedObject as any;
        const Filters = (fabric.Image as any).filters || (fabric as any).filters;
        const FilterClass = Filters[filterName];
        return !!img.filters?.find((f: any) => f instanceof FilterClass);
    };

    const getFilterValue = (filterName: string, key: string, defaultValue: number) => {
        if (!selectedObject || selectedObject.type !== 'image') return defaultValue;
        const img = selectedObject as any;
        const Filters = (fabric.Image as any).filters || (fabric as any).filters;
        const FilterClass = Filters[filterName];
        const filter: any = img.filters?.find((f: any) => f instanceof FilterClass);
        return filter ? filter[key] : defaultValue;
    };


    const handleRemoveBackground = async () => {
        if (!canvas || !selectedObject || selectedObject.type !== 'image') return;

        setIsRemovingBackground(true);
        try {
            const img = selectedObject as any;
            const originalUrl = img.getSrc();

            // blob check
            const blob = await (await fetch(originalUrl)).blob();

            const imageBitmap = await removeBackground(blob);
            const url = URL.createObjectURL(imageBitmap);

            const newImgElement = new Image();
            newImgElement.crossOrigin = "anonymous";
            newImgElement.src = url;
            newImgElement.onload = () => {
                img.setElement(newImgElement);
                canvas.requestRenderAll();
                setIsRemovingBackground(false);
            };

        } catch (error) {
            console.error("BG Removal failed", error);
            setIsRemovingBackground(false);
            alert("Failed to remove background. See console.");
        }
    };


    const deleteSelected = () => {
        if (!canvas) return;
        selectedObjects.forEach((obj) => canvas.remove(obj));
        canvas.discardActiveObject();
        canvas.requestRenderAll();
    };

    // ... 
    const groupObjects = () => {
        if (!canvas) return;
        const activeObj = canvas.getActiveObject();
        if (!activeObj || activeObj.type !== 'activeSelection') return;
        activeObj.toGroup();
        canvas.requestRenderAll();
        forceUpdate((n) => n + 1);
    };

    const ungroupObjects = () => {
        if (!canvas) return;
        const activeObj = canvas.getActiveObject();
        if (!activeObj || activeObj.type !== 'group') return;
        activeObj.toActiveSelection();
        canvas.requestRenderAll();
        forceUpdate((n) => n + 1);
    };

    return (
        <div className="w-80 bg-white/90 backdrop-blur-sm border-l border-gray-200/50 shadow-xl z-10 flex flex-col h-full">
            {/* Tabs */}
            <div className="flex border-b border-gray-100">
                <button
                    onClick={() => setActiveTab('properties')}
                    className={clsx(
                        "flex-1 py-3 text-sm font-medium flex items-center justify-center gap-2",
                        activeTab === 'properties' ? "text-blue-600 border-b-2 border-blue-600" : "text-gray-500 hover:text-gray-700"
                    )}
                >
                    <Settings size={16} /> Properties
                </button>
                <button
                    onClick={() => setActiveTab('layers')}
                    className={clsx(
                        "flex-1 py-3 text-sm font-medium flex items-center justify-center gap-2",
                        activeTab === 'layers' ? "text-blue-600 border-b-2 border-blue-600" : "text-gray-500 hover:text-gray-700"
                    )}
                >
                    <Layers size={16} /> Layers
                </button>
            </div>

            <div className="flex-1 p-4 overflow-y-auto">
                {activeTab === 'properties' && (
                    <div className="space-y-6">
                        {!selectedObject ? (
                            <div className="text-center text-gray-400 mt-10">
                                <p>Select an object to edit properties</p>
                            </div>
                        ) : (
                            <>
                                {/* Common Properties */}
                                {selectedObject.type !== 'image' && (
                                    <div className="space-y-2">
                                        <label className="text-xs font-medium text-gray-500 uppercase">Fill Color</label>
                                        <div className="flex gap-2">
                                            <input
                                                type="color"
                                                className="w-8 h-8 rounded cursor-pointer border-0 p-0"
                                                value={String(selectedObject.get('fill'))}
                                                onChange={(e) => updateProperty('fill', e.target.value)}
                                                disabled={selectedObject.type === 'image'}
                                            />
                                            <span className="text-sm text-gray-600 leading-8">{String(selectedObject.get('fill'))}</span>
                                        </div>
                                    </div>
                                )}

                                {/* Image Specific Controls */}
                                {selectedObject.type === 'image' && (
                                    <>
                                        <div className="space-y-4">
                                            <label className="text-xs font-medium text-gray-500 uppercase block border-b pb-1">Image Filters</label>

                                            {/* Toggles */}
                                            <div className="flex flex-wrap gap-2">
                                                {['Grayscale', 'Sepia', 'Invert'].map(filter => (
                                                    <label key={filter} className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer bg-gray-50 px-2 py-1 rounded border border-gray-200 hover:bg-gray-100">
                                                        <input
                                                            type="checkbox"
                                                            checked={hasFilter(filter)}
                                                            onChange={() => applyFilter(filter)}
                                                            className="rounded text-blue-600"
                                                        />
                                                        {filter}
                                                    </label>
                                                ))}
                                            </div>

                                            {/* Sliders */}
                                            <div className="space-y-3">
                                                <div className="space-y-1">
                                                    <div className="flex justify-between">
                                                        <label className="text-xs text-gray-500">Blur</label>
                                                        <span className="text-xs text-gray-500">{getFilterValue('Blur', 'blur', 0).toFixed(2)}</span>
                                                    </div>
                                                    <input type="range" min="0" max="1" step="0.05"
                                                        value={getFilterValue('Blur', 'blur', 0)}
                                                        onChange={(e) => applyFilter('Blur', parseFloat(e.target.value))}
                                                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                                                    />
                                                </div>

                                                <div className="space-y-1">
                                                    <div className="flex justify-between">
                                                        <label className="text-xs text-gray-500">Brightness</label>
                                                        <span className="text-xs text-gray-500">{getFilterValue('Brightness', 'brightness', 0).toFixed(2)}</span>
                                                    </div>
                                                    <input type="range" min="-1" max="1" step="0.05"
                                                        value={getFilterValue('Brightness', 'brightness', 0)}
                                                        onChange={(e) => applyFilter('Brightness', parseFloat(e.target.value))}
                                                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                                                    />
                                                </div>

                                                <div className="space-y-1">
                                                    <div className="flex justify-between">
                                                        <label className="text-xs text-gray-500">Contrast</label>
                                                        <span className="text-xs text-gray-500">{getFilterValue('Contrast', 'contrast', 0).toFixed(2)}</span>
                                                    </div>
                                                    <input type="range" min="-1" max="1" step="0.05"
                                                        value={getFilterValue('Contrast', 'contrast', 0)}
                                                        onChange={(e) => applyFilter('Contrast', parseFloat(e.target.value))}
                                                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                                                    />
                                                </div>

                                                <div className="space-y-1">
                                                    <div className="flex justify-between">
                                                        <label className="text-xs text-gray-500">Pixelate</label>
                                                        <span className="text-xs text-gray-500">{getFilterValue('Pixelate', 'blocksize', 1)}</span>
                                                    </div>
                                                    <input type="range" min="1" max="20" step="1"
                                                        value={getFilterValue('Pixelate', 'blocksize', 1)}
                                                        onChange={(e) => applyFilter('Pixelate', parseInt(e.target.value))}
                                                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                                                    />
                                                </div>
                                            </div>

                                            {/* AI Tools */}
                                            <div className="pt-2 border-t border-gray-100">
                                                <button
                                                    onClick={handleRemoveBackground}
                                                    disabled={isRemovingBackground}
                                                    className={clsx(
                                                        "w-full py-2 rounded-lg flex items-center justify-center gap-2 text-sm transition-colors",
                                                        isRemovingBackground ? "bg-gray-100 text-gray-400" : "bg-purple-50 text-purple-600 hover:bg-purple-100"
                                                    )}
                                                >
                                                    <Wand2 size={16} />
                                                    {isRemovingBackground ? "Removing Background..." : "Remove Background"}
                                                </button>
                                            </div>
                                        </div>
                                    </>
                                )}

                                {/* Text Specific Controls */}
                                {selectedObject.type === 'i-text' && (
                                    <>
                                        <div className="space-y-2">
                                            <label className="text-xs font-medium text-gray-500 uppercase">Font Family</label>
                                            <select
                                                className="w-full p-2 text-sm border border-gray-200 rounded-lg outline-none focus:border-blue-500"
                                                value={selectedObject.get('fontFamily')}
                                                onChange={(e) => updateProperty('fontFamily', e.target.value)}
                                            >
                                                {/* Original */}
                                                <option value="Inter">Inter</option>
                                                <option value="Roboto">Roboto</option>
                                                <option value="Playfair Display">Playfair Display</option>
                                                <option value="Lobster">Lobster</option>
                                                <option value="Courier Prime">Courier Prime</option>

                                                {/* Sans-serif */}
                                                <option value="Open Sans">Open Sans</option>
                                                <option value="Montserrat">Montserrat</option>
                                                <option value="Lato">Lato</option>
                                                <option value="Poppins">Poppins</option>
                                                <option value="Raleway">Raleway</option>
                                                <option value="Oswald">Oswald</option>
                                                <option value="Quicksand">Quicksand</option>

                                                {/* Serif */}
                                                <option value="Merriweather">Merriweather</option>
                                                <option value="PT Serif">PT Serif</option>
                                                <option value="Lora">Lora</option>

                                                {/* Handwriting */}
                                                <option value="Pacifico">Pacifico</option>
                                                <option value="Dancing Script">Dancing Script</option>
                                                <option value="Caveat">Caveat</option>
                                                <option value="Satisfy">Satisfy</option>
                                                <option value="Great Vibes">Great Vibes</option>

                                                {/* Monospace */}
                                                <option value="Source Code Pro">Source Code Pro</option>
                                                <option value="Inconsolata">Inconsolata</option>
                                                <option value="VT323">VT323</option>

                                                {/* Display */}
                                                <option value="Bebas Neue">Bebas Neue</option>
                                                <option value="Anton">Anton</option>
                                                <option value="Abril Fatface">Abril Fatface</option>
                                            </select>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-xs font-medium text-gray-500 uppercase">Font Size</label>
                                            <div className="flex gap-2 items-center">
                                                <input
                                                    type="range"
                                                    min="8"
                                                    max="200"
                                                    className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                                                    value={Number(selectedObject.get('fontSize')) || 40}
                                                    onChange={(e) => updateProperty('fontSize', parseInt(e.target.value))}
                                                />
                                                <span className="text-sm text-gray-600 w-8 text-right">{selectedObject.get('fontSize')}</span>
                                            </div>
                                        </div>
                                    </>
                                )}

                                <div className="space-y-2">
                                    <label className="text-xs font-medium text-gray-500 uppercase">Stroke</label>
                                    <div className="flex gap-2 items-center">
                                        <input
                                            type="color"
                                            className="w-8 h-8 rounded cursor-pointer border-0 p-0"
                                            value={String(selectedObject.get('stroke'))}
                                            onChange={(e) => updateProperty('stroke', e.target.value)}
                                        />
                                        <input
                                            type="range"
                                            min="0"
                                            max="20"
                                            className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                                            value={Number(selectedObject.get('strokeWidth')) || 0}
                                            onChange={(e) => updateProperty('strokeWidth', parseInt(e.target.value))}
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-xs font-medium text-gray-500 uppercase">Opacity</label>
                                    <input
                                        type="range"
                                        min="0"
                                        max="1"
                                        step="0.1"
                                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                                        value={Number(selectedObject.get('opacity')) || 1}
                                        onChange={(e) => updateProperty('opacity', parseFloat(e.target.value))}
                                    />
                                </div>

                                {selectedObjects.length > 1 && (
                                    <div className="pt-4 border-t border-gray-100">
                                        <button
                                            onClick={groupObjects}
                                            className="w-full py-2 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center gap-2 text-sm hover:bg-blue-100 transition-colors"
                                        >
                                            <Layers size={16} /> Group Objects
                                        </button>
                                    </div>
                                )}

                                {selectedObjects.length === 1 && selectedObjects[0].type === 'group' && (
                                    <div className="pt-4 border-t border-gray-100">
                                        <button
                                            onClick={ungroupObjects}
                                            className="w-full py-2 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center gap-2 text-sm hover:bg-blue-100 transition-colors"
                                        >
                                            <Layers size={16} /> Ungroup
                                        </button>
                                    </div>
                                )}

                                <div className="pt-4 border-t border-gray-100">
                                    <button
                                        onClick={deleteSelected}
                                        className="w-full py-2 bg-red-50 text-red-600 rounded-lg flex items-center justify-center gap-2 text-sm hover:bg-red-100 transition-colors"
                                    >
                                        <Trash2 size={16} /> Delete Object
                                    </button>
                                </div>
                            </>
                        )}
                    </div>
                )}

                {activeTab === 'layers' && (
                    <div className="space-y-2">
                        {[...objects].reverse().map((obj, i) => (
                            <div key={i} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg hover:bg-gray-100 group">
                                <span className="text-sm text-gray-700 capitalize">
                                    {obj.type} {objects.length - i}
                                </span>
                                <div className="flex gap-1 opacity-50 group-hover:opacity-100">
                                    <button onClick={() => {
                                        obj.set('visible', !obj.visible);
                                        obj.canvas?.requestRenderAll();
                                    }} className="p-1 hover:text-blue-600">
                                        {obj.visible !== false ? <Eye size={14} /> : <EyeOff size={14} />}
                                    </button>
                                </div>
                            </div>
                        ))}
                        {objects.length === 0 && (
                            <div className="text-center text-gray-400 mt-10">
                                <p>No layers</p>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};
