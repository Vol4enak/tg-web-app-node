const { Schema, model } = require("mongoose");

const { handlerMongooseError } = require("../helpers/handlerMongooseError");

const Joi = require("joi");

const productSchema = new Schema(
  {
    id: {
      type: Number,
    },
    title: {
      type: String,
    },
    image: {
      type: String,
    },
    price: {
      type: Number,
    },
    description: {
      type: String,
    },
    brand: {
      type: String,
    },
    model: {
      type: String,
    },
    color: {
      type: String,
    },
    category: {
      type: String,
    },
    popular: {
      type: Boolean,
    },
    discount: {
      type: Number,
    },
    onSale: {
      type: Boolean,
    },
  },
  { versionKey: false }
);

productSchema.post("save", handlerMongooseError);

const addSchema = Joi.object({
  id: Joi.number().required(),
  title: Joi.string().required(),
  image: Joi.string().required(),
  price: Joi.number().required(),
  description: Joi.string().required(),
  brand: Joi.string().required(),
  model: Joi.string().required(),
  color: Joi.string(),
  category: Joi.string().required(),
  popular: Joi.boolean(),
  discount: Joi.number(),
  onSale: Joi.boolean(),
});

const updateStatusFavorite = Joi.object({
  _id: Joi.string(),
});

const sсhemas = {
  addSchema,
  updateStatusFavorite,
};

const Product = model("products", productSchema);

module.exports = {
  Product,
  sсhemas,
};
