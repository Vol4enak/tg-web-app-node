const { Schema, model } = require("mongoose");

const { handlerMongooseError } = require("../helpers/handlerMongooseError");

const Joi = require("joi");

const productSchema = new Schema(
  {
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
      type: Number,
    },
    category: {
      type: String,
    },
    discount: {
      type: Number,
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
  title: Joi.string().required(),
  image: Joi.string().required(),
  price: Joi.number().required(),
  description: Joi.string().required(),
  brand: Joi.string().required(),
  model: Joi.string().required(),
  color: Joi.string().required(),
  category: Joi.string().required(),
  discount: Joi.number().required(),
  favorite: Joi.boolean(),
  basket: Joi.boolean(),
});

const updateStatus = Joi.object({
  favorite: Joi.boolean().required(),
  basket: Joi.boolean().required(),
});

const sсhemas = {
  addSchema,
  updateStatus,
};

const Product = model("products", productSchema);

module.exports = {
  Product,
  sсhemas,
};
