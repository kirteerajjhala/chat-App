const jwt = require("jsonwebtoken");

const generateJwtToken = (user_id, res) => {
  try {
    // ✅ Payload as object
    const token = jwt.sign({ id: user_id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });



res.cookie("token", token, {
  httpOnly: true,
  secure: false, // dev ke liye false, production me true
  sameSite: "Strict",
  maxAge: 7*24 * 60 * 60 * 1000, // 1 day
});

return token;

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "JWT token error",
      error: error.message,
    });
  }
};

module.exports = generateJwtToken;
