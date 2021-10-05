const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const linebotRecord = new Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    msg: {
      type: String,
      required: true,
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

const linebotRecordModel = mongoose.model("linebotRecord", linebotRecord);

module.exports = linebotRecordModel;