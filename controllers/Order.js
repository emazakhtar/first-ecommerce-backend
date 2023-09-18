const { User } = require("../models/User");
const model = require("../models/order");
const { sendMail, invoiceTemplate } = require("../services/common");
const Order = model.Order;

exports.createOrder = async (req, res) => {
  const { id } = req.user;
  const order = new Order({ ...req.body, user: id });
  try {
    const doc = await order.save();
    const user = await User.findById(order.user);
    sendMail({
      from: '"E-commerce" <emazakhtar11@gmail.com>',
      to: user.email,
      subject: "Order Successfully Placed",
      html: invoiceTemplate(doc),
    });
    res.status(200).json(doc);
  } catch (err) {
    res.status(400).json(err);
  }
};

exports.getAllUsersOrder = async (req, res) => {
  console.log(req.user);
  const { id } = req.user;

  try {
    const doc = await Order.find({ user: id });
    console.log(doc);
    res.status(200).json(doc);
  } catch (err) {
    res.status(400).json(err);
  }
};
exports.getAllOrders = async (req, res) => {
  let query = Order.find({});
  let totalDocsQuery = Order.find({});

  if (req.query._sort && req.query._order) {
    query = query.sort({ [req.query._sort]: req.query._order });
  }

  if (req.query._page && req.query._limit) {
    let pageSize = req.query._limit;
    let page = req.query._page;
    query = query.skip(pageSize * (page - 1)).limit(pageSize);
  }

  try {
    const totalDocs = await totalDocsQuery.count().exec();
    const doc = await query.exec();
    res.set("X-Total-Count", totalDocs);
    res.status(200).json(doc);
  } catch (err) {
    res.status(400).json(err);
  }
};

exports.updateOrder = async (req, res) => {
  const { id } = req.params;
  try {
    const updatedOrder = await Order.findOneAndUpdate({ _id: id }, req.body, {
      new: true,
    });

    // Validate the updated document, including the enum field
    // const validationError = updatedOrder.validateSync();

    // if (validationError) {
    //   res.status(400).json(validationError);
    // }

    res.status(200).json(updatedOrder);
  } catch (err) {
    res.status(400).json(err);
  }
};

exports.getOrderById = async (req, res) => {
  const { id } = req.params;
  try {
    const order = await Order.findOne({ _id: id });
    res.status(200).json(order);
  } catch (err) {
    res.status(400).json(err);
  }
};
