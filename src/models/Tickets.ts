import { TASK_STATUSES } from "../constants";
import mongoose from "mongoose";
const Schema = mongoose.Schema;

const ticketSchema = new Schema(
  {
    ticketID: {
      type: String,
      default: "",
      immutable: true,
    },
    title: String,
    description: String,
    reporter: {
      type: String,
      default: "",
      immutable: true,
    },
    reporterName: String,
    assignee: String,
    assigneeName: String,
    storyPoint: String,
    labels: String,
    status: {
      type: String,
      default: TASK_STATUSES.TODO,
    },
    ticketLogs: {
      type: Array,
      default: [],
    },
    ticketPriority: String,
    ticketType: String,
    isChild: Boolean,
    isParent: Boolean,
    relatedID: String,
    sprintName: String,
    sprintID: String,
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
exports.tickets = ticketSchema;
module.exports = mongoose.model("tickets", ticketSchema);
