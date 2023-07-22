import mongoose from "mongoose";
const Schema = mongoose.Schema;

const commentSchema = new Schema(
  {
    ticketID: {
      type: String,
      default: "",
      immutable: true,
    },
    comment: String,
    commentBy: String,
    boardID: {
      type: String,
      default: "",
      immutable: true,
    },
    workspaceID: {
      type: String,
      default: "",
      immutable: true,
    },
    active: Boolean,
  },
  {
    timestamps: true,
  }
);
exports.comments = commentSchema;
module.exports = mongoose.model("comments", commentSchema);
