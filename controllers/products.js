const { Product } = require("../models/product");
const { User } = require("../models/user");
const { HttpError, ctrlWrapper } = require("../helpers");

const getAllData = async (req, res) => {
  const { page = 1, limit = 150 } = req.query;
  const skip = (page - 1) * limit;
  const result = await Product.find({}, "-createAt -updatedAt", {
    skip,
    limit,
  });
  res.status(200).json(result);
};

const getFavorites = async (req, res) => {
  const { _id } = req.user;
  try {
    const existingUser = await User.findById(_id).populate("favorites basket");
    if (!existingUser) {
      return res.status(404).json({ message: "Пользователь не найден" });
    }
    const filteredUser = {
      favorites: existingUser.favorites,
      basket: existingUser.basket,
    };

    res.json(filteredUser);
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

const toggleFavorite = async (req, res) => {
  const { id, name } = req.params;
  const { _id } = req.user;

  try {
    const product = await Product.findById(id);
    if (!product) {
      console.log("Product not found for ID:", id);
      return res.status(404).json({ message: "Product not found" });
    }

    const user = await User.findById(_id);
    if (!user) {
      console.log("User not found for ID:", _id);
      return res.status(404).json({ message: "User not found" });
    }

    // Toggle favorite or basket
    let targetArray, targetField;
    if (name === "favorite") {
      targetArray = user.favorites;
      targetField = "favorite";
    } else if (name === "basket") {
      targetArray = user.basket;
      targetField = "basket";
    } else {
      return res.status(400).json({ message: "Invalid target field" });
    }

    const index = targetArray.indexOf(product._id);
    if (index !== -1) {
      targetArray.splice(index, 1); // Remove if exists
    } else {
      targetArray.push(product._id); // Add if not exists
    }

    await user.save();
    console.log({ favorites: user.favorites, basket: user.basket });
    res.json({ favorites: user.favorites, basket: user.basket }); // Respond with the updated array
  } catch (error) {
    console.error(
      "Failed to toggle favorite or basket for user:",
      _id,
      "with error:",
      error
    );
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};
module.exports = {
  getAllData: ctrlWrapper(getAllData),
  getFavorites: ctrlWrapper(getFavorites),
  getfindByCategory: ctrlWrapper(getfindByCategory),
  toggleFavorite: ctrlWrapper(toggleFavorite),
};
