const mongoose = require('mongoose');

let orderMongoDB = mongoose.createConnection(
  'mongodb://jelo:a9bc839993@ds121189.mlab.com:21189/food-delivery-orders',
  { useNewUrlParser: true, useFindAndModify: true }
);

const orderSchema = mongoose.Schema({
  username: String,
  orderTotal: Number,
  orders: Array,
  date: Date,
  isPaid: Boolean,
});

module.exports = orderMongoDB.model('users', orderSchema);
