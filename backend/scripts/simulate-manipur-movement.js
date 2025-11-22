#!/usr/bin/env node

/**
 * CartSync - Manipur Location Simulator
 *
 * Simulates two carts moving around Imphal, Manipur, India
 * Cart 001 (veggies): Moves around Ima Keithel Market area
 * Cart 002 (cloths): Moves around Paona Bazaar area
 */

const axios = require("axios");

// Configuration
const API_URL = process.env.API_URL || "http://localhost:5001";
const UPDATE_INTERVAL = 5000; // 5 seconds between updates

// Manipur coordinates (Imphal city)
const IMPHAL_CENTER = { lat: 24.817, lng: 93.9368 };

// Cart credentials
const CARTS = [
  {
    cartId: "cart001",
    password: "qwerty",
    name: "Veggies Cart",
    // Route: Around Ima Keithel (Women's Market)
    route: [
      { lat: 24.812, lng: 93.936 }, // Ima Keithel Market
      { lat: 24.813, lng: 93.937 }, // Near Kangla Fort
      { lat: 24.814, lng: 93.9365 }, // MG Avenue
      { lat: 24.815, lng: 93.9375 }, // Khwairamband Bazaar
      { lat: 24.816, lng: 93.938 }, // Bir Tikendrajit Park
      { lat: 24.8155, lng: 93.939 }, // North AOC
      { lat: 24.8145, lng: 93.9385 }, // Thangal Bazaar
      { lat: 24.8135, lng: 93.9375 }, // Paona Bazaar
      { lat: 24.8125, lng: 93.9365 }, // Back to Ima Keithel
    ],
  },
  {
    cartId: "cart002",
    password: "qwerty",
    name: "Cloths Cart",
    // Route: Around Paona Bazaar and residential areas
    route: [
      { lat: 24.82, lng: 93.94 }, // Paona Bazaar
      { lat: 24.821, lng: 93.941 }, // Keishampat
      { lat: 24.822, lng: 93.942 }, // Singjamei
      { lat: 24.823, lng: 93.943 }, // Lamphelpat
      { lat: 24.824, lng: 93.944 }, // Uripok
      { lat: 24.8235, lng: 93.945 }, // Sagolband
      { lat: 24.8225, lng: 93.9445 }, // Thangmeiband
      { lat: 24.8215, lng: 93.9435 }, // Kwakeithel
      { lat: 24.8205, lng: 93.9425 }, // Back to Paona
    ],
  },
];

// Store cart tokens and current positions
const cartStates = {};

// Helper function to add random variation to movement (makes it more realistic)
function addRandomVariation(lat, lng, variation = 0.0003) {
  return {
    lat: lat + (Math.random() - 0.5) * variation,
    lng: lng + (Math.random() - 0.5) * variation,
  };
}

// Helper function to calculate accuracy (simulates GPS accuracy)
function getRandomAccuracy() {
  return Math.floor(Math.random() * 20) + 5; // 5-25 meters
}

// Login cart and get token
async function loginCart(cartId, password) {
  try {
    const response = await axios.post(`${API_URL}/api/auth/cart/login`, {
      cartId,
      password,
    });

    console.log(`✅ ${cartId} logged in successfully`);
    return response.data.token;
  } catch (error) {
    console.error(
      `❌ Failed to login ${cartId}:`,
      error.response?.data?.error || error.message
    );
    throw error;
  }
}

// Update cart location
async function updateLocation(cartId, token, latitude, longitude, accuracy) {
  try {
    await axios.post(
      `${API_URL}/api/location/update`,
      { latitude, longitude, accuracy },
      { headers: { Authorization: `Bearer ${token}` } }
    );

    const time = new Date().toLocaleTimeString();
    console.log(
      `📍 [${time}] ${cartId}: (${latitude.toFixed(6)}, ${longitude.toFixed(
        6
      )}) ±${accuracy}m`
    );
  } catch (error) {
    console.error(
      `❌ Failed to update ${cartId}:`,
      error.response?.data?.error || error.message
    );
  }
}

// Initialize cart state
async function initializeCart(cart) {
  try {
    const token = await loginCart(cart.cartId, cart.password);

    cartStates[cart.cartId] = {
      token,
      name: cart.name,
      route: cart.route,
      currentIndex: 0,
    };

    // Send initial position
    const firstPos = cart.route[0];
    const variation = addRandomVariation(firstPos.lat, firstPos.lng);
    await updateLocation(
      cart.cartId,
      token,
      variation.lat,
      variation.lng,
      getRandomAccuracy()
    );
  } catch (error) {
    console.error(`Failed to initialize ${cart.cartId}`);
  }
}

// Move cart to next position
async function moveCart(cartId) {
  const state = cartStates[cartId];
  if (!state) return;

  // Get next position in route
  state.currentIndex = (state.currentIndex + 1) % state.route.length;
  const nextPos = state.route[state.currentIndex];

  // Add slight random variation to make movement more realistic
  const variation = addRandomVariation(nextPos.lat, nextPos.lng);

  // Update location
  await updateLocation(
    cartId,
    state.token,
    variation.lat,
    variation.lng,
    getRandomAccuracy()
  );
}

// Main simulation loop
async function startSimulation() {
  console.log("🚀 CartSync Manipur Location Simulator");
  console.log("📍 Simulating cart movement in Imphal, Manipur, India\n");

  // Initialize all carts
  console.log("🔐 Logging in carts...\n");
  for (const cart of CARTS) {
    await initializeCart(cart);
  }

  console.log("\n🎯 Starting movement simulation...");
  console.log(`📡 Sending updates every ${UPDATE_INTERVAL / 1000} seconds`);
  console.log("Press Ctrl+C to stop\n");

  // Move carts at intervals
  setInterval(async () => {
    for (const cartId of Object.keys(cartStates)) {
      await moveCart(cartId);
    }
  }, UPDATE_INTERVAL);
}

// Handle graceful shutdown
process.on("SIGINT", () => {
  console.log("\n\n⏹️  Simulation stopped");
  console.log("📊 Final positions:");
  for (const [cartId, state] of Object.entries(cartStates)) {
    const pos = state.route[state.currentIndex];
    console.log(`   ${cartId}: (${pos.lat.toFixed(6)}, ${pos.lng.toFixed(6)})`);
  }
  process.exit(0);
});

// Start the simulation
startSimulation().catch((error) => {
  console.error("💥 Simulation failed:", error);
  process.exit(1);
});
