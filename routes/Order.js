const express = require("express");
const router = express.Router();
const orderController = require("../controllers/Order");

router
  .get("/", orderController.getAllOrders)
  .post("/", orderController.createOrder)
  .get("/own", orderController.getAllUsersOrder)
  .patch("/:id", orderController.updateOrder)
  .get("/:id", orderController.getOrderById);

exports.router = router;
