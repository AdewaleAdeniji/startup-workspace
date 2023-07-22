import { DEFAULT_SPRINT_FLOW } from "../constants";
import mongoose from "mongoose";
const Schema = mongoose.Schema;

const sprintSchema = new Schema(
  {
    sprintID: {
      type: String,
      default: "",
      immutable: true,
    },
    sprintName: String,
    sprintGoal: String,
    sprintFlow: {
      type: Array,
      default: DEFAULT_SPRINT_FLOW,
    },
    createdBy: String,
    startDate: String,
    endDate: String,
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
    active: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);
exports.sprint = sprintSchema;
module.exports = mongoose.model("sprints", sprintSchema);
