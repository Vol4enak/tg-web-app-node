const express = require("express");

const router = express.Router();

const { sсhemas } = require("../../models/product");

const { validateBody, isValidId, authenticate } = require("../../middlewares");

const ctrl = require("../../controllers/products");

router.get("/", authenticate, ctrl.getAll);

router.get("/data", ctrl.getAllData);

router.get("/:id", authenticate, isValidId, ctrl.getById);

router.post("/", authenticate, validateBody(sсhemas.addSchema), ctrl.add);

router.put(
  "/:id",
  isValidId,
  authenticate,
  validateBody(sсhemas.addSchema),
  ctrl.updateById
);

router.patch(
  "/:id/favorite",
  authenticate,
  validateBody(sсhemas.updateStatusFavorite),
  ctrl.updateStatus
);
router.patch(
  "/:id/basket",
  authenticate,
  validateBody(sсhemas.updateStatusBasket),
  ctrl.updateStatus
);
router.delete("/:id", authenticate, isValidId, ctrl.removeById);

module.exports = router;
