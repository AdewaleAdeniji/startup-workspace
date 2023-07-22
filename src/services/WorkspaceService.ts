const WM = require("../models/Workspace");

exports.getAllWorkspaces = async () => {
  return await WM.find();
};

exports.createWorkspace = async (workspace: any) => {
  return await WM.create(workspace);
};
exports.getWorkspaceById = async (id: string) => {
  return await WM.findById(id);
};
exports.getWorkspaceByWorkspaceID = async (id: string) => {
  return await WM.findOne({
    workspaceID: id,
  });
};
exports.getWorkspaceByName = async (name: string) => {
  return await WM.findOne({
    workspaceUserName: name,
  });
};

exports.updateWorkspace = async (id: string, workspace: any) => {
  return await WM.findByIdAndUpdate(id, workspace);
};

exports.deleteWorkspace = async (id: string) => {
  return await WM.findByIdAndDelete(id);
};
