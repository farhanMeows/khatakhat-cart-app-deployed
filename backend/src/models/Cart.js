const { DataTypes } = require("sequelize");
const bcrypt = require("bcryptjs");
const { sequelize } = require("../config/database");

const Cart = sequelize.define(
  "Cart",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    cartId: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      field: "cart_id",
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING,
      defaultValue: "",
    },
    description: {
      type: DataTypes.TEXT,
      defaultValue: "",
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
      field: "is_active",
    },
    isOnline: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      field: "is_online",
    },
    lastLocationLatitude: {
      type: DataTypes.DOUBLE,
      field: "last_location_latitude",
    },
    lastLocationLongitude: {
      type: DataTypes.DOUBLE,
      field: "last_location_longitude",
    },
    lastLocationAccuracy: {
      type: DataTypes.DOUBLE,
      field: "last_location_accuracy",
    },
    lastLocationTimestamp: {
      type: DataTypes.DATE,
      field: "last_location_timestamp",
    },
    lastSeen: {
      type: DataTypes.DATE,
      field: "last_seen",
    },
  },
  {
    tableName: "carts",
    timestamps: true,
    underscored: true,
    hooks: {
      beforeCreate: async (cart) => {
        if (cart.password) {
          const salt = await bcrypt.genSalt(10);
          cart.password = await bcrypt.hash(cart.password, salt);
        }
      },
      beforeUpdate: async (cart) => {
        if (cart.changed("password")) {
          const salt = await bcrypt.genSalt(10);
          cart.password = await bcrypt.hash(cart.password, salt);
        }
      },
    },
  }
);

// Instance method to compare passwords
Cart.prototype.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Virtual field for lastLocation object
Cart.prototype.toJSON = function () {
  const values = { ...this.get() };

  // Create lastLocation object if coordinates exist
  if (
    values.lastLocationLatitude !== null &&
    values.lastLocationLongitude !== null
  ) {
    values.lastLocation = {
      latitude: values.lastLocationLatitude,
      longitude: values.lastLocationLongitude,
      accuracy: values.lastLocationAccuracy,
      timestamp: values.lastLocationTimestamp,
    };
  } else {
    values.lastLocation = null;
  }

  // Remove individual location fields
  delete values.lastLocationLatitude;
  delete values.lastLocationLongitude;
  delete values.lastLocationAccuracy;
  delete values.lastLocationTimestamp;

  // Remove password from JSON output
  delete values.password;

  return values;
};

module.exports = Cart;
