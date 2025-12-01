const Cart = require("../../models/cart.model");
const Order = require("../../models/order.model");
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

  // console.log("Giỏ hàng:", cart);

  res.render("client/pages/checkout/index", {
    pageTitle: "Đặt hàng",
    cartDetail: cart,
  });
};

// Checkout: Lấy ra các trường giống trong model và lưu trong database
module.exports.order = async (req, res) => {
  const cartId = req.cookies.cartId;
  const userInfo = req.body;

  const cart = await Cart.findOne({
    _id: cartId,
  });

  const products = [];

  for (const product of cart.products) {
    const objectProduct = {
      product_id: product.product_id,
      price: 0,
      discountPercentage: 0,
      quantity: product.quantity,
    };
    const productInfo = await Product.findOne({
      _id: product.product_id,
    }).select("price discountPercentage");

    objectProduct.price = productInfo.price;
    objectProduct.discountPercentage = productInfo.discountPercentage;

    products.push(objectProduct);
  }

  //   console.log(cartId);
  //   console.log(userInfo);
  //   console.log(products);
  const orderInfo = {
    cart_id: cartId,
    userInfo: userInfo,
    products: products,
  };
  const order = new Order(orderInfo);
  order.save();

  //   Cập nhật lại giỏ hàng
  await Cart.updateOne(
    {
      _id: cartId,
    },
    {
      products: [],
    }
  );

  res.redirect(`/checkout/success/${order.id}`);
};

module.exports.success = async (req, res) => {
  const order = await Order.findOne({
    _id: req.params.orderId,
  });

  for (const product of order.products) {
    const productInfo = await Product.findOne({
      _id: product.product_id,
    }).select("title thumbnail");

    product.productInfo = productInfo;

    product.priceNew = productsHelper.priceNewProduct(product);

    product.totalPrice = product.priceNew * product.quantity;
  }

  order.totalPrice = order.products.reduce(
    (arr, curr) => arr + curr.totalPrice,
    0
  );

  res.render("client/pages/checkout/success", {
    pageTitle: "Đặt hàng thành công",
    order: order,
  });
};
