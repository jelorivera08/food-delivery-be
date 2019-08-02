const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const userController = require('./controllers/user');
const orderController = require('./controllers/order');
const menuController = require('./controllers/menu');
const optController = require('./controllers/otp');
const app = express();
var http = require('http').createServer(app);

const port = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(cors());
app.use('/api/v1/user', userController);
app.use('/api/v1/order', orderController);
app.use('/api/v1/menu', menuController);
app.use('/api/v1/otp', optController);

http.listen(port, () => console.log(`listening on port ${port}`));
