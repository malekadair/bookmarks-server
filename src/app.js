require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const helmet = require("helmet");
const { NODE_ENV } = require("./config");
const markRouter = require("./markRouter.router");
const app = express();
console.log(process.env.API_TOKEN);

const morganOption = NODE_ENV === "production" ? "tiny" : "common";

app.use(morgan(morganOption));
app.use(helmet());
app.use(cors());

app.use(function authorize(req, res, next) {
  const TOKEN = process.env.API_TOKEN;
  const token = req.header("Authorization").split(" ")[1];

  if (token === TOKEN) {
    next();
  } else {
    res.sendStatus(401);
  }
});

app.use("/bookmarks", markRouter);

app.use(function errorHandler(error, req, res, next) {
  let response;
  if (NODE_ENV === "production") {
    response = { error: { message: "server error" } };
  } else {
    console.error(error);
    response = { message: error.message, error };
  }
  res.status(500).json(response);
});

module.exports = app;
