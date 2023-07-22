import { ROLES } from "../constants";
import { NextFunction, Request, Response } from "express";
const utils = require("../utils.js");
const UserService = require("../services/UserService");

const validateUser = async (req: any, res: Response, next: NextFunction) => {
  const headers = req.headers;
  const authorization = headers.authorization;
  if (!authorization) {
    return res.status(403).send({ message: "Forbidden access, login first" });
  }
  //validate the token itself
  const val = await utils.verifyToken(authorization.split(" ")[1]);
  if (!val) {
    return res.status(403).send({ message: "Access expired, login first" });
  }
  req.userID = val.payload.userID;
  req.user = val.payload;
  next();
};
const validateAdminUser = async (
  req: any,
  res: Response,
  next: NextFunction
) => {
  const headers = req.headers;
  const authorization = headers.authorization;
  if (!authorization) {
    return res.status(403).send({ message: "Forbidden access, login first" });
  }
  //validate the token itself
  const val = await utils.verifyToken(authorization.split(" ")[1]);
  if (!val) {
    return res.status(403).send({ message: "Access expired, login first" });
  }
  const user = await UserService.getUserByUserId(val.payload.userID);
  if (!user || user.role !== ROLES.ADMIN)
    return res.status(403).send({ message: "Unauthorized access" });
  req.userID = val.payload.userID;
  req.user = user;
  next();
};
const validateUserProduct = async (
  req: any,
  res: Response,
  next: NextFunction
) => {
  const headers = req.headers;
  const authorization = headers.authorization;
  if (!authorization) {
    return res.status(403).send({ message: "Forbidden access, login first" });
  }
  //validate the token itself
  const val = await utils.verifyToken(authorization.split(" ")[1]);
  if (!val) {
    return res.status(403).send({ message: "Access expired, login first" });
  }
  console.log(req.path);
  const arr = req.path.split("/");
  const workspaceID = arr[1];
  const productID = (arr[2]).toString();
  const user = await UserService.getUserByUserId(val.payload.userID);
  const permissions = middlewares.workspacePermission(
    user.workspaces,
    workspaceID
  );
  if (!permissions)
    return res
      .status(403)
      .send({
        message: "You don't have access to the WORKSPACE",
        w: user.workspaces,
      });

  // console.log(permissions)
  var product = await permissions.products.filter((prod: any) => {
    return prod.productID === productID;
  });
  //console.log(product, permissions.products, productID)
  if (!product || product.length === 0)
    return res
      .status(403)
      .send({ message: "You don't have access to the product" });

  req.product = product[0];
  req.userID = val.payload.userID;
  req.workspace = permissions;
  req.user = user;
  next();
};
function findObjectByProductID(array: any, productID: string) {
  const foundObject = array.find((obj: any) =>
    obj.products.some((product: any) => product.productID === productID)
  );
  return foundObject || false;
}

const WrapHandler = (controllerFn: any) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await controllerFn(req, res, next);
    } catch (err: any) {
      console.log(err);
      res.status(500).json({ message: err.message });
    }
  };
};
const hasProducts = (products: any, productID: string) => {
  return products.some((product: any) => product.productID === productID);
};

const buildUserResponse = (user: any) => {
  const userObject: any = {};
  userObject.lastname = user.lastname;
  userObject.email = user.email;
  userObject.userID = user.userID;
  userObject.firstname = user.firstname;
  userObject.photo = user.photo;
  return userObject;
};
interface Workspace {
  workspaceID: string;
  workspaceName: string;
  role: string;
}

const workspacePermission = (
  workspaces: Workspace[],
  workspaceID: string
): Workspace | boolean => {
  for (let i = 0; i < workspaces.length; i++) {
    if (workspaces[i].workspaceID === workspaceID) {
      return workspaces[i];
    }
  }
  return false;
};

const validateRequest = (obj: any, keys: string[]) => {
  for (let i = 0; i < keys.length; i++) {
    const key = keys[i];
    const words = key.split(/(?=[A-Z])/); // Split the key based on capital letters
    const humanReadableKey = words.join(" "); // Join the words with spaces
    const formattedKey =
      humanReadableKey.charAt(0).toUpperCase() + humanReadableKey.slice(1); // Capitalize the first letter
    if (!(key in obj)) {
      return `${formattedKey} is required`;
    }
  }
  return false;
};

type Middlewares = {
  validateUser: Function;
  validateRequest: Function;
  buildUserResponse: Function;
  workspacePermission: Function;
  validateAdminUser: Function;
  WrapHandler: Function;
  hasProducts: Function;
  validateUserProduct: Function;
};

export const middlewares: Middlewares = {
  validateUser,
  validateRequest,
  buildUserResponse,
  workspacePermission,
  validateAdminUser,
  WrapHandler,
  hasProducts,
  validateUserProduct,
};
