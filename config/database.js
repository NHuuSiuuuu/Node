// import mongoose
const mongoose = require("mongoose");

// Định nghĩa hàm tên connect

module.exports.connect = async () => {
  try {
    // MONGO_URL = mongodb://127.0.0.1:27017/demoproducts
    await mongoose.connect(process.env.MONGO_URL);
    console.log("Thành công!")
  } catch (error) {
    console.log(error)
  }
};
