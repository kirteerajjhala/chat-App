const mongoose = require('mongoose');

const conversionSchema = new mongoose.Schema({
  participants:[
  {
    type: mongoose.Schema.Types.ObjectId,
    ref : "User" , // user model ka name
  
  }
  ],

   message:[
     {
    type : mongoose.Schema.Types.ObjectId,
    ref : "Message"
  },
   ],

}, { timestamps: true });

const Conversation =  mongoose.model('Conversation', conversionSchema);

module.exports= Conversation;