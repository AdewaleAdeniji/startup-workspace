import { addProductToWorkspace, removeProductFromWorkspace, addUserToProduct } from "../controllers/WorkspaceController";

const wexpress = require("express");
const {
  createWorkspace,
  getWorkspace,
  addToWorkspace,
  getAllEmailInvites,
  acceptWorkspaceInvite,
  removeFromWorkspace,
  revokeWorkspaceInvite,
  getWorkspaceUsers,
} = require("../controllers/WorkspaceController");
const wRouter = wexpress.Router();

wRouter.route("/create").post(createWorkspace);
wRouter.route("/users/:type/:key").get(getWorkspaceUsers);
wRouter.route("/:type/:key").get(getWorkspace);
wRouter.route("/invite").post(addToWorkspace);
wRouter.route("/invites").get(getAllEmailInvites);
wRouter.route("/accept/invite").post(acceptWorkspaceInvite);
wRouter.route("/remove/user").post(removeFromWorkspace);
wRouter.route("/revoke/invite").post(revokeWorkspaceInvite);
wRouter.route("/product/add").put(addProductToWorkspace);
wRouter.route("/user/add").put(addUserToProduct);
wRouter.route("/product/remove").put(removeProductFromWorkspace);

module.exports = wRouter;
