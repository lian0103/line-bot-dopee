const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const msgBrocast = new Schema(
  {
    msg: {
      type: String,
      required: true,
    },
    img: {
      type: String,
      required: false,
    },
    updated: { type: Date, default: Date.now },
  },
  {
    writeConcern: {
      w: "majority",
      j: true,
      wtimeout: 1000,
    },
  }
);

const msgBrocastModel = mongoose.model("msgBrocast", msgBrocast);

module.exports = msgBrocastModel;
