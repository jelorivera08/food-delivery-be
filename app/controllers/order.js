const express = require('express');
const orderModel = require('../models/order');
const userModel = require('../models/user');
const router = express.Router();
const uuidv1 = require('uuid/v1');

// get specific order
router.get('/:username', async (req, res) => {
  let today = new Date().toLocaleDateString();
  try {
    let orders = await orderModel.find({
      username: req.params.username,
      date: today,
    });

    let ordersToday = {};
    if (orders.length <= 0) {
      ordersToday = {
        orders: [],
      };
    } else {
      ordersToday = orders.pop();
    }

    res.status(200).json(ordersToday);
  } catch (err) {
    console.log(err);
    res.status(500).send({ message: 'unable to get orders' });
  }
});

// get all order
router.get('/', async (req, res) => {
  let today = new Date().toLocaleDateString();

  try {
    let orderRecords = await orderModel.find({ date: today });

    res.status(200).json(orderRecords);
  } catch (err) {
    console.log(err);
    res.status(500).send({ message: 'unable to get orders' });
  }
});

// pay an order
router.post('/pay', async (req, res) => {
  try {
    const { id, paid } = req.body;
    let orderDetails = await orderModel.findById(id);

    if (paid === orderDetails.orderTotal) {
      await orderModel.findByIdAndUpdate(id, { isPaid: true });

      res.status(202).json({ message: 'order successfuly paid' });
    } else {
      res.status(500).json({ message: 'invalid paid amount' });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: 'unable to pay order',
    });
  }
});

// place an order
router.post('/', async (req, res) => {
  try {
    const { orders, username } = req.body;
    let today = new Date().toLocaleDateString();
    let orderTotal = 0;

    ordersWithUUID = orders.map((order) => {
      let uuid = uuidv1();
      orderTotal += order.price * order.quantity;
      return { ...order, orderId: uuid };
    });

    try {
      let ordersToday = await orderModel.find({ username, date: today });

      if (ordersToday.length >= 1) {
        let orderToday = ordersToday.pop();

        orderTotal = orderToday.orderTotal + orderTotal;

        await orderModel.updateOne(
          { username },
          { orders: [...orderToday.orders, ...ordersWithUUID], orderTotal }
        );
      } else {
        await orderModel.create({
          username,
          orderTotal,
          orders: ordersWithUUID,
          date: today,
          isPaid: false,
        });
      }

      res.status(202).json({
        message: 'Order placed successfuly',
      });
    } catch (err) {
      console.log(err);
      res.status(500).json({
        message: 'unable to place order.',
      });
    }
  } catch (err) {
    console.log(err);
    res.status(500).send({ message: 'can not place order at the moment' });
  }
});

// delete an order
router.delete('/', async (req, res) => {
  try {
    const { id, index } = req.body;

    if (id) {
      let orderDetails = await orderModel.findById(id);

      orderDetails.orderTotal =
        orderDetails.orderTotal - orderDetails.orders[index].price;

      orderDetails.orders.splice(index, 1);

      if (orderDetails.orders.length <= 0) {
        await orderModel.findByIdAndRemove(id);
      } else {
        await orderModel.findByIdAndUpdate(id, orderDetails);
      }

      res.status(200).json({
        message: 'Order deleted successfuly',
      });
    } else {
      await orderModel.deleteMany({});

      res.status(200).json({
        message: 'Orders deleted successfuly',
      });
    }
  } catch (err) {
    console.log(err);
    res.status(500).send({ message: 'can not delete orders at the moment' });
  }
});

// transfer to debt
router.post('/transfer-to-debt', async (req, res) => {
  try {
    const { id } = req.body;

    let orderToday = await orderModel.findById(id);

    let orderTotal = orderToday.orderTotal;
    let username = orderToday.username;

    let userDetails = await userModel.findOne({ username });

    let userId = userDetails._id;
    let userDebt = userDetails.debt;

    await userModel.findByIdAndUpdate(userId, { debt: userDebt + orderTotal });
    await orderModel.findByIdAndUpdate(id, { isPaid: true });

    res.status(202).json({ message: 'debt transferred successfuly.' });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: 'unable to transfer debt' });
  }
});

module.exports = router;
