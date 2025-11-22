const express = require("express");
const router = express.Router();
const Cart = require("../models/Cart");
const LocationHistory = require("../models/LocationHistory");
const { authMiddleware, adminOnly } = require("../middleware/auth");

// Get all carts (Admin only)
router.get("/", authMiddleware, adminOnly, async (req, res) => {
  try {
    const carts = await Cart.findAll({
      attributes: { exclude: ["password"] },
    });
    res.json(carts);
  } catch (error) {
    console.error("Get carts error:", error);
    res.status(500).json({ error: "Server error" });
  }
});

// Create new cart (Admin only)
router.post("/", authMiddleware, adminOnly, async (req, res) => {
  try {
    const { cartId, password, name, description } = req.body;

    if (!cartId || !password) {
      return res
        .status(400)
        .json({ error: "Cart ID and password are required" });
    }

    // Check if cart already exists
    const existingCart = await Cart.findOne({ where: { cartId } });
    if (existingCart) {
      return res.status(400).json({ error: "Cart ID already exists" });
    }

    const cart = await Cart.create({
      cartId,
      password,
      name: name || "",
      description: description || "",
    });

    res.status(201).json({
      message: "Cart created successfully",
      cart: {
        cartId: cart.cartId,
        name: cart.name,
        description: cart.description,
        isActive: cart.isActive,
      },
    });
  } catch (error) {
    console.error("Create cart error:", error);
    res.status(500).json({ error: "Server error" });
  }
});

// Update cart (Admin only)
router.put("/:cartId", authMiddleware, adminOnly, async (req, res) => {
  try {
    const { cartId } = req.params;
    const { name, description, isActive, password } = req.body;

    const cart = await Cart.findOne({ where: { cartId } });

    if (!cart) {
      return res.status(404).json({ error: "Cart not found" });
    }

    // Update fields
    if (name !== undefined) cart.name = name;
    if (description !== undefined) cart.description = description;
    if (isActive !== undefined) cart.isActive = isActive;
    if (password) cart.password = password; // Will be hashed by hook

    await cart.save();

    res.json({
      message: "Cart updated successfully",
      cart: {
        cartId: cart.cartId,
        name: cart.name,
        description: cart.description,
        isActive: cart.isActive,
      },
    });
  } catch (error) {
    console.error("Update cart error:", error);
    res.status(500).json({ error: "Server error" });
  }
});

// Delete cart (Admin only)
router.delete("/:cartId", authMiddleware, adminOnly, async (req, res) => {
  try {
    const { cartId } = req.params;

    const cart = await Cart.findOne({ where: { cartId } });

    if (!cart) {
      return res.status(404).json({ error: "Cart not found" });
    }

    // Delete location history
    await LocationHistory.destroy({ where: { cartId } });

    // Delete cart
    await cart.destroy();

    res.json({ message: "Cart deleted successfully" });
  } catch (error) {
    console.error("Delete cart error:", error);
    res.status(500).json({ error: "Server error" });
  }
});

// Get single cart info
router.get("/:cartId", authMiddleware, async (req, res) => {
  try {
    const { cartId } = req.params;

    const cart = await Cart.findOne({
      where: { cartId },
      attributes: { exclude: ["password"] },
    });

    if (!cart) {
      return res.status(404).json({ error: "Cart not found" });
    }

    res.json(cart);
  } catch (error) {
    console.error("Get cart error:", error);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
