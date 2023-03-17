const mongoose = require("mongoose");

module.exports.connect = async () => {
  try {
    // console.log('process.env.MONDO_DB_URI',process.env.MONDO_DB_URI)
    await mongoose.connect(process.env.MONDO_DB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("connected to DB");
  } catch (error) {
    console.log("connectDB error",error);
  }
};
