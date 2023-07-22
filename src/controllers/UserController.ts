import { Request, Response } from "express";
const utils = require("../utils.js");
const UserService = require("../services/UserService");
const BudgetService = require("../services/BudgetService");

import { UserType } from "../types/user";
import { middlewares } from "../middlewares/user";

exports.createUser = async (req: Request, res: Response) => {
  const data = req?.body;
  const val = middlewares.validateRequest(data, ["password", "email"]);
  if (val) return res.status(400).send({ message: val });
  const check = await UserService.getUserByEmail(data.email);
  if (check) {
    return res.status(400).send({ message: "User email already exist" });
  }
  //use the data guy
  try {
    data.userID = utils.generateID();
    data.password = await utils.createHash(data.password);
    const user: UserType = await UserService.createUser(data);
    const userObject: any = {};
    userObject.name = user.name;
    userObject.email = user.email;
    userObject.userID = user.userID;
    userObject.token = utils.signToken(userObject);
    return res.json({ data: userObject, message: "Signup successful" });
  } catch (err: any) {
    console.log(err);
    return res.status(500).json({ message: err.message });
  }
};

exports.loginUser = async (req: Request, res: Response) => {
  const { body } = req;
  // console.log(body);
  //sendEmail();
  try {
    const data = body;
    const { password } = data;
    const user = await UserService.getUserByEmail(data.email);
    if (!user) {
      return res.status(203).send({ message: "Incorrect email or password" });
    }
    const validatePassword = await utils.validateHash(user.password, password);
    if (!validatePassword) {
      return res.status(203).send({ message: "Incorrect email or password" });
    }
    const userObject: any = middlewares.buildUserResponse(user);
    userObject.token = await utils.signToken(userObject);
    userObject.workspaces = user.workspaces;
    return res.json({ data: userObject, message: "Signup successful" });
    // res.send(userObject);
  } catch (e) {
    const error: any = e;
    return res
      .status(422)
      .json({ message: error.errors ? error.errors[0] : "" });
  }
};
exports.getUserById = async (req: Request, res: Response) => {
  const userId = req.params.userId;
  try {
    const user = await UserService.getUserByUserId(userId);
    //create subpoll
    if (!user) return res.status(403).send({ message: "User not found" });
    user.password = "";
    return res.json({ data: user, message: "success" });
  } catch (err: any) {
    return res.status(500).json({ message: err.message });
  }
};
exports.updateUser = async (req: any, res: Response) => {
  try {
    const user = await UserService.getUserByUserId(req.userID);
    //create subpoll
    if (!user) return res.status(403).send({ message: "UNAUTHORIZED" });

    user.password = "";
    const body = req?.body;
    const newUser = {
      firstname: body.firstname,
      lastname: body.lastname,
      photo: body.photo,
    };
    const updateuser = UserService.updateUser(user._id, newUser);
    if (updateuser) {
      return res.json({
        data: {
          ...newUser,
        },
        message: "success",
      });
    } else {
      return res.status(400).send({
        data: {
          newUser,
        },
        message: "Failed",
      });
    }
  } catch (err: any) {
    return res.status(500).json({ message: err.message });
  }
};
exports.getUser = async (req: any, res: Response) => {
  try {
    const user = await UserService.getUserByUserId(req.userID);
    //create subpoll
    if (!user) return res.status(403).send({ message: "UNAUTHORIZED" });
    const budgets = await BudgetService.getAllUserBudgets(req.userID);

    user.password = "";
    return res.json({
      data: {
        user,
        budgets,
      },
      message: "success",
    });
  } catch (err: any) {
    return res.status(500).json({ message: err.message });
  }
};
