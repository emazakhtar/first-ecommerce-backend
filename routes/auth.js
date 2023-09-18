const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth");
const passport = require("passport");

router
  .post(
    "/login",
    passport.authenticate("local", { session: false }),
    authController.loginUser
  )
  .post("/signup", authController.signUpUser)
  .get(
    "/check",
    passport.authenticate("jwt", { session: false }),
    authController.checkUser
  )
  .post("/reset-password-request", authController.resetPasswordRequest)
  .post("/reset-password", authController.resetPassword)
  .get("/logout", authController.logoutUser);

exports.router = router;
