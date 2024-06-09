const { Product } = require("../models/product");

const { HttpError, ctrlWrapper } = require("../helpers");

const getAll = async (req, res) => {
  const { _id: owner } = req.user;
  const { page = 1, limit = 10 } = req.query;
  const skip = (page - 1) * limit;
  const result = await Product.find({ owner }, "-createAt -updatedAt", {
    skip,
    limit,
  }).populate("owner", "email");

  res.status(200).json(result);
};

const getAllData = async (req, res) => {
  const { page = 1, limit = 10 } = req.query;
  const skip = (page - 1) * limit;
  const result = await Product.find({}, "-createAt -updatedAt", {
    skip,
    limit,
  });
  res.status(200).json(result);
};

const getById = async (req, res) => {
  const { id } = req.params;
  const result = await Product.findById(id);
  if (!result) {
    throw HttpError(404, "Not found");
  }
  res.status(200).json(result);
};

const getFavorites = async (req, res) => {
  try {
    const favorites = await Product.find({ favorite: true }); // Поиск всех продуктов с favorite: true

    if (favorites.length === 0) {
      return res.status(404).json({ message: "No favorite products found." });
    }

    res.json(favorites);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const add = async (req, res) => {
  const { _id: owner } = req.user;
  const result = await Product.create({ ...req.body, owner });
  res.status(201).json(result);
};
const removeById = async (req, res) => {
  const { id } = req.params;
  const result = await Product.findByIdAndRemove(id);
  if (!result) {
    throw HttpError(404, "Not found");
  }
  res.status(200).json({
    message: "product deleted",
  });
};
const updateById = async (req, res) => {
  const { id } = req.params;
  const result = await Product.findByIdAndUpdate(id, req.body, {
    new: true,
  });
  if (!result) {
    throw HttpError(404, "Not found");
  }
  res.json(result);
};

const updateStatus = async (req, res) => {
  const { _id: owner } = req.user;
  const { id } = req.params;

  if (!id) {
    throw HttpError(400, "Product ID is required");
  }

  const existingProduct = await Product.findById(id);
  if (!existingProduct) {
    // Создаем новый продукт, если продукт не найден
    const newProduct = await Product.create({ ...req.body, owner });
    res.status(201).json(newProduct);
  } else {
    // Обновляем поле существующего продукта
    const updatedProduct = await Product.findByIdAndUpdate(
      id,
      { ...req.body, owner },
      { new: true }
    );
    if (!updatedProduct) {
      throw HttpError(404, "Product not found");
    }
    res.json(updatedProduct);
  }
};

module.exports = {
  getAllData: ctrlWrapper(getAllData),
  getFavorites: ctrlWrapper(getFavorites),
  getAll: ctrlWrapper(getAll),
  getById: ctrlWrapper(getById),
  add: ctrlWrapper(add),
  removeById: ctrlWrapper(removeById),
  updateById: ctrlWrapper(updateById),
  updateStatus: ctrlWrapper(updateStatus),
};
