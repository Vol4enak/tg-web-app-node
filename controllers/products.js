const { Product } = require("../models/product");
const { User } = require("../models/user");
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
  const { _id } = req.user;
  try {
    const existingUser = await User.findById(_id).populate("favorites");
    if (!existingUser) {
      return res.status(404).json({ message: "User not found" });
    }
    console.log(existingUser);
    res.json(existingUser.favorites);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
const getfindByCategory = async (req, res) => {
  const { category } = req.query; // Получаем категорию из параметров запроса

  try {
    // Ищем объекты по категории в базе данных
    const products = await Product.find({ category });

    res.json(products);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
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

const toggleFavorite = async (req, res) => {
  const { id } = req.params;
  const { _id } = req.user;

  try {
    const product = await Product.findById(id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    const existingUser = await User.findById(_id);

    if (!existingUser) {
      return res.status(404).json({ message: "User not found" });
    }

    // Проверяем, есть ли продукт в списке избранных
    const productIndex = existingUser.favorites.findIndex(
      (favoriteId) => favoriteId.toString() === id
    );

    if (productIndex !== -1) {
      // Если продукт уже есть в избранном, удаляем его
      existingUser.favorites.splice(productIndex, 1);
    } else {
      // Если продукта нет в избранном, добавляем его
      existingUser.favorites.push(product._id);
    }

    await existingUser.save();

    // Возвращаем обновленный объект продукта
    res.json(existingUser);
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = {
  getAllData: ctrlWrapper(getAllData),
  getFavorites: ctrlWrapper(getFavorites),
  getfindByCategory: ctrlWrapper(getfindByCategory),
  getAll: ctrlWrapper(getAll),
  getById: ctrlWrapper(getById),
  add: ctrlWrapper(add),
  removeById: ctrlWrapper(removeById),
  updateById: ctrlWrapper(updateById),
  toggleFavorite: ctrlWrapper(toggleFavorite),
};
