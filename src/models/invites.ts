import mongoose from "mongoose";
const Schema = mongoose.Schema;

const inviteSchema = new Schema(
  {
    inviteID: {
      type: String,
      default: "",
      immutable: true,
    },
    workspaceID: {
      type: String,
      default: "",
      immutable: true,
    },
    status: {
      type: Boolean,
      default: true,
    },
    email: {
      type: String,
      default: "",
      immutable: true,
    },
    invitedBy: {
      type: String,
      default: "",
      immutable: true,
    },
  },
  {
    timestamps: true,
  }
);
exports.invites = inviteSchema;
module.exports = mongoose.model("invites", inviteSchema);
