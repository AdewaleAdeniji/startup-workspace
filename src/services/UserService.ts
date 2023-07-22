const UserModel = require("../models/User");

exports.getAllUsers = async () => {
  return await UserModel.find();
};

exports.createUser = async (user: string) => {
  return await UserModel.create(user);
};
exports.getUserById = async (id: string) => {
  return await UserModel.findById(id);
};
exports.getUserByUserId = async (id: string) => {
  return await UserModel.findOne({
    userID: id,
  });
};
exports.getUserByEmail = async (email: string) => {
  return await UserModel.findOne({
    email: email,
  });
};
exports.getWorkspaceUsers = async (workspaceID: string) => {
  return await UserModel.find(
    {
      "workspaces.workspaceID": workspaceID,
    },
    {
      password: 0,
      workspaces: 0,
      role: 0,
      _id: 0,
      createdAt: 0,
      email: 0,
    }
  );
};
exports.updateUser = async (id: string, user: string) => {
  return await UserModel.findByIdAndUpdate(id, user);
};

exports.deleteUser = async (id: string) => {
  return await UserModel.findByIdAndDelete(id);
};
