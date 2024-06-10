const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  category: {
    type: String,
    required: true,
  },
  productName: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  colors: {
    type: [String],
    required: true,
  },
});

const ProductModel = mongoose.model('Product', productSchema);

module.exports = ProductModel;
