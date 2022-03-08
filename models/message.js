const mongoose = require("mongoose"),
  { Schema } = require("mongoose");

const messageSchema = new Schema({
  content: {
    type: String,
    required: true
  },
  sender: {
    type: String,
    required: true
  },
  receiver: {
    type: String,
    required: true
  }
}, { timestamps: true });

module.exports = mongoose.model("Message", messageSchema);