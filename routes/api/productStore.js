const express = require("express");

const router = express.Router();

const { sсhemas } = require("../../models/productStore");

const ctrl = require("../../controllers/productsStore");

router.get("/", ctrl.getAll);

module.exports = router;
