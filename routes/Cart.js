const express = require("express");
const router = express.Router();
const cartController = require("../controllers/Cart");

router
  .post("/", cartController.createCart)
  .delete("/:id", cartController.deleteCart)
  .patch("/:id", cartController.updateCart)
  .get("/", cartController.getAllUsersCart);

exports.router = router;
