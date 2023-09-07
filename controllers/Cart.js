const model = require("../models/Cart");
const Cart = model.Cart;
const mongoose = require("mongoose");

exports.createCart = async (req, res) => {
  const { id } = req.user;
  const cartItem = new Cart({ ...req.body, user: id });
  try {
    let item = await cartItem.save();
    const result = await item.populate("product");
    res.status(200).json(result);
  } catch (err) {
    res.status(400).json(err);
  }
};
exports.deleteCart = async (req, res) => {
  const { id } = req.params;
  try {
    const doc = await Cart.findOneAndDelete({ _id: id }).populate("product");
    res.status(200).json(doc);
  } catch (err) {
    res.status(400).json(err);
  }
};
exports.updateCart = async (req, res) => {
  let { id } = req.params;

  try {
    const updatedItem = await Cart.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    const result = await updatedItem.populate("product");
    res.status(200).json(result);
  } catch (err) {
    res.status(400).json(err);
  }
};
exports.getAllUsersCart = async (req, res) => {
  const { id } = req.user;
  try {
    const usersCart = await Cart.find({ user: id }).populate("product");
    res.status(200).json(usersCart);
  } catch (err) {
    res.status(400).json(err);
  }
};
