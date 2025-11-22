const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const Cart = require("../models/Cart");
const Admin = require("../models/Admin");

// Cart Login
router.post("/cart/login", async (req, res) => {
  try {
    const { cartId, password } = req.body;

    if (!cartId || !password) {
      return res
        .status(400)
        .json({ error: "Cart ID and password are required" });
    }

    const cart = await Cart.findOne({ where: { cartId } });

    if (!cart) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    if (!cart.isActive) {
      return res.status(401).json({ error: "Cart is inactive" });
    }

    const isPasswordValid = await cart.comparePassword(password);

    if (!isPasswordValid) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const token = jwt.sign(
      { cartId: cart.cartId, type: "cart" },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );

    res.json({
      token,
      cart: {
        cartId: cart.cartId,
        name: cart.name,
        description: cart.description,
      },
    });
  } catch (error) {
    console.error("Cart login error:", error);
    res.status(500).json({ error: "Server error" });
  }
});

// Admin Login
router.post("/admin/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res
        .status(400)
        .json({ error: "Username and password are required" });
    }

    const admin = await Admin.findOne({ where: { username } });

    if (!admin) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const isPasswordValid = await admin.comparePassword(password);

    if (!isPasswordValid) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const token = jwt.sign(
      { username: admin.username, type: "admin" },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );

    res.json({
      token,
      admin: {
        username: admin.username,
        email: admin.email,
      },
    });
  } catch (error) {
    console.error("Admin login error:", error);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
