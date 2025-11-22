#!/usr/bin/env node

/**
 * Test cart login with various passwords
 */

const axios = require("axios");

const API_URL = "http://localhost:5001";
const CART_ID = process.argv[2] || "cart001";
const PASSWORD = process.argv[3];

if (!PASSWORD) {
  console.log("Usage: node test-cart-login.js <cartId> <password>");
  console.log("Example: node test-cart-login.js cart001 mypassword");
  process.exit(1);
}

async function testLogin() {
  try {
    console.log(`Testing login for ${CART_ID}...`);

    const response = await axios.post(`${API_URL}/api/auth/cart/login`, {
      cartId: CART_ID,
      password: PASSWORD,
    });

    console.log("✅ Login successful!");
    console.log("Token:", response.data.token.substring(0, 50) + "...");
    console.log("Cart:", response.data.cart);
  } catch (error) {
    console.log("❌ Login failed");
    console.log("Error:", error.response?.data?.error || error.message);
  }
}

testLogin();
