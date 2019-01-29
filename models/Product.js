const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const productSchema = new Schema({
  barcode:  Number,
  productName: String,
  size: String,
  color: String,
  aeroCode: String,
  stockCount: Number,

});

module.exports = mongoose.model('Product', productSchema);
