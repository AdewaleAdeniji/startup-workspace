const IVM = require("../models/Invites");

exports.getAllInvites = async () => {
  return await IVM.find();
};

exports.createInvite = async (workspace: any) => {
  return await IVM.create(workspace);
};
exports.getInvitationById = async (id: string) => {
  return await IVM.findById(id);
};
exports.getInvitationByInvitationId = async (id: string) => {
  return await IVM.findOne({
    inviteID: id,
  });
};
exports.getInvite = async (id: string, email: string) => {
    return await IVM.findOne({
      inviteID: id,
      email,
      status: true,
    });
  };
exports.checkIfInvited = async (email: string, workspaceID: string) => {
  return await IVM.findOne({
    email: email,
    workspaceID,
    status: true,
  });
};
exports.getAllUserInvites = async (email: string, status: boolean) => {
  return await IVM.find({
    email: email,
    status: status,
  });
};
exports.getAllWorkspaceInvites = async (workspaceId: string) => {
  return await IVM.find({
    workspaceID: workspaceId,
    status: true,
  });
};

exports.updateInvite = async (id: string, invite: any) => {
  return await IVM.findByIdAndUpdate(id, invite);
};
