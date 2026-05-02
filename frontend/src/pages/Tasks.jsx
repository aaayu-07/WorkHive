import { useState, useEffect, useMemo } from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import api from '../utils/api';
import Skeleton from '../components/Skeleton';
import toast from 'react-hot-toast';
import { Plus, Calendar as CalendarIcon, List, Search } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import TaskDetailModal from '../components/TaskDetailModal';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';

const columns = ['To Do', 'In Progress', 'Done'];

const Tasks = () => {
  const [allTasks, setAllTasks] = useState([]);
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState('');
  const [loading, setLoading] = useState(true);
  
  // Modals & Views
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null); // for detail modal
  const [viewMode, setViewMode] = useState('kanban'); // 'kanban' | 'calendar'

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [filterPriority, setFilterPriority] = useState('');
  const [filterAssignee, setFilterAssignee] = useState('');

  const [newTask, setNewTask] = useState({ title: '', description: '', priority: 'Medium', assignedTo: [], dueDate: '' });
  const [users, setUsers] = useState([]);
  const { user } = useAuth();
  const selectedProjectDetails = projects.find(project => project._id === selectedProject);
  const isSelectedProjectAdmin = user?.role === 'admin' || (selectedProjectDetails?.createdBy?._id || selectedProjectDetails?.createdBy) === user?._id;
  const assignableUsers = selectedProjectDetails?.members || users;

  const fetchTasks = async (projectId) => {
    setLoading(true);
    try {
      const { data } = await api.get(`/tasks/project/${projectId}`);
      setAllTasks(data);
    } catch {
      toast.error('Failed to fetch tasks');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const loadInitialData = async () => {
      try {
        const [{ data: projectData }, { data: userData }] = await Promise.all([
          api.get('/projects'),
          api.get('/projects/users'),
        ]);

        setProjects(projectData);
        setUsers(userData);

        if (projectData.length > 0) {
          setSelectedProject(projectData[0]._id);
        } else {
          setLoading(false);
        }
      } catch {
        toast.error('Failed to load task workspace');
        setLoading(false);
      }
    };

    loadInitialData();
  }, []);

  useEffect(() => {
    if (!selectedProject) return;

    const loadProjectTasks = async () => {
      setLoading(true);
      try {
        const { data } = await api.get(`/tasks/project/${selectedProject}`);
        setAllTasks(data);
      } catch {
        toast.error('Failed to fetch tasks');
      } finally {
        setLoading(false);
      }
    };

    loadProjectTasks();
  }, [selectedProject]);

  const filteredTasks = useMemo(() => {
    return allTasks.filter(task => {
      const matchSearch = task.title.toLowerCase().includes(searchQuery.toLowerCase());
      const matchStatus = filterStatus ? task.status === filterStatus : true;
      const matchPriority = filterPriority ? task.priority === filterPriority : true;
      const matchAssignee = filterAssignee ? task.assignedTo?.some(a => a._id === filterAssignee) : true;
      return matchSearch && matchStatus && matchPriority && matchAssignee;
    });
  }, [allTasks, searchQuery, filterStatus, filterPriority, filterAssignee]);

  const groupedTasks = useMemo(() => {
    const grouped = { 'To Do': [], 'In Progress': [], 'Done': [] };
    filteredTasks.forEach(task => {
      if (grouped[task.status]) {
        grouped[task.status].push(task);
      }
    });
    return grouped;
  }, [filteredTasks]);

  const calendarEvents = useMemo(() => {
    return filteredTasks.filter(t => t.dueDate).map(task => ({
      id: task._id,
      title: task.title,
      date: task.dueDate.split('T')[0],
      backgroundColor: task.status === 'Done' ? '#10b981' : task.status === 'In Progress' ? '#3b82f6' : '#f59e0b',
      borderColor: 'transparent',
      extendedProps: { task }
    }));
  }, [filteredTasks]);

  const onDragEnd = async (result) => {
    const { destination, source, draggableId } = result;

    if (!destination) return;
    if (destination.droppableId === source.droppableId && destination.index === source.index) return;

    const destCol = destination.droppableId;

    // Optimistic update
    const updatedTasks = allTasks.map(t => {
      if (t._id === draggableId) {
        return { ...t, status: destCol };
      }
      return t;
    });
    setAllTasks(updatedTasks);

    try {
      await api.put(`/tasks/${draggableId}/status`, { status: destCol });
      toast.success(`Moved to ${destCol}`);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update task status');
      fetchTasks(selectedProject); // Revert on error
    }
  };

  const handleCreateTask = async (e) => {
    e.preventDefault();
    if (!selectedProject) return toast.error('Select a project first');
    try {
      await api.post('/tasks', {
        title: newTask.title,
        description: newTask.description,
        assignedTo: newTask.assignedTo,
        priority: newTask.priority,
        dueDate: newTask.dueDate || null,
        projectId: selectedProject
      });
      toast.success('Task created');
      setIsCreateModalOpen(false);
      setNewTask({ title: '', description: '', priority: 'Medium', assignedTo: [], dueDate: '' });
      fetchTasks(selectedProject);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to create task');
    }
  };

  const handleTaskUpdated = (updatedTask) => {
    setAllTasks(prev => prev.map(t => t._id === updatedTask._id ? updatedTask : t));
    setSelectedTask(updatedTask);
  };

  const handleTaskDeleted = (taskId) => {
    setAllTasks(prev => prev.filter(t => t._id !== taskId));
    setSelectedTask(null);
  };

  const handleAssigneeToggle = (userId) => {
    setNewTask(prev => ({
      ...prev,
      assignedTo: prev.assignedTo.includes(userId)
        ? prev.assignedTo.filter(id => id !== userId)
        : [...prev.assignedTo, userId]
    }));
  };

  const priorityColors = {
    Low: 'bg-[var(--color-primary-base)]/10 text-[var(--color-primary-base)] dark:bg-[var(--color-primary-base)]/20',
    Medium: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
    High: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
  };

  return (
    <div className="h-full flex flex-col">
      {/* Header & Controls */}
      <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center mb-6 gap-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <h1 className="text-2xl font-bold">Tasks</h1>
          <select 
            value={selectedProject}
            onChange={(e) => setSelectedProject(e.target.value)}
            className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-lg py-1.5 px-3 text-sm focus:outline-none focus:border-[var(--color-primary-base)]"
          >
            {projects.length === 0 ? (
              <option value="">No projects available</option>
            ) : (
              projects.map(p => (
                <option key={p._id} value={p._id}>{p.name}</option>
              ))
            )}
          </select>
        </div>
        
        <div className="flex flex-wrap items-center gap-3 w-full xl:w-auto">
          {/* Filters */}
          <div className="relative flex-1 sm:min-w-[200px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--color-text-secondary)]" />
            <input 
              type="text" 
              placeholder="Search tasks..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-lg text-sm focus:outline-none focus:border-[var(--color-primary-base)]"
            />
          </div>
          <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)} className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-lg py-2 px-3 text-sm focus:outline-none">
            <option value="">All Status</option>
            <option value="To Do">To Do</option>
            <option value="In Progress">In Progress</option>
            <option value="Done">Done</option>
          </select>
          <select value={filterPriority} onChange={e => setFilterPriority(e.target.value)} className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-lg py-2 px-3 text-sm focus:outline-none">
            <option value="">All Priorities</option>
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>
          <select value={filterAssignee} onChange={e => setFilterAssignee(e.target.value)} className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-lg py-2 px-3 text-sm focus:outline-none">
            <option value="">All Assignees</option>
            {assignableUsers.map(m => (
              <option key={m._id} value={m._id}>{m.name}</option>
            ))}
          </select>

          {/* View Toggles */}
          <div className="flex items-center bg-[var(--color-surface)] border border-[var(--color-border)] rounded-lg p-1">
            <button onClick={() => setViewMode('kanban')} className={`p-1.5 rounded-md ${viewMode === 'kanban' ? 'bg-[var(--color-bg)] shadow-sm text-[var(--color-primary-base)]' : 'text-[var(--color-text-secondary)]'}`}>
              <List className="w-4 h-4" />
            </button>
            <button onClick={() => setViewMode('calendar')} className={`p-1.5 rounded-md ${viewMode === 'calendar' ? 'bg-[var(--color-bg)] shadow-sm text-[var(--color-primary-base)]' : 'text-[var(--color-text-secondary)]'}`}>
              <CalendarIcon className="w-4 h-4" />
            </button>
          </div>

          {isSelectedProjectAdmin && (
            <button
              onClick={() => setIsCreateModalOpen(true)}
              disabled={!selectedProject}
              className="bg-[var(--color-primary-base)] hover:bg-[var(--color-primary-light)] text-white px-4 py-2 rounded-xl text-sm font-medium transition-colors flex items-center gap-2 disabled:opacity-50 ml-auto"
            >
              <Plus className="w-4 h-4" />
              New Task
            </button>
          )}
        </div>
      </div>

      {loading ? (
        <div className="flex gap-6 h-full overflow-hidden">
          {[1, 2, 3].map(i => (
             <div key={i} className="flex-1 bg-gray-50/50 dark:bg-[#111827]/30 rounded-2xl p-4 flex flex-col gap-4">
               <Skeleton className="h-6 w-1/3" />
               <Skeleton className="h-32" />
               <Skeleton className="h-32" />
             </div>
          ))}
        </div>
      ) : viewMode === 'kanban' ? (
        <div className="flex-1 overflow-x-auto overflow-y-hidden">
          <DragDropContext onDragEnd={onDragEnd}>
            <div className="flex gap-6 h-full min-w-max pb-4">
              {columns.map(columnId => (
                <div key={columnId} className="w-[320px] shrink-0 bg-gray-50/50 dark:bg-[#111827]/50 rounded-2xl p-4 flex flex-col max-h-full border border-[var(--color-border)]">
                  <div className="flex items-center justify-between mb-4 px-2">
                    <h3 className="font-semibold text-sm flex items-center gap-2">
                      {columnId}
                      <span className="bg-gray-200 dark:bg-gray-700 text-xs py-0.5 px-2 rounded-full">
                        {groupedTasks[columnId]?.length || 0}
                      </span>
                    </h3>
                  </div>

                  <Droppable droppableId={columnId}>
                    {(provided, snapshot) => (
                      <div
                        {...provided.droppableProps}
                        ref={provided.innerRef}
                        className={`flex-1 overflow-y-auto min-h-[150px] transition-colors rounded-xl p-2 -mx-2 ${snapshot.isDraggingOver ? 'bg-green-50/50 dark:bg-green-900/10' : ''}`}
                      >
                        {groupedTasks[columnId]?.map((task, index) => {
                          const isDragDisabled = !isSelectedProjectAdmin && !task.assignedTo?.some(a => a._id === user?._id);
                          return (
                          <Draggable key={task._id} draggableId={task._id} index={index} isDragDisabled={isDragDisabled}>
                            {(provided, snapshot) => (
                              <div
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                                onClick={() => setSelectedTask(task)}
                                className={`bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl p-4 mb-3 shadow-sm hover:shadow transition-shadow cursor-pointer ${snapshot.isDragging ? 'shadow-lg ring-2 ring-[var(--color-primary-base)] ring-opacity-50 rotate-2' : ''}`}
                              >
                                <div className="flex justify-between items-start mb-2 gap-2">
                                  <h4 className="font-medium text-sm leading-snug">{task.title}</h4>
                                </div>
                                <div className="flex items-center justify-between mt-4">
                                  <span className={`text-[10px] font-medium px-2 py-1 rounded-md ${priorityColors[task.priority]}`}>
                                    {task.priority}
                                  </span>
                                  <div className="flex -space-x-2">
                                    {task.assignedTo?.length > 0 ? (
                                      task.assignedTo.map((assignee, idx) => (
                                        <div key={idx} className="w-6 h-6 rounded-full bg-gray-200 dark:bg-gray-700 border-2 border-[var(--color-surface)] flex items-center justify-center text-[10px] font-bold" title={assignee.name}>
                                          {assignee.name?.charAt(0).toUpperCase()}
                                        </div>
                                      ))
                                    ) : (
                                      <div className="w-6 h-6 rounded-full bg-gray-200 dark:bg-gray-700 border-2 border-[var(--color-surface)] flex items-center justify-center text-[10px] font-bold">?</div>
                                    )}
                                  </div>
                                </div>
                              </div>
                            )}
                          </Draggable>
                          );
                        })}
                        {provided.placeholder}
                      </div>
                    )}
                  </Droppable>
                </div>
              ))}
            </div>
          </DragDropContext>
        </div>
      ) : (
        <div className="flex-1 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl p-4 overflow-y-auto">
          <FullCalendar
            plugins={[ dayGridPlugin, interactionPlugin ]}
            initialView="dayGridMonth"
            events={calendarEvents}
            eventClick={(info) => {
              setSelectedTask(info.event.extendedProps.task);
            }}
            headerToolbar={{
              left: 'prev,next today',
              center: 'title',
              right: 'dayGridMonth,dayGridWeek'
            }}
            height="100%"
          />
        </div>
      )}

      {/* Task Creation Modal */}
      <AnimatePresence>
        {isCreateModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl shadow-xl w-full max-w-md p-6"
            >
              <h2 className="text-xl font-bold mb-4">Create New Task</h2>
              <form onSubmit={handleCreateTask} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1.5">Task Title</label>
                  <input
                    type="text"
                    required
                    value={newTask.title}
                    onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                    className="w-full bg-[var(--color-bg)] border border-[var(--color-border)] focus:border-[var(--color-primary-base)] rounded-xl py-2 px-3 outline-none transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1.5">Description</label>
                  <textarea
                    value={newTask.description}
                    onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                    className="w-full bg-[var(--color-bg)] border border-[var(--color-border)] focus:border-[var(--color-primary-base)] rounded-xl py-2 px-3 outline-none transition-all resize-none h-20"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1.5">Priority</label>
                    <select
                      value={newTask.priority}
                      onChange={(e) => setNewTask({ ...newTask, priority: e.target.value })}
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
                      value={newTask.dueDate}
                      onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })}
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
                          checked={newTask.assignedTo.includes(u._id)}
                          onChange={() => handleAssigneeToggle(u._id)}
                          className="w-4 h-4 rounded border-[var(--color-border)] text-[var(--color-primary-base)] focus:ring-[var(--color-primary-base)]"
                        />
                        <span className="truncate">{u.name}</span>
                      </label>
                    ))}
                  </div>
                </div>
                <div className="flex gap-3 justify-end mt-6">
                  <button
                    type="button"
                    onClick={() => setIsCreateModalOpen(false)}
                    className="px-4 py-2 rounded-xl text-sm font-medium text-[var(--color-text-secondary)] hover:bg-[var(--color-border)] transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="bg-[var(--color-primary-base)] hover:bg-[var(--color-primary-light)] text-white px-4 py-2 rounded-xl text-sm font-medium transition-colors"
                  >
                    Create Task
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Task Details Modal */}
      <AnimatePresence>
        {selectedTask && (
          <TaskDetailModal 
            task={selectedTask} 
            onClose={() => setSelectedTask(null)} 
            onTaskUpdated={handleTaskUpdated} 
            onTaskDeleted={handleTaskDeleted}
            canManageTask={isSelectedProjectAdmin}
            assignableUsers={assignableUsers}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default Tasks;
