const swaggerJsDoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Human Resource Management System",
      version: "1.0.0",
      description: "API documentation for the HR Management System",
    },

    servers: [
      {
        url: "http://localhost:5000/api",
      },
    ],

    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },

    security: [
      {
        bearerAuth: [],
      },
    ],

    
  },
  apis: ["./src/modules/**/*.js"],
};

const specs = swaggerJsDoc(options);

module.exports = {
  swaggerUi,
  specs,
};
