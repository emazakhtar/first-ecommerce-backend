const model = require("../models/Category");
const Category = model.Category;

exports.getAll = async (req, res) => {
  try {
    const response = await Category.find({}).exec();
    res.status(200).json(response);
  } catch (err) {
    res.status(400).json(err);
  }
};
exports.create = async (req, res) => {
  const brand = new Category(req.body);
  try {
    const doc = await brand.save();
    res.status(201).json(doc);
  } catch (err) {
    res.status(400).json(err);
  }
};
