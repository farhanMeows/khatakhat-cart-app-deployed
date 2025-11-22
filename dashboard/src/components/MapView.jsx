import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, Tooltip } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Fix for default marker icons in react-leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

// Custom marker icons
const onlineIcon = new L.Icon({
  iconUrl:
    "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

const offlineIcon = new L.Icon({
  iconUrl:
    "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-grey.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

const MapView = ({ carts, selectedCart }) => {
  const [center, setCenter] = useState([28.6139, 77.209]); // Default: Delhi
  const [zoom, setZoom] = useState(12);

  useEffect(() => {
    // If a cart is selected and has location, center on it
    if (selectedCart && selectedCart.lastLocation?.latitude) {
      setCenter([
        selectedCart.lastLocation.latitude,
        selectedCart.lastLocation.longitude,
      ]);
      setZoom(15);
    } else if (carts.length > 0) {
      // Center on first cart with location
      const cartWithLocation = carts.find((c) => c.lastLocation?.latitude);
      if (cartWithLocation) {
        setCenter([
          cartWithLocation.lastLocation.latitude,
          cartWithLocation.lastLocation.longitude,
        ]);
      }
    }
  }, [selectedCart, carts]);

  const getCartsWithLocation = () => {
    return carts.filter(
      (cart) => cart.lastLocation?.latitude && cart.lastLocation?.longitude
    );
  };

  const formatDate = (date) => {
    if (!date) return "Never";
    return new Date(date).toLocaleString();
  };

  return (
    <MapContainer
      center={center}
      zoom={zoom}
      style={{ width: "100%", height: "100%" }}
      key={`${center[0]}-${center[1]}-${zoom}`}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {getCartsWithLocation().map((cart) => (
        <Marker
          key={cart.cartId}
          position={[cart.lastLocation.latitude, cart.lastLocation.longitude]}
          icon={cart.isOnline ? onlineIcon : offlineIcon}
        >
          <Tooltip permanent direction="top" offset={[0, -35]}>
            <div style={{ textAlign: "center", fontWeight: "bold" }}>
              {cart.name || cart.cartId}
              <br />
              <span
                style={{
                  fontSize: "10px",
                  fontWeight: "normal",
                  color: "#555",
                }}
              >
                ID: {cart.cartId}
              </span>
              <br />
              <span
                style={{
                  fontSize: "11px",
                  fontWeight: "normal",
                  color: cart.isOnline ? "#27ae60" : "#95a5a6",
                }}
              >
                {cart.isOnline ? "🟢 Online" : "⚫ Offline"}
              </span>
            </div>
          </Tooltip>
          <Popup>
            <div style={{ minWidth: "200px" }}>
              <h3 style={{ marginBottom: "10px" }}>
                {cart.name || cart.cartId}
              </h3>
              <p style={{ marginBottom: "5px" }}>
                <strong>Cart ID:</strong> {cart.cartId}
              </p>
              <p style={{ marginBottom: "5px" }}>
                <strong>Status:</strong>{" "}
                <span style={{ color: cart.isOnline ? "#27ae60" : "#95a5a6" }}>
                  {cart.isOnline ? "Online" : "Offline"}
                </span>
              </p>
              <p style={{ marginBottom: "5px" }}>
                <strong>Last Seen:</strong> {formatDate(cart.lastSeen)}
              </p>
              {cart.description && (
                <p style={{ marginBottom: "5px" }}>
                  <strong>Description:</strong> {cart.description}
                </p>
              )}
              <p
                style={{ marginBottom: "5px", fontSize: "12px", color: "#666" }}
              >
                <strong>Coordinates:</strong>
                <br />
                {cart.lastLocation.latitude.toFixed(6)},{" "}
                {cart.lastLocation.longitude.toFixed(6)}
              </p>
              {cart.lastLocation.accuracy && (
                <p style={{ fontSize: "12px", color: "#666" }}>
                  <strong>Accuracy:</strong> ±{cart.lastLocation.accuracy}m
                </p>
              )}
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
};

export default MapView;
