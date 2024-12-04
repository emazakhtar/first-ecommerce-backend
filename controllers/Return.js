const { Return } = require("../models/Return");

exports.createReturn = async (req, res) => {
  const returnRequest = new Return(req.body);

  try {
    const response = await returnRequest.save();
    res.status(201).json(response);
  } catch (err) {
    res.status(400).json(err);
  }
};

exports.getAllReturn = async (req, res) => {
  let query = Return.find({});
  let totalDocsQuery = Return.find({});

  try {
    const totalDocs = await totalDocsQuery.count().exec();
    const doc = await query.exec();
    res.set("X-Total-Count", totalDocs);
    res.status(200).json(doc);
  } catch (err) {
    res.status(400).json(err);
  }
};

exports.getReturnById = async (req, res) => {
  const { id } = req.params;
  try {
    const order = await Return.findOne({ _id: id });
    res.status(200).json(order);
  } catch (err) {
    res.status(400).json(err);
  }
};
exports.getReturnByUserEmail = async (req, res) => {
  console.log("ghhbnnjhhghhbhgyftyhbh");
  const { email } = req.params;
  console.log(email);
  try {
    const userReturns = await Return.find({ userEmail: email });
    console.log(userReturns);
    res.status(200).json(userReturns);
  } catch (err) {
    res.status(400).json(err);
  }
};

exports.updateReturnById = async (req, res) => {
  console.log("hjhjhjh");
  const { id } = req.params;
  try {
    const updatedReturn = await Return.findOneAndUpdate({ _id: id }, req.body, {
      new: true,
    });

    // Validate the updated document, including the enum field
    // const validationError = updatedOrder.validateSync();

    // if (validationError) {
    //   res.status(400).json(validationError);
    // }

    res.status(200).json(updatedReturn);
  } catch (err) {
    res.status(400).json(err);
  }
};
