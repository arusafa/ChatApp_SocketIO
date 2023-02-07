const mongoose = require('mongoose');

const PrivateChatSchema = new mongoose.Schema({
  from_user: {
    type: String,
    required: true
  },
  to_user: {
    type: String,
    required: true
  },
  message: {
    type: String,
    required: true
  },
  date_sent:{
    type: Date,
    default: Date.now
  }
});
const PrivateChat = mongoose.model("PrivateChat", PrivateChatSchema);
module.exports = PrivateChat;