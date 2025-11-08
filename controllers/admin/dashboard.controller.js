// Nhận request từ người dùng, xử lý logic, rồi quyết định render ra trang nào / trả dữ liệu nào.

module.exports.dashboard = (req, res) => {
  res.render("admin/pages/dashboard/dashboard.pug")
};
