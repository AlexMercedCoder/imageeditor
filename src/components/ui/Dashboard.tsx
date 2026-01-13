import { useEffect } from 'react';
import { useProjectStore } from '../../store/useProjectStore';
import { Plus, Trash2, FileImage, Clock } from 'lucide-react';
import { motion } from 'framer-motion';

export const Dashboard = () => {
    const { projects, loadProjects, createProject, selectProject, deleteProject } = useProjectStore();

    useEffect(() => {
        loadProjects();
    }, []);

    // Format date helper
    const formatDate = (ts: number) => new Date(ts).toLocaleDateString() + ' ' + new Date(ts).toLocaleTimeString();

    return (
        <div className="min-h-screen bg-gray-50 p-8">
            <div className="max-w-6xl mx-auto space-y-8">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">My Canvases</h1>
                        <p className="text-gray-500 mt-1">Manage your image editing projects</p>
                    </div>
                    <button
                        onClick={createProject}
                        className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-medium shadow-lg transition-all hover:scale-105"
                    >
                        <Plus size={20} /> New Canvas
                    </button>
                </div>

                {/* Projects Grid */}
                {projects.length === 0 ? (
                    <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-gray-300">
                        <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                            <FileImage className="text-gray-400" size={32} />
                        </div>
                        <h3 className="text-xl font-medium text-gray-900">No projects yet</h3>
                        <p className="text-gray-500 mt-2">Create your first canvas to get started!</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {projects.map((project) => (
                            <motion.div
                                key={project.id}
                                layoutId={project.id}
                                className="bg-white rounded-2xl border border-gray-200 overflow-hidden cursor-pointer hover:shadow-xl transition-all group"
                                onClick={() => selectProject(project.id)}
                            >
                                <div className="aspect-video bg-gray-100 flex items-center justify-center border-b border-gray-100 relative">
                                    <FileImage className="text-gray-300" size={48} />
                                    {/* Overlay on hover */}
                                    <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                                </div>

                                <div className="p-4">
                                    <div className="flex items-start justify-between">
                                        <div>
                                            <h3 className="font-semibold text-gray-900 truncate pr-4" title={project.name}>
                                                {project.name}
                                            </h3>
                                            <div className="flex items-center gap-1.5 mt-1 text-xs text-gray-500">
                                                <Clock size={12} />
                                                <span>{formatDate(project.lastModified)}</span>
                                            </div>
                                        </div>
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                if (confirm('Are you sure you want to delete this project?')) {
                                                    deleteProject(project.id);
                                                }
                                            }}
                                            className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                            title="Delete Project"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};
