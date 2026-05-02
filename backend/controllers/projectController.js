import Project from '../models/Project.js';
import Activity from '../models/Activity.js';
import User from '../models/User.js';
import Task from '../models/Task.js';

const isProjectAdmin = (project, user) => {
  return user.role === 'admin' || project.createdBy.toString() === user._id.toString();
};

const isProjectCreator = (project, user) => {
  return project.createdBy.toString() === user._id.toString();
};

const isProjectMember = (project, user) => {
  return project.members.some(memberId => memberId.toString() === user._id.toString());
};

const uniqueMemberIds = (memberIds = [], creatorId) => {
  const ids = Array.isArray(memberIds) ? memberIds : [];
  return [...new Set([...ids.map(id => id.toString()), creatorId.toString()])];
};

// @desc    Get all projects (for admin) or user's projects
// @route   GET /api/projects
// @access  Private
export const getProjects = async (req, res) => {
  try {
    let projects;
    if (req.user.role === 'admin') {
      projects = await Project.find({}).populate('createdBy', 'name email').populate('members', 'name email');
    } else {
      projects = await Project.find({ members: req.user._id }).populate('createdBy', 'name email').populate('members', 'name email');
    }
    res.json(projects);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Create a project
// @route   POST /api/projects
// @access  Private
export const createProject = async (req, res) => {
  const { name, description, memberIds } = req.body;

  if (!name?.trim()) {
    return res.status(400).json({ message: 'Project name is required' });
  }

  try {
    const project = new Project({
      name: name.trim(),
      description,
      createdBy: req.user._id,
      members: uniqueMemberIds(memberIds, req.user._id),
    });

    const createdProject = await project.save();

    await Activity.create({
      user: req.user._id,
      action: 'created project',
      details: name,
      project: createdProject._id,
    });

    res.status(201).json(createdProject);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get project by ID
// @route   GET /api/projects/:id
// @access  Private
export const getProjectById = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    if (!isProjectAdmin(project, req.user) && !isProjectMember(project, req.user)) {
      return res.status(403).json({ message: 'Not authorized to view this project' });
    }

    const populatedProject = await project.populate([
      { path: 'createdBy', select: 'name email' },
      { path: 'members', select: 'name email' },
    ]);

    res.json(populatedProject);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get all users for assignment
// @route   GET /api/projects/users
// @access  Private
export const getUsers = async (req, res) => {
  try {
    const users = await User.find({}).select('-password');
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};
// @desc    Update project members
// @route   PUT /api/projects/:id/members
// @access  Private (Project Admin)
export const updateProjectMembers = async (req, res) => {
  const { memberIds } = req.body;

  if (!Array.isArray(memberIds)) {
    return res.status(400).json({ message: 'memberIds must be an array' });
  }

  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    if (!isProjectAdmin(project, req.user)) {
      return res.status(403).json({ message: 'Only project admins can manage members' });
    }

    project.members = uniqueMemberIds(memberIds, project.createdBy);
    const updatedProject = await project.save();

    await Activity.create({
      user: req.user._id,
      action: 'updated project members',
      details: project.name,
      project: project._id,
    });

    const populatedProject = await updatedProject.populate([
      { path: 'createdBy', select: 'name email' },
      { path: 'members', select: 'name email' },
    ]);

    res.json(populatedProject);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Update project details
// @route   PUT /api/projects/:id
// @access  Private (Project Creator)
export const updateProject = async (req, res) => {
  const { name, description } = req.body;

  if (!name?.trim()) {
    return res.status(400).json({ message: 'Project name is required' });
  }

  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    if (!isProjectMember(project, req.user)) {
      return res.status(403).json({ message: 'Not authorized to access this project' });
    }

    if (!isProjectCreator(project, req.user)) {
      return res.status(403).json({ message: 'Only the project creator can edit this project' });
    }

    project.name = name.trim();
    project.description = description ?? project.description;

    const updatedProject = await project.save();

    await Activity.create({
      user: req.user._id,
      action: 'updated project',
      details: updatedProject.name,
      project: updatedProject._id,
    });

    const populatedProject = await updatedProject.populate([
      { path: 'createdBy', select: 'name email' },
      { path: 'members', select: 'name email' },
    ]);

    res.json(populatedProject);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Delete project
// @route   DELETE /api/projects/:id
// @access  Private (Project Creator)
export const deleteProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    if (!isProjectMember(project, req.user)) {
      return res.status(403).json({ message: 'Not authorized to access this project' });
    }

    if (!isProjectCreator(project, req.user)) {
      return res.status(403).json({ message: 'Only the project creator can delete this project' });
    }

    await Task.deleteMany({ projectId: project._id });
    await Activity.deleteMany({ project: project._id });
    await project.deleteOne();

    res.json({ message: 'Project deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
