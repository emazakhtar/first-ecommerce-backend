const express = require("express");
const router = express.Router();
const returnController = require("../controllers/Return");

router
  .post("/", returnController.createReturn)
  .get("/all", returnController.getAllReturn)
  .get("/:id", returnController.getReturnById)
  .get("/users/:email", returnController.getReturnByUserEmail)
  .patch("/update/:id", returnController.updateReturnById);

exports.router = router;
