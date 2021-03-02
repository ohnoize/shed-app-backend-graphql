import mongoose, { Document, model } from 'mongoose';
import uniqueValidator from 'mongoose-unique-validator';
import { UserType } from '../types';

export interface UserBaseDocument extends UserType, Document {
  user: { date: string; notes: string; SubjectID: string; };
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
  subjectNotes: [
    {
      subjectID: String,
      date: String,
      notes: String,
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

userSchema.plugin(uniqueValidator);

// const User = mongoose.model('User', userSchema);

export default model<UserBaseDocument>('User', userSchema);
