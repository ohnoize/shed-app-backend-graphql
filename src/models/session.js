import mongoose from 'mongoose';
import uniqueValidator from 'mongoose-unique-validator';

const sessionSchema = new mongoose.Schema({
  totalLength: {
    type: Number,
    required: true,
  },
  date: {
    type: String,
    required: true
  },
  notes: {
    type: String,
    required: false,
  },
  userID: {
    type: String,
    required: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  individualSubjects: [ {
    name: String,
    length: Number
  } ]
});

sessionSchema.plugin(uniqueValidator);

const Session = mongoose.model('Session', sessionSchema);

export default Session;
