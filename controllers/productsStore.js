const { ProductStore } = require("../models/productStore");

const { ctrlWrapper } = require("../helpers");

const getAll = async (req, res) => {
  const result = await ProductStore.find({}, "-createAt -updatedAt");

  res.status(200).json(result);
};

module.exports = {
  getAll: ctrlWrapper(getAll),
};
