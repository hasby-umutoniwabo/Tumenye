import mongoose, { Document, Schema } from 'mongoose';

export interface IGoal extends Document {
  userId: string;
  date: string;
  target: number; // lessons per day
  completed: number;
  achieved: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const GoalSchema: Schema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
    index: true,
  },
  date: {
    type: String, // Store as string for easy comparison (e.g., "2025-11-23")
    required: true,
  },
  target: {
    type: Number,
    required: true,
    default: 2, // Default 2 lessons per day
    min: 1,
    max: 10, // Reasonable maximum
  },
  completed: {
    type: Number,
    required: true,
    default: 0,
    min: 0,
  },
  achieved: {
    type: Boolean,
    required: true,
    default: false,
  },
}, {
  timestamps: true,
});

// Create compound index for unique user-date combinations
GoalSchema.index({ userId: 1, date: 1 }, { unique: true });

const Goal = mongoose.models.Goal || mongoose.model<IGoal>('Goal', GoalSchema);

export default Goal;
