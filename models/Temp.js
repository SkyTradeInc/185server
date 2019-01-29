const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const tempSchema = new Schema({
  inventory: Array
});

module.exports = mongoose.model('Temp', tempSchema);
