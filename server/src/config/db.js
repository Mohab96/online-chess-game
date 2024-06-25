const { Sequelize } = require("sequelize");

const db_connection = new Sequelize(process.env.DATABASE_URL, {
  dialect: "postgres",
  logging: false,
});

module.exports = { db_connection };
