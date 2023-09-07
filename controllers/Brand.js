const model = require("../models/Brand");
const Brand = model.Brand;

exports.getAll = async (req, res) => {
  try {
    const response = await Brand.find({}).exec();
    res.status(200).json(response);
  } catch (err) {
    res.status(400).json(err);
  }
};
exports.create = async (req, res) => {
  const brand = new Brand(req.body);
  try {
    const doc = await brand.save();
    res.status(201).json(doc);
  } catch (err) {
    res.status(400).json(err);
  }
};
