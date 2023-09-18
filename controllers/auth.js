const model = require("../models/User");
const {
  sanitizeUser,
  sendMail,
  resetPasswordTemplate,
} = require("../services/common");
const User = model.User;
const crypto = require("crypto");

const SECRET_KEY = process.env.JWT_SECRET;
const jwt = require("jsonwebtoken");

exports.loginUser = async (req, res) => {
  console.log("req.user", req.user);
  if (req.user) {
    const token = jwt.sign(sanitizeUser(req.user), SECRET_KEY);
    res
      .status(200)
      .cookie("jwt", token, {
        expires: new Date(Date.now() + 86400000), // cookie will be removed after 8 hours
      })
      .json(token);
  }
};

exports.signUpUser = async (req, res, next) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (user) {
      res.status(400).send("user already exists");
    } else {
      const salt = crypto.randomBytes(16);
      crypto.pbkdf2(
        req.body.password,
        salt,
        310000,
        32,
        "sha256",
        async function (err, hashedPassword) {
          const newUser = new User({
            ...req.body,
            password: hashedPassword,
            salt,
          });
          const doc = await newUser.save();
          // no need to call req.login because now we are doing stateless authentication...
          // req.login(sanitizeUser(doc), (err) => {
          //   // this also calls serializer and adds to session
          //   if (err) {
          //     res.status(400).json(err);
          //   } else {
          //     const token = jwt.sign(sanitizeUser(doc), SECRET_KEY);

          const token = jwt.sign(sanitizeUser(doc), SECRET_KEY);
          res
            .status(201)
            .cookie("jwt", token, {
              expires: new Date(Date.now() + 86400000), // cookie will be removed after 8 hours
            })
            .json(token);
        }
      );
    }
  } catch (err) {
    res.status(400).json(err);
  }
};

exports.logoutUser = async (req, res) => {
  console.log("logout user called");

  res
    .status(200)
    .cookie("jwt", null, {
      expires: new Date(Date.now()), // cookie is expired now
    })
    .json({ message: "logout successfull" });
};

exports.checkUser = (req, res) => {
  console.log("checkuser ko hit kia");
  if (req && req.user) {
    const token = jwt.sign(sanitizeUser(req.user), SECRET_KEY);
    res.status(200).json(token);
  } else {
    res.status(400).send("session expired login again");
  }
};

exports.resetPasswordRequest = async (req, res) => {
  console.log("reset password request hit");
  const { email } = req.body;
  const user = await User.findOne({ email: email });
  if (user) {
    // Generate a unique reset token
    const resetToken = crypto.randomBytes(32).toString("hex");
    user.resetToken = resetToken;
    await user.save();

    try {
      const response = await sendMail({
        from: '"E-commerce" <emazakhtar11@gmail.com>',
        to: email,
        subject: "Password Reset for Ecommerce",
        text: `Click this link to reset your password: http://localhost:3000/reset-password?token=${resetToken}&email=${user.email}`,
        // html: resetPasswordTemplate(),
      });
      res.status(200).json({ message: "email successfully sent" });
    } catch (err) {
      res.status(400).json(err);
    }
  } else {
    res.status(400).send("no account with this email exists");
  }
};

// exports.verifyToken = async (req, res) => {
//   const token = req.query.token;
//   console.log("verify token hit");
//   console.log(token);
//   const user = await User.findOne({ resetToken: token });
//   console.log(user);

//   if (user) {
//     try {
//       res.status(200).json({ message: "Token Verified Succesfully" });
//     } catch (err) {
//       res.status(400).json(err);
//     }
//   } else {
//     res.status(400).send("Token Invalid Or Expired");
//   }
// };
exports.resetPassword = async (req, res) => {
  console.log(req.body);
  const { email } = req.body;
  const { password } = req.body;
  const { token } = req.body;
  // doing this will verify the token as well ie; finding user with token and email both ...
  try {
    const user = await User.findOne({ email: email, resetToken: token });
    if (user) {
      const salt = crypto.randomBytes(16);
      crypto.pbkdf2(
        password,
        salt,
        310000,
        32,
        "sha256",
        async function (err, hashedPassword) {
          user.password = hashedPassword;
          user.salt = salt;
          user.resetToken = "";
          await user.save();
        }
      );
      await sendMail({
        from: '"E-commerce" <emazakhtar11@gmail.com>',
        to: email,
        subject: "Password Reset Successful",
        text: "Your password was successfully changed",
      });
      res.status(200).json({ message: "password changed successfully" });
    } else {
      res.status(400).send("invalid Token or Email");
    }
  } catch (err) {
    res.status(400).json(err);
  }
};
