#!/usr/bin/env python3
"""
CartSync - Manipur Location Simulator (Python Version)

Simulates two carts moving around Imphal, Manipur, India
Cart 001 (veggies): Moves around Ima Keithel Market area
Cart 002 (cloths): Moves around Paona Bazaar area
"""

import requests
import time
import random
import sys
from datetime import datetime

# Configuration
API_URL = "http://localhost:5001"
UPDATE_INTERVAL = 5  # seconds between updates

# Manipur coordinates (Imphal city)
IMPHAL_CENTER = {"lat": 24.8170, "lng": 93.9368}

# Cart credentials and routes
CARTS = [
    {
        "cartId": "cart001",
        "password": "cart001",
        "name": "Veggies Cart",
        # Route: Around Ima Keithel (Women's Market)
        "route": [
            {"lat": 24.8120, "lng": 93.9360},  # Ima Keithel Market
            {"lat": 24.8130, "lng": 93.9370},  # Near Kangla Fort
            {"lat": 24.8140, "lng": 93.9365},  # MG Avenue
            {"lat": 24.8150, "lng": 93.9375},  # Khwairamband Bazaar
            {"lat": 24.8160, "lng": 93.9380},  # Bir Tikendrajit Park
            {"lat": 24.8155, "lng": 93.9390},  # North AOC
            {"lat": 24.8145, "lng": 93.9385},  # Thangal Bazaar
            {"lat": 24.8135, "lng": 93.9375},  # Paona Bazaar
            {"lat": 24.8125, "lng": 93.9365},  # Back to Ima Keithel
        ]
    },
    {
        "cartId": "cart002",
        "password": "cart002",
        "name": "Cloths Cart",
        # Route: Around Paona Bazaar and residential areas
        "route": [
            {"lat": 24.8200, "lng": 93.9400},  # Paona Bazaar
            {"lat": 24.8210, "lng": 93.9410},  # Keishampat
            {"lat": 24.8220, "lng": 93.9420},  # Singjamei
            {"lat": 24.8230, "lng": 93.9430},  # Lamphelpat
            {"lat": 24.8240, "lng": 93.9440},  # Uripok
            {"lat": 24.8235, "lng": 93.9450},  # Sagolband
            {"lat": 24.8225, "lng": 93.9445},  # Thangmeiband
            {"lat": 24.8215, "lng": 93.9435},  # Kwakeithel
            {"lat": 24.8205, "lng": 93.9425},  # Back to Paona
        ]
    }
]

# Store cart states
cart_states = {}


def add_random_variation(lat, lng, variation=0.0003):
    """Add random variation to coordinates for realistic movement"""
    return {
        "lat": lat + (random.random() - 0.5) * variation,
        "lng": lng + (random.random() - 0.5) * variation
    }


def get_random_accuracy():
    """Simulate GPS accuracy in meters"""
    return random.randint(5, 25)


def login_cart(cart_id, password):
    """Login cart and get authentication token"""
    try:
        response = requests.post(
            f"{API_URL}/api/auth/cart/login",
            json={"cartId": cart_id, "password": password}
        )
        response.raise_for_status()
        
        print(f"✅ {cart_id} logged in successfully")
        return response.json()["token"]
    except requests.exceptions.RequestException as e:
        print(f"❌ Failed to login {cart_id}: {e}")
        raise


def update_location(cart_id, token, latitude, longitude, accuracy):
    """Update cart location via API"""
    try:
        response = requests.post(
            f"{API_URL}/api/location/update",
            json={
                "latitude": latitude,
                "longitude": longitude,
                "accuracy": accuracy
            },
            headers={"Authorization": f"Bearer {token}"}
        )
        response.raise_for_status()
        
        current_time = datetime.now().strftime("%H:%M:%S")
        print(f"📍 [{current_time}] {cart_id}: ({latitude:.6f}, {longitude:.6f}) ±{accuracy}m")
    except requests.exceptions.RequestException as e:
        print(f"❌ Failed to update {cart_id}: {e}")


def initialize_cart(cart):
    """Initialize cart with login and first position"""
    try:
        token = login_cart(cart["cartId"], cart["password"])
        
        cart_states[cart["cartId"]] = {
            "token": token,
            "name": cart["name"],
            "route": cart["route"],
            "current_index": 0
        }
        
        # Send initial position
        first_pos = cart["route"][0]
        variation = add_random_variation(first_pos["lat"], first_pos["lng"])
        update_location(
            cart["cartId"],
            token,
            variation["lat"],
            variation["lng"],
            get_random_accuracy()
        )
    except Exception as e:
        print(f"Failed to initialize {cart['cartId']}: {e}")


def move_cart(cart_id):
    """Move cart to next position in route"""
    state = cart_states.get(cart_id)
    if not state:
        return
    
    # Get next position in route (loop back to start)
    state["current_index"] = (state["current_index"] + 1) % len(state["route"])
    next_pos = state["route"][state["current_index"]]
    
    # Add slight random variation for realistic movement
    variation = add_random_variation(next_pos["lat"], next_pos["lng"])
    
    # Update location
    update_location(
        cart_id,
        state["token"],
        variation["lat"],
        variation["lng"],
        get_random_accuracy()
    )


def start_simulation():
    """Main simulation loop"""
    print("🚀 CartSync Manipur Location Simulator")
    print("📍 Simulating cart movement in Imphal, Manipur, India\n")
    
    # Initialize all carts
    print("🔐 Logging in carts...\n")
    for cart in CARTS:
        initialize_cart(cart)
    
    print(f"\n🎯 Starting movement simulation...")
    print(f"📡 Sending updates every {UPDATE_INTERVAL} seconds")
    print("Press Ctrl+C to stop\n")
    
    try:
        # Move carts continuously
        while True:
            for cart_id in cart_states.keys():
                move_cart(cart_id)
            
            time.sleep(UPDATE_INTERVAL)
    
    except KeyboardInterrupt:
        print("\n\n⏹️  Simulation stopped")
        print("📊 Final positions:")
        for cart_id, state in cart_states.items():
            pos = state["route"][state["current_index"]]
            print(f"   {cart_id}: ({pos['lat']:.6f}, {pos['lng']:.6f})")
        sys.exit(0)


if __name__ == "__main__":
    try:
        start_simulation()
    except Exception as e:
        print(f"💥 Simulation failed: {e}")
        sys.exit(1)
