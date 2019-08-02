const express = require('express');
const userModel = require('../models/user');
const router = express.Router();
const Nexmo = require('nexmo');

// log in user
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    let user = await userModel.find(
      {
        username,
        password,
      },
      null
    );

    let userPopped = user.pop();

    if (userPopped) {
      res.status(202).json({
        username: userPopped.username,
        debt: userPopped.debt,
        type: userPopped.type,
      });
    } else {
      res.status(403).json('ERROR');
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: 'can not log in' });
  }
});

// create a user
router.post('/signup', async (req, res) => {
  try {
    const { username, password, mobileNumber } = req.body;
    let existingUsers = await userModel.find({}, null);
    let isExisting = false;

    existingUsers.forEach((existingUser) => {
      if (existingUser.username === username) {
        isExisting = true;
      }
    });

    if (isExisting) {
      res.status(400).json({ message: 'User is already existing' });
    } else {
      userModel.create({
        username,
        password,
        mobileNumber,
        debt: 0,
        type: 'user',
      });

      res.status(202).json({
        message: 'user created',
      });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: 'can not save to db' });
  }
});

// get all users
router.get('/', async (req, res) => {
  try {
    let allUsers = await userModel.find({}, null);

    allUsersWithoutPassword = [];

    allUsers.map((user) => {
      allUsersWithoutPassword = [
        ...allUsersWithoutPassword,
        {
          username: user.username,
          type: user.type,
          debt: user.debt,
          orderTotal: user.orderTotal,
        },
      ];
    });

    res.status(202).json(allUsersWithoutPassword);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: 'unable to get all users' });
  }
});

// pay a user's debt
router.post('/pay-debt', async (req, res) => {
  try {
    const { username, paid } = req.body;

    const userProfile = await userModel.findOne({ username });

    await userModel.findOneAndUpdate(
      { username },
      { debt: userProfile.debt - paid }
    );

    res.status(202).json({ message: 'debt paid successfuly' });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: 'unable to pay user debt' });
  }
});

// send sms
// router.post('/sms', async (req, res) => {
//   try {
//     const nexmo = new Nexmo({
//       apiKey: 'fd12bda8',
//       apiSecret: 'NKq6vVBW58DmfYgA',
//     });

//     const from = 'Tanghalian';
//     const to = '  ';
//     const text =
//       'Hello from Jelo test\n\n\n\nThis message is from Tanghalian  ';

//     nexmo.message.sendSms(from, to, text);

//     res.status(202).json({ message: 'sms sent successfuly' });
//   } catch (err) {
//     console.log(err);
//     res.status(500).json({ message: 'unable to send sms' });
//   }
// });

// generate otp
router.post('/generate-top', async (req, res) => {
  try {
    res.status(200).json({ message: 'generate OTP' });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: 'unable to generate OTP' });
  }
});

module.exports = router;
