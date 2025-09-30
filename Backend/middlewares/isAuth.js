const jwt = require("jsonwebtoken");

const isAuth =async (req, res, next) => {
  try {
    // 1. Cookie me check karo
    let token = req.cookies?.token;

    // 2. Agar cookie me nahi mila to Authorization header check karo
    if (!token && req.headers.authorization) {
      if (req.headers.authorization.startsWith("Bearer ")) {
        token = req.headers.authorization.split(" ")[1];
      }
    }

    // 3. Agar fir bhi nahi mila to body me check karo
    if (!token && req.body?.token) {
      token = req.body.token;
    }

    // 4. Agar query param me mila
    if (!token && req.query?.token) {
      token = req.query.token;
    }

    // 5. Agar kahi bhi nahi mila to error
    if (!token) {
      return res.status(401).json({ message: "Token not found" });
    }

    // ✅ Token verify
    const decoded = await jwt.verify(token, process.env.JWT_SECRET);
    console.log("decoded: " ,decoded)
    req.userId = decoded.id;

    next();
  } catch (error) {
    return res.status(401).json({
      message: "Authentication failed",
      success: false,
      errorMsg: error.message,
    });
  }
};

module.exports = isAuth;
