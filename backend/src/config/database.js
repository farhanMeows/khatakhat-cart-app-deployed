const { Sequelize } = require("sequelize");

const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: "postgres",
  logging: process.env.NODE_ENV === "development" ? console.log : false,
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
});

const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log("PostgreSQL Connected successfully");

    // Sync database (create tables if they don't exist)
    await sequelize.sync({ alter: process.env.NODE_ENV === "development" });
    console.log("Database synced");

    // Create default admin if not exists
    const Admin = require("../models/Admin");
    const adminExists = await Admin.findOne({
      where: { username: process.env.ADMIN_USERNAME },
    });

    if (!adminExists) {
      await Admin.create({
        username: process.env.ADMIN_USERNAME,
        password: process.env.ADMIN_PASSWORD,
      });
      console.log("Default admin user created");
    }
  } catch (error) {
    console.error("Unable to connect to the database:", error);
    process.exit(1);
  }
};

module.exports = { sequelize, connectDB };
