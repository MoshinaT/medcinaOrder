const mongoose = require('mongoose');
const { ObjectId } = mongoose.Schema;

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      required: false,
    },
    manufacturer: {
      type: String,
      required: false,
    },
    quantity: {
      type: Number,
    },
    mrp: {
      type: Number,
      trim: true,
      required: false,
    },
    sold: {
      type: Number,
      default: 0,
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Product', productSchema);
