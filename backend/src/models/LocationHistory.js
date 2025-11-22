const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/database");

const LocationHistory = sequelize.define(
  "LocationHistory",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    cartId: {
      type: DataTypes.STRING,
      allowNull: false,
      field: "cart_id",
    },
    latitude: {
      type: DataTypes.DOUBLE,
      allowNull: false,
    },
    longitude: {
      type: DataTypes.DOUBLE,
      allowNull: false,
    },
    accuracy: {
      type: DataTypes.DOUBLE,
    },
    timestamp: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    tableName: "location_history",
    timestamps: false,
    indexes: [
      {
        fields: ["cart_id", "timestamp"],
      },
    ],
  }
);

// Virtual field for location object
LocationHistory.prototype.toJSON = function () {
  const values = { ...this.get() };

  values.location = {
    latitude: values.latitude,
    longitude: values.longitude,
    accuracy: values.accuracy,
  };

  delete values.latitude;
  delete values.longitude;
  delete values.accuracy;

  return values;
};

module.exports = LocationHistory;
