const mongoose = require('mongoose');

let menuMongoDB = mongoose.createConnection(
  'mongodb://jelo:a9bc839993@ds225902.mlab.com:25902/fd-menu',
  { useNewUrlParser: true, useFindAndModify: true }
);

const menuSchema = mongoose.Schema({
  name: String,
  price: Number,
});

module.exports = menuMongoDB.model('users', menuSchema);
