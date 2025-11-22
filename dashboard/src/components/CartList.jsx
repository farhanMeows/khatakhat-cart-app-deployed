import React from "react";
import { formatDistanceToNow } from "date-fns";

const CartList = ({
  carts,
  selectedCart,
  onSelectCart,
  onCreateCart,
  onEditCart,
  onDeleteCart,
}) => {
  const formatLastSeen = (date) => {
    if (!date) return "Never";
    try {
      return formatDistanceToNow(new Date(date), { addSuffix: true });
    } catch {
      return "Unknown";
    }
  };

  const onlineCarts = carts.filter((cart) => cart.isOnline);
  const offlineCarts = carts.filter((cart) => !cart.isOnline);

  return (
    <div>
      <div style={{ marginBottom: "20px" }}>
        <p style={{ fontSize: "14px", color: "#95a5a6" }}>
          {carts.length} total carts • {onlineCarts.length} online •{" "}
          {offlineCarts.length} offline
        </p>
      </div>

      {carts.length === 0 ? (
        <div className="empty-state">
          <h3>No Carts Yet</h3>
          <p>Create your first cart to start tracking</p>
        </div>
      ) : (
        <div className="cart-list">
          {carts.map((cart) => (
            <div
              key={cart.cartId}
              className={`cart-item ${
                selectedCart?.cartId === cart.cartId ? "selected" : ""
              }`}
              onClick={() => onSelectCart(cart)}
            >
              <div className="cart-item-header">
                <h3>{cart.name || cart.cartId}</h3>
                <div className="cart-status">
                  <span
                    className={`cart-status-dot ${
                      cart.isOnline ? "online" : "offline"
                    }`}
                  ></span>
                  <span>{cart.isOnline ? "Online" : "Offline"}</span>
                </div>
              </div>

              <div className="cart-item-info">
                <p>ID: {cart.cartId}</p>
                {cart.description && <p>{cart.description}</p>}
                <p>Last seen: {formatLastSeen(cart.lastSeen)}</p>
                {cart.lastLocation?.latitude && (
                  <p style={{ fontSize: "11px", opacity: 0.8 }}>
                    📍 {cart.lastLocation.latitude.toFixed(4)},{" "}
                    {cart.lastLocation.longitude.toFixed(4)}
                  </p>
                )}
              </div>

              <div
                className="cart-item-actions"
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  className="btn-small btn-edit"
                  onClick={() => onEditCart(cart)}
                >
                  Edit
                </button>
                <button
                  className="btn-small btn-delete"
                  onClick={() => onDeleteCart(cart)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CartList;
