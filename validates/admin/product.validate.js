module.exports.createPost = (req, res, next) => {
  if (!req.body.title) {
    req.flash("error", "Vui lòng nhập tiêu đề!");
    res.redirect(req.get("Referer") || "/admin/products");
    return;
  }
  next()

};
// next đi qua bước kế tiếp