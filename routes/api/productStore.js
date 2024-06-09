const express = require("express");

const router = express.Router();
const axios = require("axios");

router.get("/", async (req, res) => {
  try {
    const response = await axios.get(
      "https://fakestoreapi.in/api/products?page=1&limit=20"
    );

    res.json(response.data);
  } catch (error) {
    console.error("Error fetching data:", error.message);

    res.status(500).json({ error: "Ошибка при получении данных" });
  }
});
router.get("/category", async (req, res) => {
  try {
    const response = await axios.get(
      "https://fakestoreapi.in/api/products/category"
    );

    res.json(response.data);
  } catch (error) {
    console.error("Error fetching data:", error.message);

    res.status(500).json({ error: "Ошибка при получении данных" });
  }
});
router.get("/productsByCategory", async (req, res) => {
  const category = req.query.category;
  try {
    const response = await axios.get(
      `https://fakestoreapi.in/api/products/category?type=${category}`
    );
    console.log(response)
    res.json(response.data);
  } catch (error) {
    console.error("Ошибка при запросе к внешнему API: ", error);
    res.status(500).send("Ошибка сервера");
  }
});

module.exports = router;
