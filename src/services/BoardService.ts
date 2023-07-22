const TicketModel = require("../models/Tickets");
const CommentModel = require("../models/Comments");
const SprintModel = require("../models/Sprint");
const BoardModel = require("../models/Board");

// board service

exports.getAllTickets = async () => {
  return await TicketModel.find();
};
exports.createTicket = async (ticket: any) => {
  return await TicketModel.create(ticket);
};
exports.getTicketByTicketID = async (id: string, workspaceID: string) => {
  return await TicketModel.findOne({
    ticketID: id,
    workspaceID,
  });
};
exports.getTicketsByAssignee = async (
  id: string,
  sprintID: string,
  workspaceID: string,
  boardID: string
) => {
  return await TicketModel.find({
    assignee: id,
    workspaceID,
    sprintID,
    boardID,
  });
};
exports.getTicketStatusByAssignee = async (
  id: string,
  workspaceID: string,
  boardID: string,
  sprintID?: string,
  status?: string,
) => {
  return await TicketModel.find({
    assignee: id,
    status,
    workspaceID,
    sprintID,
    boardID,
  });
};
exports.getTicketsByReporter = async (id: string, workspaceID: string,   boardID: string,
  sprintID?: string,
  status?: string) => {
  return await TicketModel.find({
    reporter: id,
    status,
    workspaceID,
    sprintID,
    boardID,
  });
};
exports.getBoardTickets = async (id: string, workspaceID: string) => {
  return await TicketModel.find({
    boardID: id,
    workspaceID,
  });
};
exports.getSprintTickets = async (id: string, workspaceID: string) => {
  return await TicketModel.find({
    sprintID: id,
    workspaceID,
  });
};
exports.getSprintParentTickets = async (id: string, workspaceID: string) => {
  return await TicketModel.find({
    sprintID: id,
    isParent: true,
    workspaceID,
  });
};
exports.getRelatedTickets = async (id: string, workspaceID: string) => {
  return await TicketModel.find({
    relatedID: id,
    workspaceID,
  });
};
exports.getTicketByTicketTitle = async (title: string, workspaceID: string) => {
  return await TicketModel.find({
    ticketTitle: { $regex: title, $options: "i" },
    workspaceID,
  });
};

exports.updateTicket = async (id: string, ticket: any) => {
  return await TicketModel.findByIdAndUpdate(id, ticket);
};

// comments service

exports.createTicketComment = async (comment: any) => {
  return await CommentModel.create(comment);
};
exports.getAllTicketComments = async (id: string, workspaceID: string) => {
  return await CommentModel.find({
    ticketID: id,
    workspaceID,
  });
};

// sprint services

exports.createSprint = async (sprint: any) => {
  return await SprintModel.create(sprint);
};

exports.getSprintById = async (sprintID: string, workspaceID: string) => {
  return await SprintModel.findOne({
    sprintID,
    workspaceID,
  });
};
exports.getAllBoardSprints = async (boardID: string, workspaceID: string) => {
  return await SprintModel.find({
    boardID,
    workspaceID,
  });
};
exports.updateSprint = async (id: string, sprint: any) => {
  return await SprintModel.findByIdAndUpdate(id, sprint);
};

// board service
exports.createBoard = async (board: any) => {
  return await BoardModel.create(board);
};
exports.getAllWorkspaceBoard = async (workspaceID: string) => {
  return await BoardModel.find({
    workspaceID,
  });
};

exports.getBoardByBoardID = async (boardID: string, workspaceID: string) => {
  return await BoardModel.findOne({
    boardID,
    workspaceID,
  });
};
exports.updateBoard = async (id: string, board: any) => {
  return await BoardModel.findByIdAndUpdate(id, board);
};
