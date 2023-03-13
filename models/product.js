const mongoose = require('mongoose');
const { ObjectId } = mongoose.Schema;

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      required: true,
      maxlength: 32,
    },
    manufacturer: {
      type: String,
      required: true,
      maxlength: 2000,
    },
    expiry: {
      type: String,
      required: true,
      maxlength: 32,
    },
    quantity: {
      type: Number,
    },
    mrp: {
      type: Number,
      trim: true,
      required: true,
      maxlength: 32,
    },
    sold: {
      type: Number,
      default: 0,
    },
    offer: {
      type: Number,
      trim: true,
      required: false,
      maxlength: 32,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Product', productSchema);
