const { Product } = require("../models/Product");
const { User } = require("../models/User");
const model = require("../models/order");
const { sendMail, invoiceTemplate } = require("../services/common");
const Order = model.Order;

exports.createOrder = async (req, res) => {
  const { id } = req.user;
  const order = new Order({ ...req.body, user: id });

  try {
    const doc = await order.save();

    const user = await User.findById(doc.user);

    // let update, arrayFilters, options;

    for (let item of order.cartItems) {
      console.log("0");
      const productId = item.product.id;
      const size = item.size;
      const color = item.color;
      const quantity = item.quantity;
      console.log("1");

      // Define the condition, update, and options variables here
      const condition = {
        // Your condition here
        // For example, find the product with a specific name
        _id: productId,
      };

      const update = {
        $inc: {
          "variants.$[elem].stock": -1 * quantity, // Use "elem" to refer to the matched variant
          stock: -1 * quantity,
        },
        // $set: {
        //   // Update the variant (for example, set the 'stock' field)
        //   "variants.$[elem].stock": -1 * quantity, // Replace with the new value you want to set
        // },
      };

      const arrayFilters = [{ "elem.size": size, "elem.color": color }];

      const options = {
        arrayFilters,
        new: true, // Return the updated document
        // runValidators: true, // Run validators (if you have any) on the update
      };

      console.log("10");
      const updatedProduct = await Product.findOneAndUpdate(
        condition,
        update,
        options
      );

      if (updatedProduct) {
        console.log("Updated product:", updatedProduct);
        // Handle the updated product document here
      } else {
        console.log("No matching product found.");
        // Handle the case where no matching product was found
      }
    }
    sendMail({
      from: '"E-commerce" <emazakhtar11@gmail.com>',
      to: user.email,
      subject: "Order Successfully Placed",
      html: invoiceTemplate(doc),
    });
    res.status(200).json(doc);
  } catch (err) {
    console.log(err);
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
