const Cart = require("../models/Cart");
const { Op } = require("sequelize");

// Track connected carts
const connectedCarts = new Map();

const setupSocketIO = (io) => {
  io.on("connection", (socket) => {
    console.log("New client connected:", socket.id);

    // Cart connects and identifies itself
    socket.on("cart-connect", async (data) => {
      try {
        const { cartId } = data;

        if (!cartId) {
          socket.emit("error", { message: "Cart ID required" });
          return;
        }

        const cart = await Cart.findOne({ where: { cartId } });

        if (!cart) {
          socket.emit("error", { message: "Cart not found" });
          return;
        }

        // Mark cart as online
        cart.isOnline = true;
        cart.lastSeen = new Date();
        await cart.save();

        // Store connection
        connectedCarts.set(cartId, socket.id);
        socket.cartId = cartId;

        // Notify all clients
        io.emit("cart-status-change", {
          cartId,
          isOnline: true,
          lastSeen: cart.lastSeen,
        });

        console.log(`Cart ${cartId} connected`);
      } catch (error) {
        console.error("Cart connect error:", error);
        socket.emit("error", { message: "Connection failed" });
      }
    });

    // Admin connects
    socket.on("admin-connect", () => {
      socket.join("admins");
      console.log("Admin connected");
    });

    // Handle disconnect
    socket.on("disconnect", async () => {
      console.log("Client disconnected:", socket.id);

      if (socket.cartId) {
        const cartId = socket.cartId;
        connectedCarts.delete(cartId);

        try {
          const cart = await Cart.findOne({ where: { cartId } });
          if (cart) {
            cart.isOnline = false;
            cart.lastSeen = new Date();
            await cart.save();

            // Notify all clients
            io.emit("cart-status-change", {
              cartId,
              isOnline: false,
              lastSeen: cart.lastSeen,
            });
          }
        } catch (error) {
          console.error("Disconnect error:", error);
        }
      }
    });

    // Request all carts status
    socket.on("get-all-carts", async () => {
      try {
        const carts = await Cart.findAll({
          attributes: { exclude: ["password"] },
        });
        socket.emit("all-carts", carts);
      } catch (error) {
        console.error("Get all carts error:", error);
        socket.emit("error", { message: "Failed to fetch carts" });
      }
    });
  });

  // Check for stale connections every minute
  setInterval(async () => {
    try {
      const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);

      const staleCarts = await Cart.findAll({
        where: {
          isOnline: true,
          lastSeen: { [Op.lt]: fiveMinutesAgo },
        },
      });

      for (const cart of staleCarts) {
        cart.isOnline = false;
        await cart.save();

        io.emit("cart-status-change", {
          cartId: cart.cartId,
          isOnline: false,
          lastSeen: cart.lastSeen,
        });
      }
    } catch (error) {
      console.error("Stale check error:", error);
    }
  }, 60000); // Every minute
};

module.exports = setupSocketIO;
