import { Request, Response } from "express";
const utils = require("../utils.js");
const UserService = require("../services/UserService");
const WS = require("../services/WorkspaceService");
const InviteService = require("../services/InvitationService");
const EmailService = require("../services/EmailService");
const ProductService = require("../services/ProductService");
import { middlewares } from "../middlewares/user";
import { EMAIL_TEMPLATES, INVITATION_BASE_URL, ROLES } from "../constants";

const createWorkspaceUsername = async (
  workspaceName: string,
  attempt = 0
): Promise<string> => {
  const name = workspaceName.toLowerCase().split(" ");
  const Name = name.join("");
  const check = await WS.getWorkspaceByName(Name);
  if (check) {
    // Generate a new name by appending the attempt number
    const newName = `${Name}-${attempt + 1}`;
    return createWorkspaceUsername(newName, attempt + 1);
  }
  return Name;
};
const sendWorkspaceInvitationEmail = async (
  inviteID: string,
  email: string,
  invitee: string,
  workspace: string
) => {
  //send email here
  const payload = {
    to: email,
    title: `Invitation to ${workspace}`,
    workspace: workspace,
    invitee: invitee,
    link: INVITATION_BASE_URL + inviteID,
    templateKey: EMAIL_TEMPLATES.INVITATION_EMAIL_KEY,
  };
  const send = await EmailService.sendEmail(payload.to, true, payload);
  console.log(send);
};
exports.getAllEmailInvites = async (req: any, res: Response) => {
  const data = req?.body;
  const val = middlewares.validateRequest(data, ["status"]);
  if (val) return res.status(400).send({ message: val });
  const user = await UserService.getUserByUserId(req.userID);
  if (!user) return res.status(403).send({ message: "UNAUTHORIZED" });
  try {
    const invites = await InviteService.getAllUserInvites(
      user.email,
      data.status
    );
    const response = [];
    for (var i = 0; i < invites.length; i++) {
      const inv = invites[i];
      const workspace = await WS.getWorkspaceByWorkspaceID(inv.workspaceID);
      response.push({
        workspaceName: workspace.workspaceName,
        inviteID: inv.inviteID,
      });
    }
    res.status(200).send({ data: response || [] });
  } catch (err: any) {
    return res.status(500).json({ message: err.message });
  }
};
exports.acceptWorkspaceInvite = async (req: any, res: Response) => {
  const data = req?.body;
  const val = middlewares.validateRequest(data, ["inviteID"]);
  if (val) return res.status(400).send({ message: val });
  const user = await UserService.getUserByUserId(req.userID);
  if (!user) return res.status(403).send({ message: "UNAUTHORIZED" });
  try {
    const inviteID = data.inviteID;
    const invite = await InviteService.getInvite(inviteID, user.email);
    if (!invite) return res.status(404).send({ message: "Invite not found" });
    //check if user already in the workspace
    const permissions = middlewares.workspacePermission(
      user.workspaces,
      invite.workspaceID
    );
    if (permissions) {
      return res.status(400).send({ message: "User already in the workspace" });
    }

    //add the workspace to user model
    //get workspace
    const workspace = await WS.getWorkspaceByWorkspaceID(invite.workspaceID);
    let userWorkSpaces = user.workspaces;
    userWorkSpaces.push({
      workspaceID: invite.workspaceID,
      workspaceName: workspace.workspaceName,
      role: ROLES.MEMBER,
    });
    const updateUser = {
      workspaces: userWorkSpaces,
    };
    const updateuser = await UserService.updateUser(user._id, updateUser);
    if (updateuser) {
      //update invite to false
      const newInvite = {
        status: false,
      };
      const updateInvite = await InviteService.updateInvite(
        invite._id,
        newInvite
      );
      res.status(200).send({ message: "All good" });
    } else {
      return res.status(400).send({ message: "Request failed" });
    }
  } catch (err: any) {
    return res.status(500).json({ message: err.message });
  }
};
exports.revokeWorkspaceInvite = async (req: any, res: Response) => {
  const data = req?.body;
  const val = middlewares.validateRequest(data, ["inviteID"]);
  if (val) return res.status(400).send({ message: val });
  const user = await UserService.getUserByUserId(req.userID);
  if (!user) return res.status(403).send({ message: "UNAUTHORIZED" });
  try {
    const inviteID = data.inviteID;
    const invite = await InviteService.getInvitationByInvitationId(inviteID);
    if (!invite) return res.status(404).send({ message: "Invite not found" });
    //check if user already in the workspace
    const permissions = middlewares.workspacePermission(
      user.workspaces,
      invite.workspaceID
    );
    if (!permissions || permissions.role !== ROLES.ADMIN)
      return res.status(400).send({
        message: "You don't have access to revoke invite from this workspace",
      });

    const newInvite = {
      status: false,
    };
    const updateInvite = await InviteService.updateInvite(
      invite._id,
      newInvite
    );
    if (updateInvite) {
      //update invite to false
      res.status(200).send({ message: "Revoked Access" });
    } else {
      return res.status(400).send({ message: "Request failed" });
    }
  } catch (err: any) {
    return res.status(500).json({ message: err.message });
  }
};
exports.removeFromWorkspace = async (req: any, res: Response) => {
  const data = req?.body;
  const val = middlewares.validateRequest(data, ["userID", "workspaceID"]);
  if (val) return res.status(400).send({ message: val });
  const user = await UserService.getUserByUserId(req.userID);
  if (!user) return res.status(403).send({ message: "UNAUTHORIZED" });
  try {
    const workspace = await WS.getWorkspaceByWorkspaceID(data.workspaceID);
    if (!workspace) return res.status(404);
    if (user.email === data.email)
      return res.status(400).send({ message: "You cannot remove yourself" });
    const permissions = middlewares.workspacePermission(
      user.workspaces,
      workspace.workspaceID
    );
    if (!permissions || permissions.role !== ROLES.ADMIN)
      return res.status(400).send({
        message: "You don't have access to remove from this workspace",
      });
    const userToRemove = await UserService.getUserByUserId(data.userID);
    if (!userToRemove)
      return res.status(400).send({ message: "User not found" });
    const permission = middlewares.workspacePermission(
      userToRemove.workspaces,
      workspace.workspaceID
    );
    if (!permission)
      return res.status(400).send({ message: "Error occured 1102" });
    //user is in the workspace
    const newWorkspace = utils.removeWorkspaceById(
      userToRemove.workspaces,
      workspace.workspaceID
    );
    const updateUser = {
      workspaces: newWorkspace,
    };
    const updateuser = await UserService.updateUser(
      userToRemove._id,
      updateUser
    );
    if (updateuser) {
      return res.status(200).send({ message: "User removed successfully" });
    } else {
      return res.status(400).send({ message: "Failed to remove user" });
    }
  } catch (err: any) {
    return res.status(500).json({ message: err.message });
  }
};
exports.addToWorkspace = async (req: any, res: Response) => {
  const data = req?.body;

  const val = middlewares.validateRequest(data, [
    "email",
    "workspaceID",
    "resend",
  ]);
  if (val) return res.status(400).send({ message: val });
  //use the data guy
  const user = await UserService.getUserByUserId(req.userID);
  if (!user) return res.status(403).send({ message: "UNAUTHORIZED" });
  try {
    //invite to workspace right?
    const workspace = await WS.getWorkspaceByWorkspaceID(data.workspaceID);
    if (!workspace) return res.status(404);
    if (user.email === data.email)
      return res.status(400).send({ message: "You cannot invite yourself" });
    const permissions = middlewares.workspacePermission(
      user.workspaces,
      workspace.workspaceID
    );
    if (!permissions || permissions.role !== ROLES.ADMIN)
      return res
        .status(400)
        .send({ message: "You don't have access to invite to this workspace" });
    //does user have an account
    const invitedUser = await UserService.getUserByEmail(data.email);
    if (invitedUser) {
      //check if user is already in the workspace
      const permissions = middlewares.workspacePermission(
        invitedUser.workspaces,
        workspace.workspaceID
      );
      if (permissions)
        return res
          .status(400)
          .send({ message: "User already in the workspace" });
    }
    //check if invite already sent
    const alreadyInvited = await InviteService.checkIfInvited(
      data.email,
      data.workspaceID
    );
    if (alreadyInvited && !data.resend)
      return res.status(400).send({ message: "User already invited" });

    if (alreadyInvited && data.resend) {
      //resend invitation email
      await sendWorkspaceInvitationEmail(
        alreadyInvited.inviteID,
        data.email,
        user.firstname + user.lastname,
        workspace.workspaceName
      );
      return res.status(200).send(alreadyInvited);
    }
    //create new invite
    const payload = {
      workspaceID: workspace.workspaceID,
      email: data.email,
      invitedBy: req.userID,
      inviteID: utils.generateID(),
    };
    const invite = await InviteService.createInvite(payload);
    await sendWorkspaceInvitationEmail(
      invite.inviteID,
      data.email,
      user.firstname + " " + user.lastname,
      workspace.workspaceName
    );
    return res.status(200).send(invite);
  } catch (err: any) {
    return res.status(500).json({ message: err.message });
  }
};
exports.getWorkspaceUsers = async (req: any, res: Response) => {
  const type = req.params.type;
  const key = req.params.key;
  const isName = type === "name";
  const fn = isName ? WS.getWorkspaceByName : WS.getWorkspaceByWorkspaceID;
  const user = await UserService.getUserByUserId(req.userID);
  if (!user) return res.status(403).send({ message: "UNAUTHORIZED" });
  try {
    const workspace = await fn(key);
    const permissions = middlewares.workspacePermission(
      user.workspaces,
      workspace.workspaceID
    );
    if (!permissions)
      return res
        .status(400)
        .send({ message: "You don't have access to this workspace" });
    const admins = workspace.workspaceAdmins;
    const isAdmin = admins.includes(req.userID);
    if (workspace) {
      //const products = workspace.workspaceProducts || [];
      var allProducts = [];
      var users = [];
      if (isAdmin) {
        allProducts = await ProductService.getAllActiveProducts();
        users = await UserService.getWorkspaceUsers(workspace.workspaceID);
      }
      return res.send({
        data: workspace,
        metadata: {
          admin: isAdmin,
          products: allProducts,
          role: ROLES.ADMIN,
          users,
        },
      });
    } else {
      return res.status(400).send({
        message: "Workspace not found",
      });
    }
  } catch (err: any) {
    return res.status(500).json({ message: err.message });
  }
};
exports.getWorkspace = async (req: any, res: Response) => {
  const type = req.params.type;
  const key = req.params.key;
  const isName = type === "name";
  const fn = isName ? WS.getWorkspaceByName : WS.getWorkspaceByWorkspaceID;
  const user = await UserService.getUserByUserId(req.userID);
  if (!user) return res.status(403).send({ message: "UNAUTHORIZED" });
  try {
    const workspace = await fn(key);
    const permissions = middlewares.workspacePermission(
      user.workspaces,
      workspace.workspaceID
    );
    const admins = workspace.workspaceAdmins;
    const isAdmin = admins.includes(req.userID);
    if (!permissions)
      return res
        .status(400)
        .send({ message: "You don't have access to this workspace" });
    if (workspace) {
      const products = workspace.workspaceProducts || [];
      var allProducts = [];
      if (isAdmin) {
        allProducts = await ProductService.getAllActiveProducts();
      }
      return res.send({
        data: workspace,
        products: products,
        metadata: {
          admin: isAdmin,
          products: allProducts,
          role: ROLES.ADMIN,
        },
      });
    } else {
      return res.status(400).send({
        message: "Workspace not found",
      });
    }
  } catch (err: any) {
    return res.status(500).json({ message: err.message });
  }
};
exports.createWorkspace = async (req: any, res: Response) => {
  const data = req?.body;
  const val = middlewares.validateRequest(data, [
    "workspaceName",
    "workspaceDescription",
  ]);
  if (val) return res.status(400).send({ message: val });
  //use the data guy
  const user = await UserService.getUserByUserId(req.userID);
  if (!user) return res.status(403).send({ message: "UNAUTHORIZED" });
  try {
    data.workspaceID = utils.generateID();
    data.workspaceAdmins = [req.userID];
    data.workspaceUserName = await createWorkspaceUsername(
      data.workspaceName,
      0
    );
    data.workspaceProducts = await ProductService.getAllDefaultProducts();
    const create = await WS.createWorkspace(data);
    if (create) {
      let userWorkSpaces = user.workspaces;
      userWorkSpaces.push({
        workspaceID: create.workspaceID,
        workspaceName: create.workspaceName,
        role: ROLES.ADMIN,
      });
      //add workspace to user
      const updateUser = {
        workspaces: userWorkSpaces,
      };
      const updateuser = UserService.updateUser(user._id, updateUser);
      if (updateuser) {
        res.send({
          data: create,
        });
      } else {
        //delete workspace
        await WS.deleteWorkspace(create._id);
        return res.status(400).send({
          message: "Workspace creation failed - 1100",
        });
      }
    } else {
      return res.status(400).send({
        message: "Workspace creation failed - 1101",
      });
    }
  } catch (err: any) {
    return res.status(500).json({ message: err.message });
  }
};
//add product to workspace
export const addProductToWorkspace = middlewares.WrapHandler(
  async (req: any, res: Response) => {
    const data = req?.body;
    const val = middlewares.validateRequest(data, ["productID", "workspaceID"]);
    if (val) return res.status(400).send({ message: val });
    const user = await UserService.getUserByUserId(req.userID);
    if (!user) return res.status(403).send({ message: "UNAUTHORIZED" });
    const permissions = middlewares.workspacePermission(
      user.workspaces,
      data.workspaceID
    );
    if (!permissions || permissions.role !== ROLES.ADMIN) {
      return res.status(400).send({
        message: "You don't have access to add product to this workspace",
      });
    }

    //check if product and workspace really exist
    const workspace = await WS.getWorkspaceByWorkspaceID(data.workspaceID);
    if (!workspace) return res.status(404);
    const product = await ProductService.getProductByProductID(data.productID);
    if (!product)
      return res.status(400).send({ message: "Failed to get product" });
    const workspaceProducts = workspace.workspaceProducts;
    const isAlreadyAdded = middlewares.hasProducts(
      workspaceProducts,
      product.productID
    );
    if (isAlreadyAdded)
      return res
        .status(400)
        .send({ message: "Product Already added to workspace" });
    workspaceProducts.push(product);
    const newWorkspace = {
      workspaceProducts: workspaceProducts,
    };
    const update = await WS.updateWorkspace(workspace._id, newWorkspace);
    if (update) {
      const updatedWorkspace = await WS.getWorkspaceByWorkspaceID(
        data.workspaceID
      );
      return res
        .status(200)
        .send({ data: updatedWorkspace, message: "Product Added" });
    }
    return res.status(400).send({ message: "Failed to update workspace" });
  }
);
export const removeProductFromWorkspace = middlewares.WrapHandler(
  async (req: any, res: Response) => {
    const data = req?.body;
    const val = middlewares.validateRequest(data, ["productID", "workspaceID"]);
    if (val) return res.status(400).send({ message: val });
    const user = await UserService.getUserByUserId(req.userID);
    if (!user) return res.status(403).send({ message: "UNAUTHORIZED" });
    const permissions = middlewares.workspacePermission(
      user.workspaces,
      data.workspaceID
    );
    if (!permissions || permissions.role !== ROLES.ADMIN) {
      return res.status(400).send({
        message: "You don't have access to add product to this workspace",
      });
    }

    //check if product and workspace really exist
    const workspace = await WS.getWorkspaceByWorkspaceID(data.workspaceID);
    if (!workspace) return res.status(404);
    const product = await ProductService.getProductByProductID(data.productID);
    if (!product)
      return res.status(400).send({ message: "Failed to get product" });
    const workspaceProducts = workspace.workspaceProducts;
    const isAlreadyAdded = middlewares.hasProducts(
      workspaceProducts,
      product.productID
    );
    if (!isAlreadyAdded)
      return res.status(400).send({ message: "Product is not in workspace" });
    //workspaceProducts.push(product);

    const newWorkspace = {
      workspaceProducts: workspaceProducts.filter(
        (productr: any) => productr.productID !== product.productID
      ),
    };

    const update = await WS.updateWorkspace(workspace._id, newWorkspace);
    if (update) {
      const updatedWorkspace = await WS.getWorkspaceByWorkspaceID(
        data.workspaceID
      );
      return res
        .status(200)
        .send({ data: updatedWorkspace, message: "Product removed" });
    }
    return res.status(400).send({ message: "Failed to update workspace" });
  }
);
export const addUserToProduct = middlewares.WrapHandler(
  async (req: any, res: Response) => {
    const data = req?.body;
    const val = middlewares.validateRequest(data, [
      "userID",
      "role",
      "productID",
      "workspaceID",
    ]);
    if (val) return res.status(400).send({ message: val });
    const user = await UserService.getUserByUserId(req.userID);
    if (!user) return res.status(403).send({ message: "UNAUTHORIZED" });
    const addUser = await UserService.getUserByUserId(data.userID);
    if (!addUser)
      return res.status(403).send({ message: "User does not exist" });
    const permissions = middlewares.workspacePermission(
      user.workspaces,
      data.workspaceID
    );
    if (!permissions || permissions.role !== ROLES.ADMIN) {
      return res.status(400).send({
        message: "You don't have access to add product to this workspace",
      });
    }

    //check if product and workspace really exist
    const workspace = await WS.getWorkspaceByWorkspaceID(data.workspaceID);
    if (!workspace) return res.status(404);
    const product = await ProductService.getProductByProductID(data.productID);
    if (!product)
      return res.status(400).send({ message: "Failed to get product" });

      //first remove the workspace to readd it
    const workspaceObj = addUser.workspaces.filter(
      (workspace: any) => workspace.workspaceID === data.workspaceID
    );
    const currentProducts = workspaceObj?.products || [];
    const removedWorkspaces = addUser.workspaces.filter(
      (workspace: any) => workspace.workspaceID !== data.workspaceID
    );
    
    const { workspaceID, workspaceName } = workspace;
    currentProducts.push({
      productID: product.productID,
      productName: product.productName,
      addedBy: req.userID,
      role: data.role
    })
    const newWorkspaceObject = {
      workspaceID, 
      workspaceName,
      role: ROLES.MEMBER,
      products: currentProducts
    }
    removedWorkspaces.push(newWorkspaceObject);
    const updateUser = {
      workspaces: removedWorkspaces,
    };
    const updateuser = UserService.updateUser(addUser._id, updateUser);
      if (updateuser) {
        return res.status(200).send({
          data: updateUser,
        });
      }
      else {
        return res.status(400).send({ data: addUser, message: "Failed to add product to user - 1105" });
      }
  }
);
