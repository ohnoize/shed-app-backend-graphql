import mongoose, { Document, model } from 'mongoose';
import uniqueValidator from 'mongoose-unique-validator';
import { SubjectType } from '../types';

export interface SubjectBaseDocument extends SubjectType, Document {}

const subjectSchema = new mongoose.Schema<SubjectBaseDocument>({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  description: {
    type: String,
    required: false,
  },
  timePracticed: {
    type: Number,
    required: true,
  },
  links: [
    {
      url: String,
      description: String,
    },
  ],
});

// eslint-disable-next-line @typescript-eslint/no-explicit-any
subjectSchema.plugin(uniqueValidator as any);

export default model<SubjectBaseDocument>('Subject', subjectSchema);
