import { createBoard, healthCheck, getWorkspaceBoards, createSprint, createTicket, updateTicket, updateSprint, getWorkspaceBoard, getUserTickets, getReporterTickets } from "../controllers/BoardController";

const boardExpress = require("express");

const boardRouter = boardExpress.Router();

boardRouter.route("/:workspaceID/:productID/health").get(healthCheck)
boardRouter.route("/:workspaceID/:productID/board").post(createBoard)
boardRouter.route("/:workspaceID/:productID/board").get(getWorkspaceBoard)
boardRouter.route("/:workspaceID/:productID/boards").get(getWorkspaceBoards)
boardRouter.route("/:workspaceID/:productID/boards/sprint").post(createSprint)
boardRouter.route("/:workspaceID/:productID/boards/sprint").put(updateSprint)
boardRouter.route("/:workspaceID/:productID/boards/ticket").post(createTicket)
boardRouter.route("/:workspaceID/:productID/boards/user/tickets").get(getUserTickets)
boardRouter.route("/:workspaceID/:productID/boards/reporter/tickets").put(getReporterTickets)

module.exports = boardRouter;