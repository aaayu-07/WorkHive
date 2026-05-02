import { useState } from 'react';
import { motion } from 'framer-motion';
import { Edit2, Save, Send, Trash2, X, Paperclip, MessageSquare, Paperclip as PaperclipIcon } from 'lucide-react';
import api from '../utils/api';
import toast from 'react-hot-toast';
import { formatDistanceToNow } from 'date-fns';

const TaskDetailModal = ({ task, onClose, onTaskUpdated, onTaskDeleted = () => {}, canManageTask = false, assignableUsers = [] }) => {
  const [commentText, setCommentText] = useState('');
  const [uploading, setUploading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [editForm, setEditForm] = useState({
    title: task.title || '',
    description: task.description || '',
    priority: task.priority || 'Medium',
    dueDate: task.dueDate ? task.dueDate.split('T')[0] : '',
    assignedTo: task.assignedTo?.map(assignee => assignee._id || assignee) || [],
  });

  const handleAssigneeToggle = (userId) => {
    setEditForm(prev => ({
      ...prev,
      assignedTo: prev.assignedTo.includes(userId)
        ? prev.assignedTo.filter(id => id !== userId)
        : [...prev.assignedTo, userId],
    }));
  };

  const handleUpdateTask = async (e) => {
    e.preventDefault();

    try {
      const { data } = await api.put(`/tasks/${task._id}`, {
        title: editForm.title,
        description: editForm.description,
        priority: editForm.priority,
        dueDate: editForm.dueDate || null,
        assignedTo: editForm.assignedTo,
      });
      toast.success('Task updated');
      onTaskUpdated(data);
      setIsEditing(false);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update task');
    }
  };

  const handleDeleteTask = async () => {
    try {
      await api.delete(`/tasks/${task._id}`);
      toast.success('Task deleted');
      onTaskDeleted(task._id);
      onClose();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to delete task');
    }
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    
    try {
      const { data } = await api.post(`/tasks/${task._id}/comments`, { text: commentText });
      onTaskUpdated(data);
      setCommentText('');
    } catch {
      toast.error('Failed to add comment');
    }
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    setUploading(true);
    try {
      await api.post(`/tasks/${task._id}/attachments`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      // the endpoint returns the attachment, let's refetch or manually update task
      // For simplicity, let's call the parent to refetch
      toast.success('File uploaded successfully');
      // trigger a generic task update to refresh data
      const updatedTaskResponse = await api.get(`/tasks/project/${task.projectId}`);
      const updatedTask = updatedTaskResponse.data.find(t => t._id === task._id);
      if (updatedTask) {
        onTaskUpdated(updatedTask);
      }
    } catch {
      toast.error('Failed to upload file');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="relative bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl shadow-xl w-full max-w-3xl max-h-[90vh] flex flex-col overflow-hidden"
      >
        {/* Header */}
        <div className="p-6 border-b border-[var(--color-border)] flex justify-between items-start">
          <div>
            <h2 className="text-2xl font-bold mb-2">{task.title}</h2>
            <div className="flex items-center gap-4 text-sm text-[var(--color-text-secondary)]">
              <span className={`px-2 py-1 rounded text-xs font-medium ${
                task.priority === 'High' ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' :
                task.priority === 'Medium' ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400' :
                'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
              }`}>
                {task.priority} Priority
              </span>
              <span>Status: <strong className="text-[var(--color-text-primary)]">{task.status}</strong></span>
              <div className="flex items-center gap-1">
                <span>Assignees:</span>
                <div className="flex -space-x-2 ml-1">
                  {task.assignedTo?.length > 0 ? (
                    task.assignedTo.map((assignee, idx) => (
                      <div key={idx} className="w-6 h-6 rounded-full bg-[var(--color-primary-base)]/20 border-2 border-[var(--color-surface)] flex items-center justify-center text-[10px] font-bold text-[var(--color-primary-base)]" title={assignee.name}>
                        {assignee.name?.charAt(0).toUpperCase()}
                      </div>
                    ))
                  ) : (
                    <span className="text-[var(--color-text-primary)] font-bold">Unassigned</span>
                  )}
                </div>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {canManageTask && (
              <>
                <button
                  onClick={() => setIsEditing(prev => !prev)}
                  className="p-2 hover:bg-[var(--color-bg)] rounded-full transition-colors text-[var(--color-text-muted)]"
                  title={isEditing ? 'Cancel edit' : 'Edit task'}
                >
                  {isEditing ? <X className="w-5 h-5" /> : <Edit2 className="w-5 h-5" />}
                </button>
                <button
                  onClick={() => setShowDeleteConfirm(true)}
                  className="p-2 hover:bg-red-500/10 rounded-full transition-colors text-red-500"
                  title="Delete task"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </>
            )}
            <button onClick={onClose} className="p-2 hover:bg-[var(--color-bg)] rounded-full transition-colors text-[var(--color-text-muted)]">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 flex flex-col lg:flex-row gap-8">
          {/* Main Content */}
          <div className="flex-1 space-y-6">
            {isEditing && canManageTask ? (
              <form onSubmit={handleUpdateTask} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1.5">Task Title</label>
                  <input
                    type="text"
                    required
                    value={editForm.title}
                    onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                    className="w-full bg-[var(--color-bg)] border border-[var(--color-border)] focus:border-[var(--color-primary-base)] rounded-xl py-2 px-3 outline-none transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1.5">Description</label>
                  <textarea
                    value={editForm.description}
                    onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                    className="w-full bg-[var(--color-bg)] border border-[var(--color-border)] focus:border-[var(--color-primary-base)] rounded-xl py-2 px-3 outline-none transition-all resize-none h-24"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1.5">Priority</label>
                    <select
                      value={editForm.priority}
                      onChange={(e) => setEditForm({ ...editForm, priority: e.target.value })}
                      className="w-full bg-[var(--color-bg)] border border-[var(--color-border)] focus:border-[var(--color-primary-base)] rounded-xl py-2 px-3 outline-none transition-all"
                    >
                      <option value="Low">Low</option>
                      <option value="Medium">Medium</option>
                      <option value="High">High</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1.5">Due Date</label>
                    <input
                      type="date"
                      value={editForm.dueDate}
                      onChange={(e) => setEditForm({ ...editForm, dueDate: e.target.value })}
                      className="w-full bg-[var(--color-bg)] border border-[var(--color-border)] focus:border-[var(--color-primary-base)] rounded-xl py-2 px-3 outline-none transition-all [color-scheme:light] dark:[color-scheme:dark]"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1.5">Assign To</label>
                  <div className="grid grid-cols-2 gap-2 max-h-32 overflow-y-auto border border-[var(--color-border)] p-3 rounded-xl bg-[var(--color-bg)]">
                    {assignableUsers.map(u => (
                      <label key={u._id} className="flex items-center gap-2 text-sm cursor-pointer hover:text-[var(--color-primary-base)] transition-colors">
                        <input
                          type="checkbox"
                          checked={editForm.assignedTo.includes(u._id)}
                          onChange={() => handleAssigneeToggle(u._id)}
                          className="w-4 h-4 rounded border-[var(--color-border)] text-[var(--color-primary-base)] focus:ring-[var(--color-primary-base)]"
                        />
                        <span className="truncate">{u.name}</span>
                      </label>
                    ))}
                  </div>
                </div>
                <div className="flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    className="px-4 py-2 rounded-xl text-sm font-medium text-[var(--color-text-secondary)] hover:bg-[var(--color-border)] transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="bg-[var(--color-primary-base)] hover:bg-[var(--color-primary-light)] text-white px-4 py-2 rounded-xl text-sm font-medium transition-colors flex items-center gap-2"
                  >
                    <Save className="w-4 h-4" />
                    Save
                  </button>
                </div>
              </form>
            ) : (
              <div>
                <h3 className="font-semibold mb-2">Description</h3>
                <p className="text-[var(--color-text-secondary)] text-sm whitespace-pre-wrap">
                  {task.description || 'No description provided.'}
                </p>
              </div>
            )}

            {/* Attachments */}
            <div>
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                <PaperclipIcon className="w-4 h-4" /> Attachments
              </h3>
              <div className="flex flex-wrap gap-3">
                {task.attachments?.map((file, idx) => (
                  <a key={idx} href={file.url} target="_blank" rel="noreferrer" className="flex items-center gap-2 px-3 py-2 bg-[var(--color-bg)] border border-[var(--color-border)] rounded-lg text-sm hover:border-[var(--color-primary-base)] transition-colors">
                    <Paperclip className="w-4 h-4 text-[var(--color-text-muted)]" />
                    <span className="truncate max-w-[150px]">{file.originalName}</span>
                  </a>
                ))}
                
                <label className="flex items-center justify-center gap-2 px-3 py-2 border border-dashed border-[var(--color-border)] rounded-lg text-sm cursor-pointer hover:border-[var(--color-primary-base)] hover:text-[var(--color-primary-base)] transition-colors">
                  <input type="file" className="hidden" onChange={handleFileUpload} disabled={uploading} />
                  {uploading ? 'Uploading...' : 'Add File'}
                </label>
              </div>
            </div>
          </div>

          {/* Comments / Chat */}
          <div className="w-full lg:w-[350px] flex flex-col bg-[var(--color-bg)] border border-[var(--color-border)] rounded-xl overflow-hidden h-[400px] lg:h-auto">
            <div className="p-4 border-b border-[var(--color-border)] font-semibold flex items-center gap-2">
              <MessageSquare className="w-4 h-4" /> Comments
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {task.comments?.length === 0 ? (
                <div className="text-center text-sm text-[var(--color-text-muted)] mt-10">
                  No comments yet. Start the conversation!
                </div>
              ) : (
                task.comments?.map((comment, idx) => (
                  <div key={idx} className="flex gap-3">
                    <div className="w-8 h-8 rounded-full bg-[var(--color-primary-base)]/20 flex items-center justify-center shrink-0 text-xs font-bold text-[var(--color-primary-base)]">
                      {comment.user?.name?.charAt(0)}
                    </div>
                    <div>
                      <div className="flex items-baseline gap-2">
                        <span className="font-semibold text-sm">{comment.user?.name}</span>
                        <span className="text-[10px] text-[var(--color-text-muted)]">
                          {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}
                        </span>
                      </div>
                      <p className="text-sm text-[var(--color-text-secondary)] mt-1">
                        {comment.text}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>
            <div className="p-3 border-t border-[var(--color-border)] bg-[var(--color-surface)]">
              <form onSubmit={handleAddComment} className="flex gap-2 relative">
                <input
                  type="text"
                  placeholder="Type a comment... (use @ to mention)"
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  className="flex-1 bg-[var(--color-bg)] border border-[var(--color-border)] focus:border-[var(--color-primary-base)] rounded-xl py-2 px-3 text-sm outline-none transition-all"
                />
                <button 
                  type="submit" 
                  disabled={!commentText.trim()}
                  className="bg-[var(--color-primary-base)] text-white p-2 rounded-xl disabled:opacity-50 hover:bg-[var(--color-primary-light)] transition-colors flex items-center justify-center"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </div>
          </div>
        </div>

        {showDeleteConfirm && (
          <div className="absolute inset-0 z-10 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl shadow-xl w-full max-w-sm p-6">
              <h3 className="text-lg font-bold mb-2">Delete Task?</h3>
              <p className="text-sm text-[var(--color-text-secondary)]">
                This will permanently delete "{task.title}".
              </p>
              <div className="flex justify-end gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => setShowDeleteConfirm(false)}
                  className="px-4 py-2 rounded-xl text-sm font-medium text-[var(--color-text-secondary)] hover:bg-[var(--color-border)] transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleDeleteTask}
                  className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-xl text-sm font-medium transition-colors"
                >
                  Delete Task
                </button>
              </div>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default TaskDetailModal;
