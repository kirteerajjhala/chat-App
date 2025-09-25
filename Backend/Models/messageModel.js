const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref : "User" , // user model ka name
    required :true
  },
   receiver: {
    type: mongoose.Schema.Types.ObjectId,
    ref : "User" , // user model ka name
    required :true
  },
   message: {
    type: String, 
   default : ""
  },
  image :{
    type :String,
    default : ""
  }
}, { timestamps: true });

const Message =  mongoose.model('Message', messageSchema);

module.exports= Message;