import mongoose from 'mongoose';
import uniqueValidator from 'mongoose-unique-validator';

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    minlength: 3
  },
  passwordHash: {
    type: String,
    required: true
  },
  instrument: {
    type: String,
    required: false
  },
  subjectNotes: [
    {
      subjectID: String,
      date: String,
      notes: String
    }
  ],
  joined: {
    type: String,
    required: true
  },
  sessions: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Session'
    }
  ],
  connections: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
  ]
});

userSchema.plugin(uniqueValidator);

const User = mongoose.model('User', userSchema);

export default User;
