const { Product } = require("../models/product");

const { HttpError, ctrlWrapper } = require("../helpers");

const getAll = async (req, res) => {
 
  const { page = 1, limit = 10 } = req.query;
  const skip = (page - 1) * limit;
  const result = await Product.find({ owner }, "-createAt -updatedAt", {
    skip,
    limit,
  }).populate("owner", "email");

  res.status(200).json(result);
};

module.exports = {
  getAll: ctrlWrapper(getAll),
};
