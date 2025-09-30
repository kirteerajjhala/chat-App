const jwt = require("jsonwebtoken");

const isAuth = async (req, res, next) => {
  try {
    let token = req.cookies?.token;

    if (!token && req.headers.authorization?.startsWith("Bearer ")) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token && req.body?.token) token = req.body.token;
    if (!token && req.query?.token) token = req.query.token;

    if (!token) return res.status(401).json({ message: "Token not found" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.id; // JWT me id field zaroori
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
