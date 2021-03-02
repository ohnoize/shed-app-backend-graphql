import mongoose, { Document } from 'mongoose';
import uniqueValidator from 'mongoose-unique-validator';
import { SubjectType } from '../types';

interface SubjectBaseDocument extends SubjectType, Document {}

const subjectSchema = new mongoose.Schema<SubjectBaseDocument>({
  name: {
    type: String,
    required: true,
    unique: true
  },
  description: {
    type: String,
    required: false,
  },
  timePracticed: {
    type: Number,
    required: true
  }
});

subjectSchema.plugin(uniqueValidator);

const Subject = mongoose.model('Subject', subjectSchema);

export default Subject;
