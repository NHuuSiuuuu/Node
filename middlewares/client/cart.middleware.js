const Cart = require("../../models/cart.model");

module.exports.cartId = async (req, res, next) => {
//   console.log(req.cookies.cartId);

  if (!req.cookies.cartId) {
    // Tạo giỏ hàng
    const cart = new Cart();

    await cart.save();

    console.log(cart);
    res.cookie("cartId", cart.id, {
      expires: new Date(Date.now() + 8 * 3600000), // cookie will be removed after 8 hours
    });
  } else {
    // Lấy ra thôi
  }

  next();
};
