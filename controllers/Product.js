const model = require("../models/Product");
const Product = model.Product;

// CREATE...
exports.create = async (req, res) => {
  const product = new Product(req.body);
  product.discountedPrice = Math.round(
    product.price - (product.discountPercentage / 100) * product.price
  );
  try {
    const response = await product.save();
    res.status(201).json(response);
  } catch (err) {
    res.status(400).json(err);
  }
};

// READ...
exports.getAll = async (req, res) => {
  let query = Product.find({});
  let totalDocsQuery = Product.find({});

  // Filtering...
  if (req.query.category) {
    console.log(req.query.category.split(","));
    query = query.find({
      category: { $in: req.query.category.split(",") },
    });
    totalDocsQuery = totalDocsQuery.find({
      category: { $in: req.query.category.split(",") },
    });
  }
  if (req.query.brand) {
    console.log(req.query.brand.split(","));
    query = query.find({ brand: { $in: req.query.brand.split(",") } });
    totalDocsQuery = totalDocsQuery.find({
      brand: { $in: req.query.brand.split(",") },
    });
  }

  // 🔥 Adding Search Functionality
  if (req.query.q) {
    const searchRegex = new RegExp(req.query.q, "i"); // "i" makes it case-insensitive
    query = query.find({ name: searchRegex });
    totalDocsQuery = totalDocsQuery.find({ name: searchRegex });
  }

  // Sorting...
  if (req.query._sort && req.query._order) {
    query = query.sort({ [req.query._sort]: req.query._order });
  }

  // Paginating...
  if (req.query._page && req.query._limit) {
    const page = req.query._page;
    const pageSize = req.query._limit;

    query = query.skip(pageSize * (page - 1)).limit(pageSize);
  }

  try {
    const docs = await query.exec();
    const totalDocs = await totalDocsQuery.count().exec();
    res.set("X-Total-Count", totalDocs);
    res.status(200).json(docs);
  } catch (err) {
    res.status(400).json(err);
  }
};
exports.get = async (req, res) => {
  const { id } = req.params;

  try {
    const response = await Product.findById(id);
    res.status(200).json(response);
  } catch (err) {
    res.status(400).json(err);
  }
};
exports.update = async (req, res) => {
  const { id } = req.params;

  try {
    const product = await Product.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    product.discountedPrice = Math.round(
      product.price - (product.discountPercentage / 100) * product.price
    );
    const response = await product.save();
    res.status(200).json(response);
  } catch (err) {
    res.status(400).json(err);
  }
};

exports.initializeDiscountedPrice = async (req, res) => {
  try {
    const products = await Product.find();
    for (let product of products) {
      product.discountedPrice = Math.round(
        product.price - (product.discountPercentage / 100) * product.price
      );
      await product.save();
    }
    res.status(200).json("all feilds updated");
  } catch (err) {
    res.status(401).json(err);
  }
};
