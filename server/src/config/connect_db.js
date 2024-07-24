const prisma = require("./prismaClient");

const connect_database = async () => {
  try {
    await prisma.$connect();
    console.log("Database connected successfully");
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
};

module.exports = connect_database;
