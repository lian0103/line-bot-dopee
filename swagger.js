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
    definitions: {
      Account: {
        type: "object",
        properties: {
          name: {
            type: "string",
            description:"帳號"
          },
          psw: {
            type: "string",
            description:"密碼"
          },
        },
      },
    },
  },
  apis: ["./routes/*.js"],
};
