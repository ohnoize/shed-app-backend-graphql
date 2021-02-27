import mongoose from 'mongoose';
import uniqueValidator from 'mongoose-unique-validator';

const subjectSchema = new mongoose.Schema({
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
