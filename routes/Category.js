const express = require("express");
const router = express.Router();
const categoryController = require("../controllers/Category");

router.get("/", categoryController.getAll).post("/", categoryController.create);

exports.router = router;
