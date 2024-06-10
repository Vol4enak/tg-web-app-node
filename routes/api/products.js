const express = require("express");

const router = express.Router();

const { sсhemas } = require("../../models/product");

const {
  validateBody,
  authenticate,
} = require("../../middlewares");

const ctrl = require("../../controllers/products");

router.get("/data", ctrl.getAllData);
router.get("/findByStatus", authenticate, ctrl.getFavorites);
router.get("/findByCategory", ctrl.getfindByCategory);

router.patch(
  "/:id/:name",
  authenticate,
  validateBody(sсhemas.updateStatusFavorite),
  ctrl.toggleFavorite
);

module.exports = router;
