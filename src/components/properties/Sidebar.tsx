import { useState } from 'react';
import clsx from 'clsx';
import { Layers, Settings, Trash2, Eye, EyeOff } from 'lucide-react';
import { useCanvasStore } from '../../store/useCanvasStore';

export const Sidebar = () => {
    const { selectedObjects, objects, canvas } = useCanvasStore();
    const [activeTab, setActiveTab] = useState<'properties' | 'layers'>('properties');
    const [, forceUpdate] = useState(0);
    const selectedObject = selectedObjects[0];

    const updateProperty = (key: string, value: any) => {
        if (!canvas || !selectedObject) return;
        selectedObject.set(key, value);
        canvas.requestRenderAll();
        forceUpdate((n) => n + 1); // Trigger re-render to update UI controls
    };

    const deleteSelected = () => {
        if (!canvas) return;
        selectedObjects.forEach((obj) => canvas.remove(obj));
        canvas.discardActiveObject();
        canvas.requestRenderAll();
    };

    const groupObjects = () => {
        if (!canvas) return;
        const activeObj = canvas.getActiveObject();
        if (!activeObj || activeObj.type !== 'activeSelection') return;

        activeObj.toGroup();
        canvas.requestRenderAll();
        // Force update to refresh UI (buttons might change state)
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
    // ...
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
                                <div className="space-y-2">
                                    <label className="text-xs font-medium text-gray-500 uppercase">Fill Color</label>
                                    <div className="flex gap-2">
                                        <input
                                            type="color"
                                            className="w-8 h-8 rounded cursor-pointer border-0 p-0"
                                            value={String(selectedObject.get('fill'))}
                                            onChange={(e) => updateProperty('fill', e.target.value)}
                                        />
                                        <span className="text-sm text-gray-600 leading-8">{String(selectedObject.get('fill'))}</span>
                                    </div>
                                </div>

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
                                        // Force re-render logic handled by hook? No, explicit command needed usually to refresh store if deep prop changed
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
