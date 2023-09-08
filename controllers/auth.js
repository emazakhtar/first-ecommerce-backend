const model = require("../models/User");
const { sanitizeUser } = require("../services/common");
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
        expires: new Date(Date.now() + 8 * 3600000), // cookie will be removed after 8 hours
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
              expires: new Date(Date.now() + 8 * 3600000), // cookie will be removed after 8 hours
            })
            .json(token);
        }
      );
    }
  } catch (err) {
    res.status(400).json(err);
  }
};
exports.checkUser = (req, res) => {
  console.log("hit kia bhai muje");
  if (req && req.user) {
    const token = jwt.sign(sanitizeUser(req.user), SECRET_KEY);
    res.status(200).json(token);
  } else {
    res.status(400).send("session expired login again");
  }
};
