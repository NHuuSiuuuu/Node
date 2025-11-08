// import mongoose
const mongoose = require("mongoose");

// Định nghĩa hàm tên connect

module.exports.connect = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log("Thành công!")
  } catch (error) {
    console.log(error)
  }
};
