
module.exports = {
  swaggerDefinition: {
    info: {
      version: "1.0.0",
      title: "API Doc",
      description: "line-bot push & reply meg",
      contact: {
        name: "dopee",
      },
      servers: [process.env.DOMAIN_URL],
    },
  },
  apis: ["./routes/msgRoute.js"],
};
