const { Schema, model } = require("mongoose");

const { handlerMongooseError } = require("../helpers/handlerMongooseError");

const Joi = require("joi");

const productSchema = new Schema(
  {
    _id: {
      type: String,
    },
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
    favorite: {
      type: Boolean,
      default: false,
    },
    basket: {
      type: Boolean,
      default: false,
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: "user",
      require: true,
    },
  },
  { versionKey: false }
);

productSchema.post("save", handlerMongooseError);

const addSchema = Joi.object({
  _id: Joi.string().required(),
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
  favorite: Joi.boolean(),
  basket: Joi.boolean(),
});

const updateStatusFavorite = Joi.object({
  _id: Joi.string().required(),
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
  favorite: Joi.boolean(),
  basket: Joi.boolean(),
});
const updateStatusBasket = Joi.object({
  _id: Joi.string().required(),
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
  favorite: Joi.boolean(),
  basket: Joi.boolean(),
});

const sсhemas = {
  addSchema,
  updateStatusFavorite,
  updateStatusBasket,
};

const Product = model("products", productSchema);

module.exports = {
  Product,
  sсhemas,
};
