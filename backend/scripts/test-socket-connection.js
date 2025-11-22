const io = require("socket.io-client");

console.log("🧪 Testing Socket.IO Connection...\n");

const SOCKET_URL = "http://192.168.141.150:5001";
const CART_ID = "cart001";

console.log(`Connecting to: ${SOCKET_URL}`);
console.log(`Cart ID: ${CART_ID}\n`);

const socket = io(SOCKET_URL, {
  transports: ["polling", "websocket"],
  reconnection: true,
  reconnectionDelay: 1000,
  reconnectionDelayMax: 5000,
  reconnectionAttempts: 5,
  timeout: 10000,
  forceNew: false,
});

socket.on("connect", () => {
  console.log("✅ Socket connected successfully!");
  console.log(`Socket ID: ${socket.id}`);
  console.log(`Transport: ${socket.io.engine.transport.name}`);

  // Emit cart-connect event
  console.log("\n📡 Emitting cart-connect event...");
  socket.emit("cart-connect", { cartId: CART_ID });

  console.log("\n✅ Connection test successful!");
  console.log("The mobile app should be able to connect without issues.\n");

  // Disconnect after 2 seconds
  setTimeout(() => {
    console.log("Disconnecting...");
    socket.disconnect();
    process.exit(0);
  }, 2000);
});

socket.on("connect_error", (error) => {
  console.error("❌ Socket connection error:", error.message);
  process.exit(1);
});

socket.on("error", (error) => {
  console.error("❌ Socket error:", error);
});

socket.on("disconnect", (reason) => {
  console.log(`\n🔌 Socket disconnected: ${reason}`);
});

// Timeout after 15 seconds
setTimeout(() => {
  console.error("\n❌ Connection timeout - taking too long to connect");
  process.exit(1);
}, 15000);
