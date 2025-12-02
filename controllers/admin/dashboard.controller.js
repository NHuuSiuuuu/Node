// Nhận request từ người dùng, xử lý logic, rồi quyết định render ra trang nào / trả dữ liệu nào.
//  [GET] /admin/dashboard
const ProductCategory = require("../../models/product-category.model");

module.exports.dashboard = async (req, res) => {
  // Thông kê
  const statistic = {
    categoryProduct: {
      total: 0,
      active: 0,
      inactive: 0,
    },
    product: {
      total: 0,
      active: 0,
      inactive: 0,
    },
    account: {
      total: 0,
      active: 0,
      inactive: 0,
    },
    user: {
      total: 0,
      active: 0,
      inactive: 0,
    },
  };

  statistic.categoryProduct.total = await ProductCategory.countDocuments({
    deleted: false,
  });

  statistic.categoryProduct.active = await ProductCategory.countDocuments({
    status: "active",
    deleted: false,
  });

  statistic.categoryProduct.inactive = await ProductCategory.countDocuments({
    status: "inactive",
    deleted: false,
  });

  
  res.render("admin/pages/dashboard/dashboard.pug", {
    pageTitle: "Trang chủ",
    statistic: statistic,
  });
};
