import { ROLES } from "../constants";
import { middlewares } from "../middlewares/user";
import { Request, Response } from "express";
const utils = require("../utils.js");
const UserService = require("../services/UserService");
const BoardService = require("../services/BoardService");

export const healthCheck = middlewares.WrapHandler(
  async (req: any, res: Response) => {
    // const data = req?.body;
    // const val = middlewares.validateRequest(data, ["boardName", "workspaceID"]);
    // if (val) return res.status(400).send({ message: val });
    console.log(req.path);
    res.status(200).send({ message: "OK", products: req.product });
  }
);
export const createBoard = middlewares.WrapHandler(
  async (req: any, res: Response) => {
    const data = req?.body;
    const val = middlewares.validateRequest(data, ["boardName"]);
    if (val) return res.status(400).send({ message: val });
    const product = req.product;
    console.log(product);
    if (product.role !== ROLES.ADMIN)
      return res.status(400).send({ message: "You cannot create a board" });
    const payload = {
      boardName: data.boardName,
      boardID: utils.generateID(),
      createdBy: req.userID,
      boardKey: data.boardName.split(" ").join("").substring(0, 4),
      workspaceID: req.workspace.workspaceID,
      active: true,
    };
    const createBoard = await BoardService.createBoard(payload);
    if (createBoard) return res.status(200).send({ data: createBoard });
    return res.status(400).send({ message: "Failed to create board " });
  }
);
export const getWorkspaceBoards = middlewares.WrapHandler(
  async (req: any, res: Response) => {
    //get all boards
    const workspace = req.workspace;
    const workspaceID = workspace.workspaceID;
    // retrieve all board from this workspace
    const boards = await BoardService.getAllWorkspaceBoard(workspaceID);
    res.status(200).send({ message: "OK", data: boards });
  }
);
export const getWorkspaceBoard = middlewares.WrapHandler(
  async (req: any, res: Response) => {
    //get workspace board by ID

    const data = req?.body;
    const val = middlewares.validateRequest(data, ["boardID"]);
    if (val) return res.status(400).send({ message: val });

    const workspace = req.workspace;
    const workspaceID = workspace.workspaceID;

    // retrieve all board from this workspace
    const board = await BoardService.getBoardByBoardID(
      data.boardID,
      workspaceID
    );
    if (!board) return res.status(400).send({ message: "Board not found" });
    res.status(200).send({ message: "OK", data: board });
  }
);

export const createSprint = middlewares.WrapHandler(
  async (req: any, res: Response) => {
    const data = req?.body;
    const val = middlewares.validateRequest(data, [
      "sprintName",
      "sprintGoal",
      "sprintFlow",
      "startDate",
      "endDate",
      "boardID",
    ]);
    if (val) return res.status(400).send({ message: val });
    const payload = {
      ...data,
      workspaceID: req.workspace.workspaceID,
      sprintID: utils.generateID(),
    };
    const createSprint = await BoardService.createSprint(payload);
    if (createSprint) return res.status(200).send({ data: createSprint });
    return res.status(400).send({ message: "Failed to create sprint " });
  }
);
export const updateSprint = middlewares.WrapHandler(
  async (req: any, res: Response) => {
    const data = req?.body;
    const val = middlewares.validateRequest(data, ["sprintID"]);
    if (val) return res.status(400).send({ message: val });

    const sprint = await BoardService.getSprintById(
      data.sprintID,
      req.workspace.workspaceID
    );
    if (!sprint) return res.status(400).send({ message: "Ticket not found" });

    const payload = {
      ...data,
    };
    const updateSprint = await BoardService.updateSprint(sprint._id, payload);
    if (updateSprint) {
      const nSprint = await BoardService.getSprintById(
        data.sprintID,
        req.workspace.workspaceID
      );
      return res.status(200).send({ data: nSprint });
    }
    return res.status(400).send({ message: "Failed to create sprint " });
  }
);

export const getSprints = middlewares.WrapHandler(
  async (req: any, res: Response) => {
    //get all boards
    const data = req?.body;
    const val = middlewares.validateRequest(data, ["boardID"]);
    if (val) return res.status(400).send({ message: val });
    const workspace = req.workspace;
    const workspaceID = workspace.workspaceID;
    // retrieve all board from this workspace
    const sprints = await BoardService.getAllBoardSprints(
      data.boardID,
      workspaceID
    );
    res.status(200).send({ message: "OK", data: sprints });
  }
);
export const getSprint = middlewares.WrapHandler(
  async (req: any, res: Response) => {
    //get sprint  by ID

    const data = req?.body;
    const val = middlewares.validateRequest(data, ["sprintID"]);
    if (val) return res.status(400).send({ message: val });

    const workspace = req.workspace;
    const workspaceID = workspace.workspaceID;

    // retrieve all board from this workspace
    const ticket = await BoardService.getSprintById(data.sprintID, workspaceID);
    if (!ticket) return res.status(400).send({ message: "sprint not found" });
    res.status(200).send({ message: "OK", data: ticket });
  }
);
export const getSprintTickets = middlewares.WrapHandler(
  async (req: any, res: Response) => {
    //get all boards
    const data = req?.body;
    const val = middlewares.validateRequest(data, ["sprintID"]);
    if (val) return res.status(400).send({ message: val });
    const workspace = req.workspace;
    const workspaceID = workspace.workspaceID;
    // retrieve all board from this workspace
    const board = await BoardService.getSprintById(data.sprintID);
    if (!board) return res.status(400).send({ message: "sprint not found" });
    const allTickets = await BoardService.getSprintTickets(
      data.sprintID,
      workspaceID
    );
    const parentTickets = await BoardService.getSprintTickets(
      data.sprintID,
      workspaceID
    );
    const response = {
      all: allTickets,
      parents: parentTickets,
    };
    res.status(200).send({ message: "OK", data: response });
  }
);

export const createTicket = middlewares.WrapHandler(
  async (req: any, res: Response) => {
    const data = req?.body;
    const val = middlewares.validateRequest(data, [
      "title",
      "description",
      "assignee",
      "boardID",
      "assigneeName",
    ]);
    if (val) return res.status(400).send({ message: val });

    if (data.isChild) {
      const reval = middlewares.validateRequest(data, ["relatedID"]);
      if (reval)
        return res.status(400).send({ message: "Ticket is not linked" });
    }

    const payload = {
      ...data,
      workspaceID: req.workspace.workspaceID,
      ticketID: utils.generateID(),
      reporter: req.userID,
      reporterName: req.user.firstName + " " + req.user.lastname,
      ticketLogs: [
        {
          ACTION: "CREATED",
          DATE: new Date(),
          BY: req.userID,
        },
      ],
    };
    const createTicket = await BoardService.createTicket(payload);
    if (createTicket) return res.status(200).send({ data: createTicket });
    return res.status(400).send({ message: "Failed to create sprint " });
  }
);
export const getTicketByID = middlewares.WrapHandler(
  async (req: any, res: Response) => {
    //get sprint  by ID

    const data = req?.body;
    const val = middlewares.validateRequest(data, ["ticketID"]);
    if (val) return res.status(400).send({ message: val });

    const workspace = req.workspace;
    const workspaceID = workspace.workspaceID;

    const ticket = await BoardService.getTicketByTicketID(
      data.ticketID,
      workspaceID
    );
    if (!ticket) return res.status(400).send({ message: "ticket not found" });
    res.status(200).send({ message: "OK", data: ticket });
  }
);
export const getUserTickets = middlewares.WrapHandler(
  async (req: any, res: Response) => {
    //get sprint  by ID
    const data = req?.body;
    const val = middlewares.validateRequest(data, ["userID","isSprint"]);
    if (val) return res.status(400).send({ message: val });

    if(data.isSprint){
      const vals = middlewares.validateRequest(data, ["sprintID"]);
      if (vals) return res.status(400).send({ message: vals });
    }
    const workspace = req.workspace;
    const workspaceID = workspace.workspaceID;

    const tickets = await BoardService.getTicketStatusByAssignee(
      data.userID,
      workspaceID,
      data.boardID,
      data?.sprintID,
      data?.status
    );
    if (!tickets) return res.status(400).send({ message: "ticket not found" });
    res.status(200).send({ message: "OK", data: tickets });
  }
);
export const getReporterTickets = middlewares.WrapHandler(
  async (req: any, res: Response) => {
    //get sprint  by ID
    const data = req?.body;
    const val = middlewares.validateRequest(data, ["userID","isSprint"]);
    if (val) return res.status(400).send({ message: val });

    if(data.isSprint){
      const vals = middlewares.validateRequest(data, ["sprintID"]);
      if (vals) return res.status(400).send({ message: vals });
    }
    const workspace = req.workspace;
    const workspaceID = workspace.workspaceID;

    const tickets = await BoardService.getTicketsByReporter(
      data.userID,
      workspaceID,
      data.boardID,
      data?.sprintID,
      data?.status
    );
    if (!tickets) return res.status(400).send({ message: "ticket not found" });
    res.status(200).send({ message: "OK", data: tickets });
  }
);
export const updateTicket = middlewares.WrapHandler(
  async (req: any, res: Response) => {
    const data = req?.body;
    const val = middlewares.validateRequest(data, ["ticketID"]);
    if (val) return res.status(400).send({ message: val });

    if (data.isChild || data.isParent) {
      const reval = middlewares.validateRequest(data, ["relatedID"]);
      if (reval)
        return res.status(400).send({ message: "Ticket is not linked" });
    }
    const ticket = await BoardService.getTicketByTicketID(
      data.ticketID,
      req.workspace.workspaceID
    );
    if (!ticket) return res.status(400).send({ message: "Ticket not found" });
    const logs = ticket.ticketLogs;
    logs.push({
      ACTION: "UPDATED",
      DATE: new Date(),
      BY: req.userID,
    });
    const payload = {
      ...data,
      ticketLogs: logs,
    };
    const updateTicket = await BoardService.updateTicket(ticket._id, payload);
    if (updateTicket) {
      const nticket = await BoardService.getTicketByTicketID(
        data.ticketID,
        req.workspace.workspaceID
      );
      return res.status(200).send({ data: nticket });
    }
    return res.status(400).send({ message: "Failed to create sprint " });
  }
);
