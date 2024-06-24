const { Sequelize } = require("sequelize");

const db_connection = new Sequelize({
  dialect: "postgres",
  username: "postgres",
  database: "chess",
  host: "localhost",
  port: "5432",
  password: "551258",
});

const testConnection = async () => {
  try {
    await db_connection.authenticate();
    console.log("Connection has been established successfully.");
    while (true) console.log("Running");
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
};

module.exports = { db_connection, testConnection };
