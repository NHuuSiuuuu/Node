// Nhận request từ người dùng, xử lý logic, rồi quyết định render ra trang nào / trả dữ liệu nào.
const ProductCategory = require("../../models/product-category.model");
const Product = require("../../models/product.model");
const productsHelper = require("../../helpers/products");

module.exports.home = async (req, res) => {
  // Lấy ra sản phẩm nổi bật
  const productsFeatured = await Product.find({
    featured: "1",
    deleted: false,
    status: "active",
  }).limit(10); // láy ra bao nhiểu sản phẩm nổi bật thì set limit
  const newProducts = productsHelper.priceNewProducts(productsFeatured);

  res.render("client/pages/home/index", {
    pageTitle: "Trang chủ",
    productsFeatured: newProducts,
  });
};
