import express from "express";
const { createBudget, createBud, getBudget, deleteBud, deleteBudget, getUserBudget, getAllUserBudget } = require("../controllers/BudgetController");

const budRouter = express.Router();

budRouter.route("/create").post(createBudget);
budRouter.route("/bud/create/:budgetID").post(createBud);
budRouter.route("/user").get(getUserBudget);
budRouter.route("/user/:key/:userID").get(getAllUserBudget);
budRouter.route("/:budgetID").get(getBudget);
budRouter.route("/bud/:budID").delete(deleteBud)
budRouter.route("/budget/:budgetID").delete(deleteBudget)


module.exports = budRouter;