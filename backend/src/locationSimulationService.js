/**
 * CartSync - Manipur Location Simulator
 *
 * Simulates carts moving around Imphal, Manipur, India
 * Intended to be started from server.js (not CLI)
 */

const axios = require("axios");

// ================= CONFIG =================
const API_URL = process.env.API_URL || "http://localhost:5001";
const UPDATE_INTERVAL = 5000;

const CARTS = [
  {
    cartId: "cart001",
    password: "qwerty",
    name: "Simulation Cart 1",
    route: [
      { lat: 24.812, lng: 93.936 },
      { lat: 24.813, lng: 93.937 },
      { lat: 24.814, lng: 93.9365 },
      { lat: 24.815, lng: 93.9375 },
      { lat: 24.816, lng: 93.938 },
      { lat: 24.8155, lng: 93.939 },
      { lat: 24.8145, lng: 93.9385 },
      { lat: 24.8135, lng: 93.9375 },
      { lat: 24.8125, lng: 93.9365 },
    ],
  },
  {
    cartId: "cart002",
    password: "qwerty",
    name: "Simulation Cart 2",
    route: [
      { lat: 24.82, lng: 93.94 },
      { lat: 24.821, lng: 93.941 },
      { lat: 24.822, lng: 93.942 },
      { lat: 24.823, lng: 93.943 },
      { lat: 24.824, lng: 93.944 },
      { lat: 24.8235, lng: 93.945 },
      { lat: 24.8225, lng: 93.9445 },
      { lat: 24.8215, lng: 93.9435 },
      { lat: 24.8205, lng: 93.9425 },
    ],
  },
];

const cartStates = {};
let simulationInterval = null;

function addRandomVariation(lat, lng, variation = 0.0003) {
  return {
    lat: lat + (Math.random() - 0.5) * variation,
    lng: lng + (Math.random() - 0.5) * variation,
  };
}

function getRandomAccuracy() {
  return Math.floor(Math.random() * 20) + 5;
}

async function loginCart(cartId, password) {
  const res = await axios.post(`${API_URL}/api/auth/cart/login`, {
    cartId,
    password,
  });
  console.log(`✅ ${cartId} logged in`);
  return res.data.token;
}

async function updateLocation(cartId, token, latitude, longitude) {
  await axios.post(
    `${API_URL}/api/location/update`,
    {
      latitude,
      longitude,
      accuracy: getRandomAccuracy(),
    },
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );

  console.log(
    `📍 ${cartId}: (${latitude.toFixed(6)}, ${longitude.toFixed(6)})`
  );
}

async function initializeCart(cart) {
  const token = await loginCart(cart.cartId, cart.password);

  cartStates[cart.cartId] = {
    token,
    route: cart.route,
    index: 0,
  };

  const startPos = cart.route[0];
  const v = addRandomVariation(startPos.lat, startPos.lng);
  await updateLocation(cart.cartId, token, v.lat, v.lng);
}

async function moveCart(cartId) {
  const state = cartStates[cartId];
  if (!state) return;

  state.index = (state.index + 1) % state.route.length;
  const pos = state.route[state.index];
  const v = addRandomVariation(pos.lat, pos.lng);

  await updateLocation(cartId, state.token, v.lat, v.lng);
}

async function startSimulation() {
  if (simulationInterval) {
    console.log("⚠️ Simulation already running");
    return;
  }

  console.log("🧪 Starting Manipur location simulation...");

  for (const cart of CARTS) {
    await initializeCart(cart);
  }

  simulationInterval = setInterval(async () => {
    for (const cartId of Object.keys(cartStates)) {
      await moveCart(cartId);
    }
  }, UPDATE_INTERVAL);
}

function stopSimulation() {
  if (simulationInterval) {
    clearInterval(simulationInterval);
    simulationInterval = null;
    console.log("⏹️ Location simulation stopped");
  }
}

module.exports = {
  startSimulation,
  stopSimulation,
};
