const mongoose = require('mongoose');

const GroupChatSchema = new mongoose.Schema({
  from_user: {
    type: String,
    required: true
  },
  room: {
    type: String,
    required: true
  },
  message: {
    type: String,
    required: true
  },
  date_sent:{
    type: Date,
    default: Date.now,
    required: true
  }

});

const GroupChat = mongoose.model("GroupChat", GroupChatSchema);
module.exports = GroupChat;