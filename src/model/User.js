const mongoose = require('mongoose');
const userSchema = mongoose.Schema({
  firstName: {
    type: String,
    required: true,

  },
  lastName: {
    type: String,
    required: [true, 'Last name is required'],

  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    
 },
  password: {
    type: String,
    
    },
  age: {
    type: Number,
  },
  gender: {
     
    type: String,
  },
  skills: {
    type: [String],
  },
  about: {
    type: String,
    default: "No details provided"

  },
  photoUrl:{
type:String
  }
}, { timestamps: true });
module.exports = mongoose.model('User', userSchema);