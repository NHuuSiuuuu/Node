const mongoose = require("mongoose");

// Schema: Định nghĩa cấi trúc dữ liệu sản phẩm, định nghĩa sản phẩm có trường gì
// Schema giúp Mongoose kiểm soát dữ liệu trước khi lưu vào database
const productSchema = new mongoose.Schema({
  title: String,
  description: String,
  price: Number,
  discountPercentage: Number,
  stock: Number,
  thumbnail: String,
  status: String,
  position: Number,
  deleted: Boolean,
});

// Tạo medel từ schema giúp thêm sửa xóa lấy sản phẩm bà không cầ viết lệnh trực tiếp trong MonggoDB
const Product = mongoose.model("Product", productSchema, "demoproducts"); // Đối số thứ 3 là bảng colection

module.exports = Product;
