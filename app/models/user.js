const mongoose = require('mongoose');

let userMongoDB = mongoose.createConnection(
  'mongodb://jelo:a9bc839993@ds139278.mlab.com:39278/food-delivery-users',
  { useNewUrlParser: true, useFindAndModify: true }
);

const userSchema = mongoose.Schema({
  username: String,
  password: String,
  mobileNumber: String,
  debt: Number,
  type: String,
  orderTotal: Object,
});

module.exports = userMongoDB.model('users', userSchema);
