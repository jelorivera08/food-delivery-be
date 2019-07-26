const express = require('express');
const menuModel = require('../models/menu');
const router = express.Router();

// get menu
router.get('/', async (req, res) => {
  try {
    let menu = await menuModel.find({}, null);

    res.status(202).json(menu);
  } catch (err) {
    console.log(err);
    res.status(500).send({ message: 'can not get menu at the moment' });
  }
});

// place a menu item
router.post('/', async (req, res) => {
  try {
    await menuModel.create({
      name: req.body.name,
      price: req.body.price,
    });

    res.status(202).json({
      message: 'menu item placed successfuly',
    });
  } catch (err) {
    console.log(err);
    res.status(500).send({ message: 'can not place order at the moment' });
  }
});

// delete a menu item
router.delete('/', async (req, res) => {
  try {
    const { id } = req.body;

    await menuModel.findByIdAndRemove(id);

    res.status(200).json({
      message: 'menu item deleted successfuly',
    });
  } catch (err) {
    console.log(err);
    res.status(500).send({ message: 'can not place order at the moment' });
  }
});

module.exports = router;
