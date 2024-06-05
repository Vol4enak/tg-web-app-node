const express = require("express");

const router = express.Router();

const { sсhemas } = require("../../models/product");

const { validateBody, isValidId, authenticate } = require("../../middlewares");

const ctrl = require("../../controllers/products");

router.get("/", authenticate, ctrl.getAll);

router.get("/:productsId", authenticate, isValidId, ctrl.getById);

router.post("/", authenticate, validateBody(sсhemas.addSchema), ctrl.add);

router.put(
  "/:productsId",
  isValidId,
  authenticate,
  validateBody(sсhemas.addSchema),
  ctrl.updateById
);

router.patch(
  "/:productsId/products",
  authenticate,
  validateBody(sсhemas.updateStatusProducts),
  ctrl.updateStatus
);
router.delete("/:productsId", isValidId, authenticate, ctrl.removeById);

module.exports = router;
