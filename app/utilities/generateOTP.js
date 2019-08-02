const generateOTP = () => {
  let otp = [1, 2, 3, 4, 5, 6].map((val) => Math.trunc(Math.random() * 10));

  return otp.join('');
};

module.exports = generateOTP;
