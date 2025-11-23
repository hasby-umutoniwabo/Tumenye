import mongoose, { Schema, Document } from 'mongoose';

export interface IStreak extends Document {
  userId: string;
  currentStreak: number;
  longestStreak: number;
  lastActivityDate: Date;
  totalActiveDays: number;
  streakHistory: {
    date: Date;
    lessonsCompleted: number;
  }[];
  createdAt: Date;
  updatedAt: Date;
}

const StreakSchema = new Schema<IStreak>({
  userId: {
    type: String,
    required: true,
    unique: true,
  },
  currentStreak: {
    type: Number,
    default: 0,
    min: 0,
  },
  longestStreak: {
    type: Number,
    default: 0,
    min: 0,
  },
  lastActivityDate: {
    type: Date,
  },
  totalActiveDays: {
    type: Number,
    default: 0,
    min: 0,
  },
  streakHistory: [{
    date: {
      type: Date,
      required: true,
    },
    lessonsCompleted: {
      type: Number,
      required: true,
      min: 0,
    },
  }],
}, {
  timestamps: true,
});

const Streak = mongoose.models.Streak || mongoose.model<IStreak>('Streak', StreakSchema);

export default Streak;
