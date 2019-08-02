const express = require('express');
const otpModel = require('../models/otp');
const router = express.Router();
const generateOTP = require('../utilities/generateOTP');
const uuidv1 = require('uuid/v1');
const Nexmo = require('nexmo');

router.post('/generate', async (req, res) => {
  try {
    const { mobileNumber } = req.body;
    otpId = uuidv1();
    otp = generateOTP();
    await otpModel.create({
      otp,
      otpId,
    });

    const nexmo = new Nexmo({
      apiKey: 'fd12bda8',
      apiSecret: 'NKq6vVBW58DmfYgA',
    });

    const from = 'Tanghalian';
    const to = mobileNumber;
    const text = `Greetings from Tanghalian! Your OTP is ${otp}. \n\n\n\nThis message is from Tanghalian`;

    nexmo.message.sendSms(from, to, text);

    res.status(200).json({ message: 'OTP Generated and sent', otpId });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: 'unable to generate OTP' });
  }
});

router.post('/validate', async (req, res) => {
  try {
    const { otpFromUser, otpId } = req.body;

    const otpGenerated = await otpModel.findOne({ otpId });

    if (otpGenerated.otp === otpFromUser) {
      res.status(200).json({ message: 'OTP is valid' });
    } else {
      res.status(400).json({ message: 'OTP is invalid' });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: 'unable to generate OTP' });
  }
});

module.exports = router;
