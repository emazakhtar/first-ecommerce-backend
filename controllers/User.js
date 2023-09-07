const model = require("../models/user");
const User = model.User;

exports.updateUser = async (req, res) => {
  const { id } = req.user;
  try {
    const doc = await User.findOneAndUpdate({ _id: id }, req.body, {
      new: true,
    });
    res.status(200).json(doc);
  } catch (err) {
    res.status(400).json(err);
  }
};

exports.getUserById = async (req, res) => {
  const { id } = req.user;
  try {
    const user = await User.findOne({ _id: id });
    res.status(200).json({
      email: user.email,
      name: user.name,
      role: user.role,
      address: user.address,
      orders: user.orders,
    });
  } catch (err) {
    res.status(400).json(err);
  }
};
