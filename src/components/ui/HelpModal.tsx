import { X, Command, MousePointer2, Layers, Image as ImageIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface HelpModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export const HelpModal = ({ isOpen, onClose }: HelpModalProps) => {
    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/20 backdrop-blur-sm z-[100]"
                    />
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        className="fixed inset-0 flex items-center justify-center z-[101] pointer-events-none"
                    >
                        <div className="bg-white pointer-events-auto w-full max-w-2xl max-h-[80vh] rounded-2xl shadow-2xl overflow-hidden flex flex-col">
                            <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
                                <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                                    <Command size={20} className="text-blue-600" />
                                    Keyboard Shortcuts & Guide
                                </h2>
                                <button onClick={onClose} className="p-2 hover:bg-gray-200 rounded-full transition-colors">
                                    <X size={20} className="text-gray-500" />
                                </button>
                            </div>

                            <div className="overflow-y-auto p-6 space-y-8">
                                {/* Shortcuts Section */}
                                <section>
                                    <h3 className="text-sm font-bold text-gray-500 uppercase mb-4">Essential Shortcuts</h3>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                            <span className="text-gray-700">Delete Object</span>
                                            <kbd className="px-2 py-1 bg-white border border-gray-200 rounded text-xs font-bold text-gray-600">Del</kbd>
                                        </div>
                                        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                            <span className="text-gray-700">Copy</span>
                                            <div className="flex gap-1">
                                                <kbd className="px-2 py-1 bg-white border border-gray-200 rounded text-xs font-bold text-gray-600">Ctrl</kbd>
                                                <span className="text-gray-400">+</span>
                                                <kbd className="px-2 py-1 bg-white border border-gray-200 rounded text-xs font-bold text-gray-600">C</kbd>
                                            </div>
                                        </div>
                                        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                            <span className="text-gray-700">Paste</span>
                                            <div className="flex gap-1">
                                                <kbd className="px-2 py-1 bg-white border border-gray-200 rounded text-xs font-bold text-gray-600">Ctrl</kbd>
                                                <span className="text-gray-400">+</span>
                                                <kbd className="px-2 py-1 bg-white border border-gray-200 rounded text-xs font-bold text-gray-600">V</kbd>
                                            </div>
                                        </div>
                                        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                            <span className="text-gray-700">Undo</span>
                                            <div className="flex gap-1">
                                                <kbd className="px-2 py-1 bg-white border border-gray-200 rounded text-xs font-bold text-gray-600">Ctrl</kbd>
                                                <span className="text-gray-400">+</span>
                                                <kbd className="px-2 py-1 bg-white border border-gray-200 rounded text-xs font-bold text-gray-600">Z</kbd>
                                            </div>
                                        </div>
                                    </div>
                                </section>

                                {/* Features Guide */}
                                <section>
                                    <h3 className="text-sm font-bold text-gray-500 uppercase mb-4">Features Guide</h3>
                                    <div className="space-y-4">
                                        <div className="flex gap-4">
                                            <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center shrink-0 text-blue-600">
                                                <Layers size={20} />
                                            </div>
                                            <div>
                                                <h4 className="font-medium text-gray-900">Grouping & Connections</h4>
                                                <p className="text-sm text-gray-600 mt-1">
                                                    Select multiple objects to see the <b>Group</b> button in the sidebar.
                                                    Use the <b>Line tool</b> to draw lines between objects; they will automatically snap to the center and stay connected.
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex gap-4">
                                            <div className="w-10 h-10 bg-purple-50 rounded-lg flex items-center justify-center shrink-0 text-purple-600">
                                                <ImageIcon size={20} />
                                            </div>
                                            <div>
                                                <h4 className="font-medium text-gray-900">Image Editing</h4>
                                                <p className="text-sm text-gray-600 mt-1">
                                                    Select an image to access <b>Filters</b> (Blur, Sepia, etc.) and <b>Background Removal</b> in the sidebar.
                                                    You can also paste images directly from your clipboard (Ctrl+V).
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex gap-4">
                                            <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center shrink-0 text-green-600">
                                                <MousePointer2 size={20} />
                                            </div>
                                            <div>
                                                <h4 className="font-medium text-gray-900">Smart Selection</h4>
                                                <p className="text-sm text-gray-600 mt-1">
                                                    Double-click text to edit. Drag to select multiple objects. Use the Layers tab in the sidebar to toggle visibility or reorder objects.
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </section>
                            </div>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};
