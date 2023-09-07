const express = require("express");
const router = express.Router();
const userController = require("../controllers/User");

router
  .patch("/", userController.updateUser)
  .get("/", userController.getUserById);

exports.router = router;
