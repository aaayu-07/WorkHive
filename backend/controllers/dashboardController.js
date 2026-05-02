import Task from '../models/Task.js';
import Activity from '../models/Activity.js';
import Project from '../models/Project.js';
import mongoose from 'mongoose';

// @desc    Get dashboard stats
// @route   GET /api/dashboard/stats
// @access  Private
export const getDashboardStats = async (req, res) => {
  try {
    const isAdmin = req.user.role === 'admin';
    let projectMatch = {};

    if (!isAdmin) {
      const projects = await Project.find({ members: req.user._id }).select('_id');
      const projectIds = projects.map(p => p._id);
      projectMatch = {
        projectId: { $in: projectIds },
        assignedTo: req.user._id,
      };
    }

    // 1. Total tasks
    const totalTasks = await Task.countDocuments(projectMatch);

    // 2. Completed tasks
    const completedTasks = await Task.countDocuments({ ...projectMatch, status: 'Done' });

    // 3. Overdue tasks (status not done and due date in past)
    const currentDate = new Date();
    const overdueTasks = await Task.countDocuments({
      ...projectMatch,
      status: { $ne: 'Done' },
      dueDate: { $lt: currentDate }
    });

    // 4. Tasks per status (for charts)
    const tasksByStatus = await Task.aggregate([
      { $match: Object.keys(projectMatch).length > 0 ? projectMatch : {} },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);

    // 4b. Tasks per user
    const tasksPerUser = await Task.aggregate([
      { $match: Object.keys(projectMatch).length > 0 ? projectMatch : {} },
      { $match: { assignedTo: { $exists: true, $not: { $size: 0 } } } },
      { $unwind: '$assignedTo' },
      {
        $group: {
          _id: '$assignedTo',
          count: { $sum: 1 }
        }
      },
      {
        $lookup: {
          from: 'users',
          localField: '_id',
          foreignField: '_id',
          as: 'user'
        }
      },
      { $unwind: '$user' },
      {
        $project: {
          _id: 1,
          count: 1,
          name: '$user.name',
          email: '$user.email'
        }
      }
    ]);

    // 5. Recent Activity
    let activityMatch = {};
    if (!isAdmin) {
       const projects = await Project.find({ members: req.user._id }).select('_id');
       const projectIds = projects.map(p => p._id);
       activityMatch = { project: { $in: projectIds } };
    }

    const recentActivity = await Activity.find(activityMatch)
      .populate('user', 'name email')
      .populate('project', 'name')
      .sort({ createdAt: -1 })
      .limit(50);

    res.json({
      totalTasks,
      completedTasks,
      overdueTasks,
      tasksByStatus,
      tasksPerUser,
      recentActivity
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
