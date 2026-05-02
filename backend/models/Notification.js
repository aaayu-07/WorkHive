import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      enum: ['task_assigned', 'task_completed', 'overdue', 'member_added', 'mention'],
      required: true,
    },
    isRead: {
      type: Boolean,
      default: false,
    },
    link: {
      type: String, // Optional URL or reference to navigate to when clicked
    },
  },
  { timestamps: true }
);

const Notification = mongoose.model('Notification', notificationSchema);
export default Notification;
