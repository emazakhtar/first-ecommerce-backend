const express = require("express");
const router = express.Router();
const productController = require("../controllers/Product");

router
  .get("/", productController.getAll)
  .get("/:id", productController.get)
  .post("/", productController.create)
  .patch("/:id", productController.update)
  .get("/test/update", productController.initializeDiscountedPrice);

exports.router = router;
