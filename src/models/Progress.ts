import mongoose, { Schema, Document } from 'mongoose';

export interface IProgress extends Document {
  userId: string;
  moduleId: string;
  lessonId: string;
  completed: boolean;
  score?: number;
  completedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const ProgressSchema = new Schema<IProgress>({
  userId: {
    type: String,
    required: true,
  },
  moduleId: {
    type: String,
    required: true,
  },
  lessonId: {
    type: String,
    required: true,
  },
  completed: {
    type: Boolean,
    default: false,
  },
  score: {
    type: Number,
    min: 0,
    max: 100,
  },
  completedAt: {
    type: Date,
  },
}, {
  timestamps: true,
});

// Compound index to ensure unique progress per user per lesson
ProgressSchema.index({ userId: 1, lessonId: 1 }, { unique: true });

const Progress = mongoose.models.Progress || mongoose.model<IProgress>('Progress', ProgressSchema);

export default Progress;
