require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const helmet = require("helmet");
const store = require("./store");
const { NODE_ENV } = require("./config");
const BookmarksService = require("./bookmarks-service");
const markRouter = require("./markRouter.router");
const app = express();
console.log(process.env.API_TOKEN);

const morganOption = NODE_ENV === "production" ? "tiny" : "common";

app.use(morgan(morganOption));
app.use(helmet());
app.get("/bookmarks", (req, res, next) => {
  const knexInstance = req.app.get("db");
  BookmarksService.getAllBookmarks(knexInstance)
    .then(bookmarks => {
      res.json(bookmarks);
    })
    .catch(next);
});
app.get("/bookmarks/:bookmark_id", (req, res, next) => {
  const knexInstance = req.app.get("db");
  BookmarksService.getById(knexInstance, req.params.bookmark_id)
    .then(bookmark => {
      res.json(bookmark);
    })
    .catch(next);
});

app.use(cors());
app.use(express.json());

app.use(function authorize(req, res, next) {
  console.log("token header: ", req.header("Autorization"));
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

app.get("/", (req, res) => {
  res.send(store);
});

module.exports = app;
