const express = require("express");
const router = express.Router();
const brandController = require("../controllers/Brand");

router.get("/", brandController.getAll).post("/", brandController.create);

exports.router = router;
