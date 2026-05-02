import Task from '../models/Task.js';
import Activity from '../models/Activity.js';
import Notification from '../models/Notification.js';
import Project from '../models/Project.js';

const validStatuses = ['To Do', 'In Progress', 'Done'];
const validPriorities = ['Low', 'Medium', 'High'];

const createNotification = async (userId, message, type, link) => {
  if (userId) {
    await Notification.create({ user: userId, message, type, link });
  }
};

const isProjectAdmin = (project, user) => {
  return user.role === 'admin' || project.createdBy.toString() === user._id.toString();
};

const isProjectMember = (project, user) => {
  return project.members.some(memberId => memberId.toString() === user._id.toString());
};

const isAssignedToTask = (task, user) => {
  return task.assignedTo.some(id => id.toString() === user._id.toString());
};

const getAccessibleProject = async (projectId, user) => {
  const project = await Project.findById(projectId);

  if (!project) {
    return { status: 404, message: 'Project not found' };
  }

  if (!isProjectAdmin(project, user) && !isProjectMember(project, user)) {
    return { status: 403, message: 'Not authorized to access this project' };
  }

  return { project };
};

const getTaskWithProject = async (taskId, user) => {
  const task = await Task.findById(taskId);

  if (!task) {
    return { status: 404, message: 'Task not found' };
  }

  const access = await getAccessibleProject(task.projectId, user);

  if (access.status) {
    return access;
  }

  return { task, project: access.project };
};

const normalizeAssignees = (assignedTo) => {
  const ids = Array.isArray(assignedTo) ? assignedTo : (assignedTo ? [assignedTo] : []);
  return [...new Set(ids.map(id => id.toString()))];
};

const allUsersBelongToProject = (userIds, project) => {
  const projectMemberIds = project.members.map(id => id.toString());
  return userIds.every(userId => projectMemberIds.includes(userId));
};

// @desc    Get all tasks for a project
// @route   GET /api/tasks/project/:projectId
// @access  Private
export const getTasksByProject = async (req, res) => {
  try {
    const access = await getAccessibleProject(req.params.projectId, req.user);

    if (access.status) {
      return res.status(access.status).json({ message: access.message });
    }

    const taskFilter = isProjectAdmin(access.project, req.user)
      ? { projectId: req.params.projectId }
      : { projectId: req.params.projectId, assignedTo: req.user._id };

    const tasks = await Task.find(taskFilter)
      .populate('assignedTo', 'name email')
      .populate('createdBy', 'name email');

    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Create a task
// @route   POST /api/tasks
// @access  Private
export const createTask = async (req, res) => {
  const { title, description, assignedTo, projectId, priority, dueDate } = req.body;

  if (!title?.trim()) {
    return res.status(400).json({ message: 'Task title is required' });
  }

  if (!projectId) {
    return res.status(400).json({ message: 'Project is required' });
  }

  if (priority && !validPriorities.includes(priority)) {
    return res.status(400).json({ message: 'Priority must be Low, Medium, or High' });
  }

  try {
    const access = await getAccessibleProject(projectId, req.user);

    if (access.status) {
      return res.status(access.status).json({ message: access.message });
    }

    if (!isProjectAdmin(access.project, req.user)) {
      return res.status(403).json({ message: 'Only project admins can create tasks' });
    }

    const assigneeIds = normalizeAssignees(assignedTo);

    if (!allUsersBelongToProject(assigneeIds, access.project)) {
      return res.status(400).json({ message: 'Tasks can only be assigned to project members' });
    }

    const task = new Task({
      title: title.trim(),
      description,
      assignedTo: assigneeIds,
      projectId,
      priority,
      dueDate,
      createdBy: req.user._id,
      status: 'To Do',
    });

    const createdTask = await task.save();

    await Activity.create({
      user: req.user._id,
      action: 'created task',
      details: title,
      project: projectId,
    });

    if (task.assignedTo && task.assignedTo.length > 0) {
      for (const userId of task.assignedTo) {
        if (userId.toString() !== req.user._id.toString()) {
          await createNotification(
            userId,
            `You have been assigned to a new task: ${title}`,
            'task_assigned',
            `/tasks?project=${projectId}`
          );
        }
      }
    }

    res.status(201).json(createdTask);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Update task status (Kanban drag & drop)
// @route   PUT /api/tasks/:id/status
// @access  Private
export const updateTaskStatus = async (req, res) => {
  const { status } = req.body;

  if (!validStatuses.includes(status)) {
    return res.status(400).json({ message: 'Status must be To Do, In Progress, or Done' });
  }

  try {
    const access = await getTaskWithProject(req.params.id, req.user);

    if (access.status) {
      return res.status(access.status).json({ message: access.message });
    }

    const { task, project } = access;

    if (!isProjectAdmin(project, req.user) && !isAssignedToTask(task, req.user)) {
      return res.status(403).json({ message: 'Only assignees or project admins can update status' });
    }

    task.status = status;
    await task.save();

    const updatedTask = await Task.findById(task._id)
      .populate('assignedTo', 'name email')
      .populate('createdBy', 'name email')
      .populate('comments.user', 'name email');

    await Activity.create({
      user: req.user._id,
      action: `moved task to ${status}`,
      details: task.title,
      project: task.projectId,
    });

    if (status === 'Done' && task.createdBy && task.createdBy.toString() !== req.user._id.toString()) {
      await createNotification(
        task.createdBy,
        `Task "${task.title}" has been completed by ${req.user.name}`,
        'task_completed',
        `/tasks?project=${task.projectId}`
      );
    }

    res.json(updatedTask);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Update task details
// @route   PUT /api/tasks/:id
// @access  Private
export const updateTask = async (req, res) => {
  const { title, description, assignedTo, priority, dueDate } = req.body;

  if (priority && !validPriorities.includes(priority)) {
    return res.status(400).json({ message: 'Priority must be Low, Medium, or High' });
  }

  try {
    const access = await getTaskWithProject(req.params.id, req.user);

    if (access.status) {
      return res.status(access.status).json({ message: access.message });
    }

    const { task, project } = access;

    if (!isProjectAdmin(project, req.user)) {
      return res.status(403).json({ message: 'Only project admins can edit task details' });
    }

    const assigneeIds = assignedTo === undefined
      ? task.assignedTo.map(id => id.toString())
      : normalizeAssignees(assignedTo);

    if (!allUsersBelongToProject(assigneeIds, project)) {
      return res.status(400).json({ message: 'Tasks can only be assigned to project members' });
    }

    task.title = title?.trim() || task.title;
    task.description = description ?? task.description;
    task.assignedTo = assigneeIds;
    task.priority = priority || task.priority;
    task.dueDate = dueDate ?? task.dueDate;

    await task.save();

    const updatedTask = await Task.findById(task._id)
      .populate('assignedTo', 'name email')
      .populate('createdBy', 'name email')
      .populate('comments.user', 'name email');

    await Activity.create({
      user: req.user._id,
      action: 'updated task',
      details: task.title,
      project: task.projectId,
    });

    res.json(updatedTask);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Delete a task
// @route   DELETE /api/tasks/:id
// @access  Private
export const deleteTask = async (req, res) => {
  try {
    const access = await getTaskWithProject(req.params.id, req.user);

    if (access.status) {
      return res.status(access.status).json({ message: access.message });
    }

    const { task, project } = access;

    if (!isProjectAdmin(project, req.user)) {
      return res.status(403).json({ message: 'Only project admins can delete tasks' });
    }

    await task.deleteOne();
    
    await Activity.create({
      user: req.user._id,
      action: 'deleted task',
      details: task.title,
      project: task.projectId,
    });

    res.json({ message: 'Task removed' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Add a comment to a task
// @route   POST /api/tasks/:id/comments
// @access  Private
export const addComment = async (req, res) => {
  const { text, mentionedUsers } = req.body;

  if (!text?.trim()) {
    return res.status(400).json({ message: 'Comment text is required' });
  }
  
  try {
    const access = await getTaskWithProject(req.params.id, req.user);

    if (access.status) {
      return res.status(access.status).json({ message: access.message });
    }

    const { task, project } = access;

    if (!isProjectAdmin(project, req.user) && !isAssignedToTask(task, req.user)) {
      return res.status(403).json({ message: 'Only assignees or project admins can comment on this task' });
    }

    const comment = {
      user: req.user._id,
      text: text.trim(),
      createdAt: new Date(),
    };

    task.comments.push(comment);
    await task.save();
    
    const populatedTask = await Task.findById(task._id)
      .populate('comments.user', 'name email')
      .populate('assignedTo', 'name email')
      .populate('createdBy', 'name email');

    // Handle mentions
    if (mentionedUsers && mentionedUsers.length > 0) {
      for (const userId of mentionedUsers) {
        if (userId !== req.user._id.toString()) {
          await createNotification(
            userId,
            `${req.user.name} mentioned you in a comment on "${task.title}"`,
            'mention',
            `/tasks?project=${task.projectId}`
          );
        }
      }
    }

    res.status(201).json(populatedTask);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Upload an attachment to a task
// @route   POST /api/tasks/:id/attachments
// @access  Private
export const uploadAttachment = async (req, res) => {
  try {
    const access = await getTaskWithProject(req.params.id, req.user);

    if (access.status) {
      return res.status(access.status).json({ message: access.message });
    }

    const { task, project } = access;

    if (!isProjectAdmin(project, req.user) && !isAssignedToTask(task, req.user)) {
      return res.status(403).json({ message: 'Only assignees or project admins can upload attachments' });
    }

    if (!req.file) return res.status(400).json({ message: 'No file provided' });

    const attachment = {
      url: req.file.path,
      public_id: req.file.filename,
      originalName: req.file.originalname,
      createdAt: new Date(),
    };

    task.attachments.push(attachment);
    await task.save();

    res.status(201).json(attachment);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
