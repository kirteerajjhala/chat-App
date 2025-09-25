const  mongoose = require('mongoose');

const userSchmea = new mongoose.Schema({
  name: {
    type: String,
 
  },
  username: {
    type: String,
    required: true,
    unique :true
    
  },
    email: {
    type: String,
    required: true
  },
  
    password: {
    type: String,
    required: true,
    minlength : 6
  },
    image: {
    type: String,
    default : '' 
  },

},{timestamps:true});

const User = mongoose.model('User', userSchmea);

module.exports =  User;