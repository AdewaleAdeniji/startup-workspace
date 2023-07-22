import mongoose from "mongoose";
const Schema = mongoose.Schema;

const boardSchema = new Schema(
  {
    boardID: {
      type: String,
      default: "",
      immutable: true,
    },
    boardName: String,
    boardKey: String,
    createdBy: String,
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
exports.boards = boardSchema;
module.exports = mongoose.model("boards", boardSchema);
