const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const orderSchema = new Schema({
  orderID: Number,
  createdAt: Number,
  completedAt: Number,
  status: String,
  products: Array
});

module.exports = mongoose.model('Order', orderSchema);
