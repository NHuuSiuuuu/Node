// Nhận request từ người dùng, xử lý logic, rồi quyết định render ra trang nào / trả dữ liệu nào.

const Product = require("../../models/product.model");

module.exports.product = async (req, res) => {
  // Đoạn này lấy ra database
  const products = await Product.find({
    status: "active",
    deleted: "false"
  });

  const newProducts = products.map(item => {
    item.priceNew = (item.price*(100 - item.discountPercentage)/100).toFixed(0)
    return item;
  })

  res.render("client/pages/products/index", {
    pageTitle: "Danh sách sản phẩm fff",
    products: newProducts // gửi dữ liệu qua client/pages/products/index
  });
};
