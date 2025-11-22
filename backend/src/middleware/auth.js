const jwt = require("jsonwebtoken");
const Cart = require("../models/Cart");

const authMiddleware = async (req, res, next) => {
  try {
    const token = req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      return res.status(401).json({ error: "No token provided" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Check if it's a cart or admin token
    if (decoded.type === "cart") {
      const cart = await Cart.findOne({
        where: {
          cartId: decoded.cartId,
          isActive: true,
        },
      });

      if (!cart) {
        return res.status(401).json({ error: "Cart not found or inactive" });
      }

      req.cart = cart;
      req.userType = "cart";
    } else if (decoded.type === "admin") {
      req.admin = { username: decoded.username };
      req.userType = "admin";
    } else {
      return res.status(401).json({ error: "Invalid token type" });
    }

    req.token = token;
    next();
  } catch (error) {
    res.status(401).json({ error: "Please authenticate" });
  }
};

const adminOnly = (req, res, next) => {
  if (req.userType !== "admin") {
    return res.status(403).json({ error: "Admin access required" });
  }
  next();
};

module.exports = { authMiddleware, adminOnly };
