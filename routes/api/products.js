const express = require("express");

const router = express.Router();

const { sсhemas } = require("../../models/product");

const { validateBody, isValidId } = require("../../middlewares");

const ctrl = require("../../controllers/products");

router.get("/", ctrl.getAll);

router.get("/:productsId", isValidId, ctrl.getById);

router.post("/", validateBody(sсhemas.addSchema), ctrl.add);

router.put(
  "/:productsId",
  isValidId,

  validateBody(sсhemas.addSchema),
  ctrl.updateById
);

router.patch(
  "/:productsId/products",

  validateBody(sсhemas.updateStatusProducts),
  ctrl.updateStatus
);
router.delete("/:productsId", isValidId, ctrl.removeById);

module.exports = router;
