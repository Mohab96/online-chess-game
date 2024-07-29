const swaggerJsdoc = require("swagger-jsdoc");
const path = require("path");
const fs = require("fs");

const loadDocsFromFile = (filePath) => {
  return JSON.parse(
    fs.readFileSync(path.resolve(__dirname, filePath), "utf-8")
  );
};

const swaggerDefinition = {
  openapi: "3.0.0",
  info: {
    title: "Online Chess Game API",
    version: "1.0.0",
    description:
      "The Online Chess Game API allows players to join chess games, make moves, invite other players to join games, and manage their ongoing matches. The API supports real-time interactions through WebSockets for instant game updates and HTTP endpoints for managing game states. Players can authenticate, manage their profiles, and track their game progress through this API.",
  },
  servers: [
    {
      url: "http://localhost:3000/api",
      description: "Development server",
    },
  ],
};

const options = {
  swaggerDefinition,
  apis: [],
};

const swaggerSpec = swaggerJsdoc(options);

const docs = loadDocsFromFile("./api-docs.json");
swaggerSpec.paths = docs.paths;
swaggerSpec.components = docs.components;

module.exports = swaggerSpec;
