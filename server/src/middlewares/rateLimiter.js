const rateLimit = require("express-rate-limit");

// max 5 attempts per 15 minutes 
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, 
  max: 7, 
  standardHeaders: true,
  legacyHeaders: false, 
  message: {
    success: false,
    message: "Too many login attempts from this IP. Please try again after 15 minutes.",
  },
});


const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, 
  max: 100, 
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: "Too many requests sent. Please slow down and try again later.",
  },
});

module.exports = {
  authLimiter,
  apiLimiter,
};