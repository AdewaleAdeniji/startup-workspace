const expressT = require("express");
const { getUser, getUserById, updateUser } = require("../controllers/UserController");

const userRouter = expressT.Router();

userRouter.route("/").get(getUser)
userRouter.route("/user/:userId").get(getUserById);
userRouter.route("/update").put(updateUser);

module.exports = userRouter;