const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const isValidMobileNumber = (mobileNumber) => {
  // Example regex for a 10-digit US mobile number
  const mobileRegex = /^\d{10}$/;
  return mobileRegex.test(mobileNumber);
};

module.exports = { isValidEmail, isValidMobileNumber };
