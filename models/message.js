const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const MessageSchema = new Schema(
  {
    title: { type: String, required: true },
    text: { type: String, required: true },
    author: { type: Schema.Types.ObjectId, required: true, ref: "User" },
    createdAt: Number,
    updatedAt: Number,
  },
  { timestamps: { currentTime: () => Date.now() } }
);

module.exports = mongoose.model("Message", MessageSchema);
