const express = require("express");
const app = express();
const cors = require("cors");
require("dotenv").config();
import { Request, Response } from "express";
import { middlewares } from "./middlewares/user";
const mongoose = require("mongoose");
var bodyParser = require("body-parser");

const authRoutes = require('./routes/authRoutes.ts');
const userRoutes = require('./routes/userRoutes');
const budgetRoutes = require('./routes/budgetRoutes');
const workspaceRoutes = require('./routes/workspaceRoutes');
const adminRoutes = require('./routes/adminRoutes');
const publicRoutes = require('./routes/publicRoutes');
const boardRoutes = require('./routes/boardRoutes');

app.use(cors({ origin: "*" }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use("/auth", authRoutes);
app.use("/public", publicRoutes);
app.use("/user", middlewares.validateUser, userRoutes);
app.use("/budgets", middlewares.validateUser, budgetRoutes);
app.use("/workspace", middlewares.validateUser, workspaceRoutes);
app.use("/admin", middlewares.validateAdminUser, adminRoutes);
app.use("/product", middlewares.validateUserProduct, boardRoutes);

app.get("/health", (_: Request, res: Response) => {
  return res.status(200).send("Online");
});
app.get("*", (req: Request, res: Response) => {
  console.log(req.path)
  return res.status(404).send("Not found");
});
app.post("*",  (_: Request, res: Response) => {
  return res.status(404).send("Not found");
});

mongoose
  .connect(process.env.MONGODB_URI || "mongodb://localhost/CRUD", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    dbName: process.env.K_DB || "dev-lauvote", // specify the database name here
  })
  .then(() => console.log("connected to mongodb"))
  .catch(() => console.log("error occured connecting to mongodb"));

app.listen(process.env.PORT || 3001, () => {
  console.log("Server is running on port 3001");
});