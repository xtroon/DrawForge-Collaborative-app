const jwt = require("jsonwebtoken");

// generate token
const generateToken = (id, email) => {
  return jwt.sign(
    { id, email },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );
};

// verify token
const verifyToken = (token) => {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    return {
      success: true,
      decoded,
    };
  } catch (err) {
    return {
      success: false,
      message: err.message,
    };
  }
};

module.exports = { generateToken, verifyToken };