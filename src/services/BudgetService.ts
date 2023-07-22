const BM = require("../models/Budget");
const BudModel = require("../models/Bud");

exports.getAllBudgets = async () => {
  return await BM.find();
};
exports.getAllUserBudgets = async (id: string) => {
  return await BM.find({
    userID: id,
  });
};
exports.getBudgetByID = async (budgetID: string) => {
  return await BM.findOne({
    budgetID,
  });
};
exports.createBudget = async (budget: any) => {
  return await BM.create(budget);
};
exports.createBud = async (bud: any) => {
  return await BudModel.create(bud);
};
exports.getAllBuddies = async (budgetID: string) => {
  return await BudModel.find({
    budgetID,
  });
};
exports.getBud = async (budID: string) => {
  return await BudModel.findOne({
    budID,
  });
};
exports.deleteBud = async (id: string) => {
  return await BudModel.findByIdAndDelete(id);
};
exports.deleteBudget = async (id: string) => {
  return await BM.findByIdAndDelete(id);
};
