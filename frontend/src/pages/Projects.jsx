import { useState, useEffect } from 'react';
import { Edit2, Plus, Trash2, Users, FolderKanban } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';
import Skeleton from '../components/Skeleton';
import EmptyState from '../components/EmptyState';
import toast from 'react-hot-toast';

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newProjectName, setNewProjectName] = useState('');
  const [newProjectDesc, setNewProjectDesc] = useState('');
  const [isMemberModalOpen, setIsMemberModalOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const [editingProject, setEditingProject] = useState(null);
  const [projectToDelete, setProjectToDelete] = useState(null);
  const [allUsers, setAllUsers] = useState([]);
  const { user } = useAuth();

  const isProjectAdmin = (project) => {
    const creatorId = project.createdBy?._id || project.createdBy;
    return user?.role === 'admin' || creatorId === user?._id;
  };

  const isProjectCreator = (project) => {
    const creatorId = project.createdBy?._id || project.createdBy;
    return creatorId === user?._id;
  };

  const fetchProjects = async () => {
    try {
      const { data } = await api.get('/projects');
      setProjects(data);
    } catch {
      toast.error('Failed to load projects');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const loadProjects = async () => {
      try {
        const { data } = await api.get('/projects');
        setProjects(data);
      } catch {
        toast.error('Failed to load projects');
      } finally {
        setLoading(false);
      }
    };

    loadProjects();
  }, []);

  const handleCreateProject = async (e) => {
    e.preventDefault();
    try {
      await api.post('/projects', { name: newProjectName, description: newProjectDesc });
      toast.success('Project created');
      setIsModalOpen(false);
      setNewProjectName('');
      setNewProjectDesc('');
      fetchProjects();
    } catch {
      toast.error('Failed to create project');
    }
  };

  const handleUpdateProject = async (e) => {
    e.preventDefault();
    if (!editingProject) return;

    try {
      await api.put(`/projects/${editingProject._id}`, {
        name: editingProject.name,
        description: editingProject.description,
      });
      toast.success('Project updated');
      setEditingProject(null);
      fetchProjects();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update project');
    }
  };

  const handleDeleteProject = async () => {
    if (!projectToDelete) return;

    try {
      await api.delete(`/projects/${projectToDelete._id}`);
      toast.success('Project deleted');
      setProjectToDelete(null);
      fetchProjects();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to delete project');
    }
  };

  const fetchUsers = async () => {
    try {
      const { data } = await api.get('/projects/users');
      setAllUsers(data);
    } catch {
      toast.error('Failed to load users');
    }
  };

  const openMemberModal = (project) => {
    setSelectedProject(project);
    fetchUsers();
    setIsMemberModalOpen(true);
  };

  const handleToggleMember = async (userId) => {
    if (!selectedProject) return;
    
    const currentMemberIds = selectedProject.members.map(m => m._id || m);
    let newMemberIds;
    if (currentMemberIds.includes(userId)) {
      newMemberIds = currentMemberIds.filter(id => id !== userId);
    } else {
      newMemberIds = [...currentMemberIds, userId];
    }
    
    // Update local state immediately for UI
    setSelectedProject({ ...selectedProject, members: newMemberIds.map(id => ({ _id: id })) });

    try {
      await api.put(`/projects/${selectedProject._id}/members`, { memberIds: newMemberIds });
      fetchProjects(); // Refresh project list in background
    } catch {
      toast.error('Failed to update members');
      // revert
      setSelectedProject({ ...selectedProject, members: currentMemberIds.map(id => ({ _id: id })) });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Projects</h1>
        {user && (
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-[var(--color-primary-base)] hover:bg-[var(--color-primary-light)] text-white px-4 py-2 rounded-xl text-sm font-medium transition-colors flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            New Project
          </button>
        )}
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(3)].map((_, i) => <Skeleton key={i} className="h-40" />)}
        </div>
      ) : projects.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <div key={project._id} className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl p-6 hover:shadow-lg hover:border-[var(--color-primary-base)]/30 transition-all cursor-pointer group">
              <div className="flex items-start justify-between mb-4">
                <div className="w-10 h-10 rounded-lg bg-[var(--color-primary-base)]/10 text-[var(--color-primary-base)] flex items-center justify-center">
                  <FolderKanban className="w-5 h-5" />
                </div>
                {isProjectAdmin(project) && (
                  <div className="flex items-center gap-2">
                    {isProjectCreator(project) && (
                      <>
                        <button
                          onClick={(e) => { e.stopPropagation(); setEditingProject(project); }}
                          className="p-1.5 text-[var(--color-text-secondary)] hover:text-[var(--color-primary-base)] bg-[var(--color-bg)] rounded-md border border-[var(--color-border)]"
                          title="Edit project"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={(e) => { e.stopPropagation(); setProjectToDelete(project); }}
                          className="p-1.5 text-red-500 hover:text-red-600 bg-red-500/10 rounded-md border border-red-500/20"
                          title="Delete project"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </>
                    )}
                    <button
                      onClick={(e) => { e.stopPropagation(); openMemberModal(project); }}
                      className="text-[var(--color-text-secondary)] hover:text-[var(--color-primary-base)] text-xs font-medium px-2 py-1 bg-[var(--color-bg)] rounded-md border border-[var(--color-border)]"
                    >
                      Members
                    </button>
                  </div>
                )}
              </div>
              <h3 className="text-lg font-semibold mb-2 group-hover:text-[var(--color-primary-base)] transition-colors">{project.name}</h3>
              <p className="text-sm text-[var(--color-text-secondary)] mb-6 line-clamp-2">
                {project.description || 'No description provided.'}
              </p>
              
              <div className="flex items-center justify-between border-t border-[var(--color-border)] pt-4 mt-auto">
                <div className="flex items-center gap-2 text-sm text-[var(--color-text-secondary)]">
                  <Users className="w-4 h-4" />
                  {project.members.length} members
                </div>
                <div className="text-xs text-[var(--color-text-secondary)]">
                  {new Date(project.createdAt).toLocaleDateString()}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <EmptyState
          icon={FolderKanban}
          title="No Projects Yet"
          description="Create your first project to start organizing tasks."
          action={
             user ? (
              <button
                onClick={() => setIsModalOpen(true)}
                className="bg-[var(--color-primary-base)] hover:bg-[var(--color-primary-light)] text-white px-4 py-2 rounded-xl text-sm font-medium transition-colors"
              >
                Create Project
              </button>
             ) : null
          }
        />
      )}

      {/* Simple Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl shadow-xl w-full max-w-md p-6"
            >
              <h2 className="text-xl font-bold mb-4">Create New Project</h2>
              <form onSubmit={handleCreateProject} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1.5">Project Name</label>
                  <input
                    type="text"
                    required
                    value={newProjectName}
                    onChange={(e) => setNewProjectName(e.target.value)}
                    className="w-full bg-transparent border border-[var(--color-border)] focus:border-[var(--color-primary-base)] rounded-xl py-2 px-3 outline-none transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1.5">Description</label>
                  <textarea
                    value={newProjectDesc}
                    onChange={(e) => setNewProjectDesc(e.target.value)}
                    className="w-full bg-transparent border border-[var(--color-border)] focus:border-[var(--color-primary-base)] rounded-xl py-2 px-3 outline-none transition-all resize-none h-24"
                  />
                </div>
                <div className="flex gap-3 justify-end mt-6">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2 rounded-xl text-sm font-medium text-[var(--color-text-secondary)] hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="bg-[var(--color-primary-base)] hover:bg-[var(--color-primary-light)] text-white px-4 py-2 rounded-xl text-sm font-medium transition-colors"
                  >
                    Create
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Edit Project Modal */}
      <AnimatePresence>
        {editingProject && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl shadow-xl w-full max-w-md p-6"
            >
              <h2 className="text-xl font-bold mb-4">Edit Project</h2>
              <form onSubmit={handleUpdateProject} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1.5">Project Name</label>
                  <input
                    type="text"
                    required
                    value={editingProject.name}
                    onChange={(e) => setEditingProject({ ...editingProject, name: e.target.value })}
                    className="w-full bg-transparent border border-[var(--color-border)] focus:border-[var(--color-primary-base)] rounded-xl py-2 px-3 outline-none transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1.5">Description</label>
                  <textarea
                    value={editingProject.description || ''}
                    onChange={(e) => setEditingProject({ ...editingProject, description: e.target.value })}
                    className="w-full bg-transparent border border-[var(--color-border)] focus:border-[var(--color-primary-base)] rounded-xl py-2 px-3 outline-none transition-all resize-none h-24"
                  />
                </div>
                <div className="flex gap-3 justify-end mt-6">
                  <button
                    type="button"
                    onClick={() => setEditingProject(null)}
                    className="px-4 py-2 rounded-xl text-sm font-medium text-[var(--color-text-secondary)] hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="bg-[var(--color-primary-base)] hover:bg-[var(--color-primary-light)] text-white px-4 py-2 rounded-xl text-sm font-medium transition-colors"
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Delete Project Confirmation */}
      <AnimatePresence>
        {projectToDelete && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl shadow-xl w-full max-w-md p-6"
            >
              <h2 className="text-xl font-bold mb-2">Delete Project?</h2>
              <p className="text-sm text-[var(--color-text-secondary)]">
                This will permanently delete "{projectToDelete.name}" and all tasks inside it.
              </p>
              <div className="flex gap-3 justify-end mt-6">
                <button
                  type="button"
                  onClick={() => setProjectToDelete(null)}
                  className="px-4 py-2 rounded-xl text-sm font-medium text-[var(--color-text-secondary)] hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleDeleteProject}
                  className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-xl text-sm font-medium transition-colors"
                >
                  Delete Project
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Member Modal */}
      <AnimatePresence>
        {isMemberModalOpen && selectedProject && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl shadow-xl w-full max-w-md p-6 max-h-[80vh] flex flex-col"
            >
              <h2 className="text-xl font-bold mb-4">Manage Members - {selectedProject.name}</h2>
              <div className="overflow-y-auto space-y-2 flex-1 pr-2">
                {allUsers.map((u) => {
                  const isMember = selectedProject.members.some(m => (m._id || m) === u._id);
                  return (
                    <div key={u._id} className="flex items-center justify-between p-3 rounded-xl border border-[var(--color-border)] bg-[var(--color-bg)]">
                      <div className="flex flex-col">
                        <span className="text-sm font-medium">{u.name} {u._id === user._id ? '(You)' : ''}</span>
                        <span className="text-xs text-[var(--color-text-secondary)]">{u.email}</span>
                      </div>
                      <button
                        onClick={() => handleToggleMember(u._id)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                          isMember 
                            ? 'bg-red-100 text-red-600 hover:bg-red-200 dark:bg-red-900/30 dark:text-red-400' 
                            : 'bg-[var(--color-primary-base)]/10 text-[var(--color-primary-base)] hover:bg-[var(--color-primary-base)]/20'
                        }`}
                      >
                        {isMember ? 'Remove' : 'Add'}
                      </button>
                    </div>
                  );
                })}
              </div>
              <div className="flex justify-end mt-6 pt-4 border-t border-[var(--color-border)]">
                <button
                  onClick={() => setIsMemberModalOpen(false)}
                  className="bg-[var(--color-primary-base)] hover:bg-[var(--color-primary-light)] text-white px-6 py-2 rounded-xl text-sm font-medium transition-colors"
                >
                  Done
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Projects;
