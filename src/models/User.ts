import { ROLES } from "../constants";
import mongoose from "mongoose";
const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    userID: {
      type: String,
      default: "",
      immutable: true,
    },
    status: {
      type: Boolean,
      default: true,
    },
    firstname: {
      default: "",
      type: String,
    },
    lastname: {
      default: "",
      type: String,
    },
    photo: {
      default: "",
      type: String,
    },
    email: String,
    password: String,
    workspaces: {
      type: Array,
      default: [],
    },
    role: {
      type: String,
      default: ROLES.USER,
    },
  },
  {
    timestamps: true,
  }
);
exports.user = userSchema;
module.exports = mongoose.model("users", userSchema);
