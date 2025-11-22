import React, { useState, useEffect } from "react";

const CartModal = ({ cart, onSave, onClose }) => {
  const [formData, setFormData] = useState({
    cartId: "",
    password: "",
    name: "",
    description: "",
    isActive: true,
  });

  useEffect(() => {
    if (cart) {
      setFormData({
        cartId: cart.cartId || "",
        password: "", // Don't show existing password
        name: cart.name || "",
        description: cart.description || "",
        isActive: cart.isActive !== undefined ? cart.isActive : true,
      });
    }
  }, [cart]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!cart && (!formData.cartId || !formData.password)) {
      alert("Cart ID and password are required for new carts");
      return;
    }

    onSave(formData);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <h2>{cart ? "Edit Cart" : "Create New Cart"}</h2>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Cart ID *</label>
            <input
              type="text"
              name="cartId"
              value={formData.cartId}
              onChange={handleChange}
              placeholder="e.g., cart001"
              disabled={!!cart} // Can't change ID when editing
              required
            />
          </div>

          <div className="form-group">
            <label>Password {!cart && "*"}</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder={
                cart ? "Leave blank to keep current" : "Enter password"
              }
              required={!cart}
            />
          </div>

          <div className="form-group">
            <label>Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="e.g., Main Street Cart"
            />
          </div>

          <div className="form-group">
            <label>Description</label>
            <input
              type="text"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="e.g., Operates in downtown area"
            />
          </div>

          <div className="form-group">
            <label
              style={{ display: "flex", alignItems: "center", gap: "10px" }}
            >
              <input
                type="checkbox"
                name="isActive"
                checked={formData.isActive}
                onChange={handleChange}
                style={{ width: "auto" }}
              />
              Active
            </label>
          </div>

          <div className="modal-actions">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={onClose}
            >
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              {cart ? "Update" : "Create"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CartModal;
