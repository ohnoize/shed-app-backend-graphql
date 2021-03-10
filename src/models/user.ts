import mongoose, { Document, model } from 'mongoose';
import uniqueValidator from 'mongoose-unique-validator';
import { UserType } from '../types';

export interface UserBaseDocument extends UserType, Document {
  passwordHash: string
}

const userSchema = new mongoose.Schema<UserBaseDocument>({
  username: {
    type: String,
    required: true,
    unique: true,
    minlength: 3,
  },
  passwordHash: {
    type: String,
    required: true,
  },
  instrument: {
    type: String,
    required: false,
  },
  timePracticed: {
    type: Number,
    required: true,
  },
  goals: [
    {
      description: {
        type: String,
        required: true,
      },
      subject: {
        type: String,
        required: true,
      },
      elapsedTime: {
        type: Number,
        required: true,
      },
      targetTime: {
        type: Number,
        required: true,
      },
      deadline: {
        type: String,
      },
      passed: {
        type: Boolean,
        required: true,
      },
    },
  ],
  mySubjects: [
    {
      subjectID: {
        type: String,
        required: true,
      },
      subjectName: {
        type: String,
        required: true,
      },
      timePracticed: Number,
      subjectNotes: [
        {
          date: String,
          notes: String,
        },
      ],
    },
  ],
  joined: {
    type: String,
    required: true,
  },
  sessions: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Session',
    },
  ],
  connections: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  ],
});

// eslint-disable-next-line @typescript-eslint/no-explicit-any
userSchema.plugin(uniqueValidator as any);

// const User = mongoose.model('User', userSchema);

export default model<UserBaseDocument>('User', userSchema);
