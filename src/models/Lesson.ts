import mongoose, { Schema, Document } from 'mongoose';

export interface IQuestion {
  question: string;
  options: string[];
  correctAnswer: number;
}

export interface ILesson extends Document {
  title: string;
  content: string;
  moduleId: string;
  order: number;
  quiz: IQuestion[];
  createdAt: Date;
  updatedAt: Date;
}

const QuestionSchema = new Schema<IQuestion>({
  question: {
    type: String,
    required: true,
  },
  options: [{
    type: String,
    required: true,
  }],
  correctAnswer: {
    type: Number,
    required: true,
    min: 0,
    max: 3,
  },
});

const LessonSchema = new Schema<ILesson>({
  title: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  moduleId: {
    type: String,
    required: true,
  },
  order: {
    type: Number,
    required: true,
  },
  quiz: [QuestionSchema],
}, {
  timestamps: true,
});

const Lesson = mongoose.models.Lesson || mongoose.model<ILesson>('Lesson', LessonSchema);

export default Lesson;
