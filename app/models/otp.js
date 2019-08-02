const mongoose = require('mongoose');

let otpMongoDB = mongoose.createConnection(
  'mongodb://tanghalian:a9bc839993@ds163034.mlab.com:63034/food-delivery-otp',
  { useNewUrlParser: true, useFindAndModify: true }
);

const otpSchema = mongoose.Schema({
  otp: String,
  otpId: String,
});

module.exports = otpMongoDB.model('users', otpSchema);
