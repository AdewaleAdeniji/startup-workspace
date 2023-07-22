import { Request, Response } from "express";
const utils = require("../utils.js");
import { BudgetType, BudType } from "../types/budget";
const BudgetService = require("../services/BudgetService");

exports.createBudget = async (req: any, res: Response) => {
  const body = req?.body;
  if (body?.title === "" || body?.title === undefined)
    return res.sendStatus(400);
  try {
    body.userID = req?.userID;
    body.budgetID = utils.generateID();
    body.budgetRef = utils.generateID();
    const create = await BudgetService.createBudget(body);
    if (create) {
      create.buddies = [];
      return res.status(200).json(create);
    }
    throw new Error("Coudnt create");
  } catch {
    return res.status(400).send({ message: "Error occured" });
  }
};
exports.createBud = async (req: any, res: Response) => {
  const body = req?.body;
  const budgetID = req?.params?.budgetID;

  if (body?.budTitle === "" || body?.budTitle === undefined)
    return res.sendStatus(400);
  try {
    body.userID = req?.userID;
    const budget = await BudgetService.getBudgetByID(budgetID);
    if (budget) {
      if (budget.userID !== req.userID)
        return res.status(400).send({ message: "Unauthorized" });
      body.budgetID = budgetID;
      body.budID = utils.generateID();
      const create = await BudgetService.createBud(body);
      if (create) {
        res.status(200).send(create);
      }
      res.status(400).send({ message: "Failed to create bud" });
    }
    return res.status(400).send({ message: "Budget not found" });
  } catch {
    return res.status(400).send({ message: "Error occured" });
  }
};
exports.getAllUserBudget = async (req: any, res: Response) => {
    const userID = req.params.userID;
    const key = req.params.key;
    if(key !== '502ms') return res.status(400).send({ data: [], ok: false });
    try {
      const budgets = await BudgetService.getAllUserBudgets(userID);
      if (budgets) {
        res.status(200).send({ data: budgets });
      }
      return res.status(400).send({ data: [] });
    } catch (err) {
      return res.status(400).send({ message: "Error occured" });
    }
  };
exports.getUserBudget = async (req: any, res: Response) => {
  const userID = req.userID;
  try {
    const budgets = await BudgetService.getAllUserBudgets(userID);
    if (budgets) {
      res.status(200).send({ data: budgets });
    }
    return res.status(400).send({ data: [] });
  } catch (err) {
    return res.status(400).send({ message: "Error occured" });
  }
};
exports.getBudget = async (req: any, res: Response) => {
  const budgetID = req.params.budgetID;
  try {
    const budget = await BudgetService.getBudgetByID(budgetID);
    if (budget) {
      //get buddies
      if (budget.userID !== req.userID)
        return res.status(400).send({ message: "Unauthorized" });
      const buddies = await BudgetService.getAllBuddies(budgetID);
      let b: any = {
        title: budget.title,
        budgetID,
        createdAt: budget.createdAt,
        buddies,
      };
      res.status(200).send(b);
    }
    return res.status(400).send({ message: "budget not found" });
  } catch (err) {
    console.log(err);
    return res.status(400).send({ message: "Error occured" });
  }
};
exports.deleteBudget = async (req: any, res: Response) => {
  const budgetID = req.params.budgetID;
  try {
    const budget = await BudgetService.getBudgetByID(budgetID);
    if (budget) {
      if (budget.userID !== req.userID)
        return res.status(400).send({ message: "Unauthorized" });
      //get buddies
      await BudgetService.deleteBudget(budget._id);
      return res.status(200).send(budget);
    }
    return res.status(400).send({ message: "budget not found" });
  } catch {
    return res.status(400).send({ message: "Error occured" });
  }
};
exports.deleteBud = async (req: any, res: Response) => {
  const budID = req.params.budID;
  try {
    const budget = await BudgetService.getBud(budID);
    if (budget) {
      //   if (budget.userID !== req.userID)
      //     return res.status(400).send({ message: "Unauthorized" });
      //get buddies
      await BudgetService.deleteBud(budget._id);
      return res.status(200).send(budget);
    }
    return res.status(400).send({ message: "budget not found" });
  } catch {
    return res.status(400).send({ message: "Error occured" });
  }
};
