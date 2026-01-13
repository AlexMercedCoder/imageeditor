import { create } from 'zustand';
import { v4 as uuidv4 } from 'uuid';

export interface ProjectMetadata {
    id: string;
    name: string;
    lastModified: number;
    thumbnail?: string;
}

interface ProjectState {
    projects: ProjectMetadata[];
    currentProjectId: string | null;
    currentProjectName: string;

    // Actions
    loadProjects: () => void;
    createProject: () => void;
    selectProject: (id: string) => void;
    updateProjectName: (name: string) => void;
    saveProject: (canvas: any) => void;
    deleteProject: (id: string) => void;
    exitProject: () => void;
}

const STORAGE_KEY_PREFIX = 'image_editor_project_';
const METADATA_KEY = 'image_editor_projects_meta';

export const useProjectStore = create<ProjectState>((set, get) => ({
    projects: [],
    currentProjectId: null,
    currentProjectName: 'Untitled Drawing',

    loadProjects: () => {
        const meta = localStorage.getItem(METADATA_KEY);
        if (meta) {
            set({ projects: JSON.parse(meta) });
        }
    },

    createProject: () => {
        const id = uuidv4();
        const newProject: ProjectMetadata = {
            id,
            name: 'Untitled Drawing',
            lastModified: Date.now(),
        };

        const { projects } = get();
        const updatedProjects = [newProject, ...projects];

        localStorage.setItem(METADATA_KEY, JSON.stringify(updatedProjects));
        // Also init empty storage for this project
        localStorage.setItem(STORAGE_KEY_PREFIX + id, JSON.stringify({ version: '5.3.0', objects: [] }));

        set({
            projects: updatedProjects,
            currentProjectId: id,
            currentProjectName: 'Untitled Drawing'
        });
    },

    selectProject: (id: string) => {
        const { projects } = get();
        const project = projects.find(p => p.id === id);
        if (project) {
            set({
                currentProjectId: id,
                currentProjectName: project.name
            });
        }
    },

    updateProjectName: (name: string) => {
        const { currentProjectId, projects } = get();
        if (!currentProjectId) return;

        const updatedProjects = projects.map(p =>
            p.id === currentProjectId ? { ...p, name, lastModified: Date.now() } : p
        );

        localStorage.setItem(METADATA_KEY, JSON.stringify(updatedProjects));
        set({ projects: updatedProjects, currentProjectName: name });
    },

    saveProject: (canvas: any) => {
        const { currentProjectId, projects } = get();
        if (!currentProjectId || !canvas) return;

        const json = canvas.toJSON(['id', 'selectable', 'name', 'locked']); // Include custom props
        localStorage.setItem(STORAGE_KEY_PREFIX + currentProjectId, JSON.stringify(json));

        // Update last modified
        const updatedProjects = projects.map(p =>
            p.id === currentProjectId ? { ...p, lastModified: Date.now() } : p
        );
        localStorage.setItem(METADATA_KEY, JSON.stringify(updatedProjects));
        set({ projects: updatedProjects });

        console.log('Project Saved:', currentProjectId);
    },

    deleteProject: (id: string) => {
        const { projects, currentProjectId } = get();
        const updatedProjects = projects.filter(p => p.id !== id);

        localStorage.setItem(METADATA_KEY, JSON.stringify(updatedProjects));
        localStorage.removeItem(STORAGE_KEY_PREFIX + id);

        if (currentProjectId === id) {
            set({ projects: updatedProjects, currentProjectId: null, currentProjectName: '' });
        } else {
            set({ projects: updatedProjects });
        }
    },

    exitProject: () => {
        set({ currentProjectId: null, currentProjectName: '' });
    }
}));
