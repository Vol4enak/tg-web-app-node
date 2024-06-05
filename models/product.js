const { Schema, model } = require("mongoose");

const { handlerMongooseError } = require("../helpers/handlerMongooseError");

const Joi = require("joi");

const productSchema = new Schema(
  {
    // "title": "Wmart Household Air Purifier UV Sterilization Air Cleaner Odor Eliminator Home Use (53047134WM)",
    // "image": "https://storage.googleapis.com/fir-auth-1c3bc.appspot.com/1694289337342-41TJxKgWadL._SL1024_.jpg",
    // "price": 1118,
    // "description": "This air purifier can help with this issue by cleaning the air. This is a device that filters the air and removes dust and other particles.\r\nThis air purifier will help with breathing issues and allergies, and can even improve the indoor air quality.\r\nPackage Includes:1 Set Air purifier\r\nColor: Multicolor,Meterial: Plastic, Color: Multicolor,Size: 18 x 20cm\r\nKindly refer the product description brfore buying.",
    // "brand": "Generic",
    // "model": "PWMN53047134",
    // "color": "white",
    // "category": "appliances",
    // "discount": 19
    title: {
      type: String,
      required: [true, "Set name for favorite"],
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
      required: [true, "Set name for favorite"],
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
