const express = require("express");
const app = express.Router();
const { User } = require("../db");
module.exports = app;

app.get("/", async (req, res, next) => {
  try {
    res.send(await User.findAll());
  } catch (ex) {
    next(ex);
  }
});
