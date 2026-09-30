const { authenticated } = require("./auth");
const {
  ownerAuth,
  ownerOnly,
  adminAuth,
  requireActiveResidentCondominium,
} = require("./userAuth");
const { checkAvailability, validateBookingData } = require("./validateBooking");

module.exports = {
  authenticated,
  adminAuth,
  ownerAuth,
  ownerOnly,
  requireActiveResidentCondominium,
  checkAvailability,
  validateBookingData,
};
