import mongoose from 'mongoose';

const activitySchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    action: {
      type: String,
      required: true,
      // e.g., 'created task', 'moved task', 'created project'
    },
    details: {
      type: String, // additional details, e.g. 'Task Name to Done'
    },
    project: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Project',
    },
  },
  { timestamps: true }
);

const Activity = mongoose.model('Activity', activitySchema);
export default Activity;
