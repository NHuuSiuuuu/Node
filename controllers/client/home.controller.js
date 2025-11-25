// Nhận request từ người dùng, xử lý logic, rồi quyết định render ra trang nào / trả dữ liệu nào.
const ProductCategory = require("../../models/product-category.model");

module.exports.home = async (req, res) => {
  
  res.render("client/pages/home/index", {
    pageTitle: "Trang chủ",
  });
};
