const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
  name: {
    type: String,
  },
  email:{
    type:String,
  },
  phone: {
    type: String,
    required: true,
  },
  
});

const User = mongoose.model('Users', userSchema);

module.exports = User;
