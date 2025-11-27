const Cart = require("../../models/cart.model");
const Product = require("../../models/product.model");
const productsHelper = require("../../helpers/products");

module.exports.index = async (req, res) => {
  const cartId = req.cookies.cartId;

  const cart = await Cart.findOne({
    _id: cartId,
  });

  // cart trả về 1 mảng
  if (cart.products.length > 0) {
    for (const item of cart.products) {
      const productInfo = await Product.findOne({
        _id: item.product_id,
      }).select("title thumbnail slug price discountPercentage");

      productInfo.priceNew = productsHelper.priceNewProduct(productInfo);

      item.productInfo = productInfo;

      item.toltalPrice = productInfo.priceNew * item.quantity;
    }
  }
  // Tổng giá tất cả sản phẩm trong giỏ hàng
  cart.toltalPrice = cart.products.reduce(
    (arr, curr) => arr + curr.quantity * curr.productInfo.priceNew,
    0
  );

  console.log(cart);

  res.render("client/pages/cart/index", {
    pageTitle: "Giỏ hàng",
    cartDetail: cart,
  });
};

module.exports.addPost = async (req, res) => {
  const productId = req.params.productId;
  const quantity = parseInt(req.body.quantity);
  const cartId = req.cookies.cartId;

  //   console.log(productId);
  //   console.log(quantity);
  //   console.log(cartId);

  //   Lấy ra giỏ hàng
  const cart = await Cart.findOne({
    _id: cartId,
  });
  //   console.log(cart.products);
  //   Check xem sản phẩm này đã có trong giỏ hàng chưa. Nếu có rồi thì chỉ tăng số lượng thôi
  const existProductInCart = cart.products.find(
    (item) => item.product_id == productId
  ); // hàm find này là của js
  // console.log("existProductInCart", existProductInCart);

  if (existProductInCart) {
    // Cập nhật lại
    const quantityNew = quantity + existProductInCart.quantity;
    console.log(quantityNew);

    await Cart.updateOne(
      {
        _id: cartId, // truyền vào id giỏ hàng
        "products.product_id": productId,
      },
      {
        $set: {
          "products.$.quantity": quantityNew,
        },
      }
    );
    req.flash("success", "Đã thêm sản phẩm vào giỏ hàng!");
    res.redirect(req.get("Referer"));
  } else {
    // Chưa có
    const objectCart = {
      product_id: productId,
      quantity: quantity,
    };

    await Cart.updateOne(
      {
        _id: cartId,
      },
      {
        $push: { products: objectCart },
      }
    );

    req.flash("success", "Đã thêm sản phẩm vào giỏ hàng!");
    res.redirect(req.get("Referer"));
  }
};
