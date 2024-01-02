const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const productSchema = new Schema(
  {
    title: {
      type: String,
      require: true,
    },
    category: {
      type: String,
      require: true,
    },
    avatar: {
      type: String,
      require: true,
    },
    imageUrls: {
      type: [String],
    },
    shortDesc: {
      type: String,
      require: true,
    },
    longDesc: {
      type: String,
      require: true,
    },
    price: {
      type: Number,
      require: true,
    },
    amount: {
      type: Number,
      require: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Product", productSchema);
