const mongoose = require('mongoose');

const UserModelSchema = new mongoose.Schema({
  username:{
    type: String,
    required: [true, 'Please enter a username'],
    trim: true,
    lowercase: true,
    unique: true
  },
  firstname: {
    type: String,
    trim: true,
    lowercase: true
  },
  lastname: {
    type: String,
    trim: true,
    lowercase: true
  },
  password:{
    type: String,
    required: [true, 'Please enter a password'],
    minlength:5
  },
  createon: {
    type: Date,
    default: Date.now,
  },
});

UserModelSchema.post('init', (doc) => {
  console.log('%s has been initialized from the db', doc._id);
});

UserModelSchema.post('validate', (doc) => {
  console.log('%s has been validated (but not saved yet)', doc._id);
});

UserModelSchema.post('save', (doc) => {
  console.log('%s has been saved', doc._id);
});

UserModelSchema.post('remove', (doc) => {
  console.log('%s has been removed', doc._id);
});

const User = mongoose.model("User", UserModelSchema);
module.exports = User;