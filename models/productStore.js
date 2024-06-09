const { Schema, model } = require("mongoose");

const { handlerMongooseError } = require("../helpers/handlerMongooseError");

const Joi = require("joi");

const productStoreSchema = new Schema(
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
      required: true, // Corrected typo: changed "require" to "required"
    },
  },
  { versionKey: false }
);

productStoreSchema.post("save", handlerMongooseError);

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
  favorite: Joi.boolean(),
  basket: Joi.boolean(),
});

const sсhemas = {
  addSchema,
};

const ProductStore = model("ProductStore", productStoreSchema);

module.exports = {
  ProductStore,
  sсhemas,
};
