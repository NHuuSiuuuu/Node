// Nhận request từ người dùng, xử lý logic, rồi quyết định render ra trang nào / trả dữ liệu nào.
const ProductCategory = require("../../models/product-category.model");

const Product = require("../../models/product.model");
const productsHelper = require("../../helpers/products");
const productsCategoryHelper = require("../../helpers/products-category");

module.exports.product = async (req, res) => {
  // Đoạn này lấy ra database
  const products = await Product.find({
    status: "active",
    deleted: "false",
  });

  const newProducts = products.map((item) => {
    item.priceNew = (
      (item.price * (100 - item.discountPercentage)) /
      100
    ).toFixed(0);
    return item;
  });

  res.render("client/pages/products/index", {
    pageTitle: "Danh sách sản phẩm fff",
    products: newProducts, // gửi dữ liệu qua client/pages/products/index
  });
};

module.exports.detail = async (req, res) => {
  try {
    const find = {
      slug: req.params.slugProduct, 
      deleted: false,   
    };

    const product = await Product.findOne(find);
    // console.log(product);
    res.render("client/pages/products/detail.pug", {
      pageTitle: product.title,
      product: product,
    });
  } catch (error) {
    res.redirect(`/products`);
  }
};

module.exports.category = async (req, res) => {
  // console.log(req.params.slugCategory);

  const category = await ProductCategory.findOne({
    slug: req.params.slugCategory,
    deleted: false,
  });
  // console.log(category.id);

  // const getSubCategory = async (parentId) => {
  //   const subs = await ProductCategory.find({
  //     parent_id: parentId,
  //     status: "active",
  //     deleted: false,
  //   });

  //   // console.log(subs)

  //   // Mảng để chứa các phần tử cũ của subs
  //   let allSub = [...subs];

  //   // Lặp qua từng phần tử trong mảng sub để lấy ra những thằng con
  //   for (const sub of subs) {
  //     const childs = await getSubCategory(sub.id); // đệ quy gọi lại hàm
  //     allSub = allSub.concat(childs);
  //   }

  //   return allSub;
  // };

  // Thằng này trả về dạng mảng
  // const listSubCategory = await getSubCategory(category.id);



  const listSubCategory = await productsCategoryHelper.getSubCategory(category.id);
  const listSubCategoryId = listSubCategory.map(item => item.id)
  // console.log(listSubCategoryId)

  // Tìm ra những sản phẩm cùng id danh mục
  const products = await Product.find({
    // Lấy ra những sản phẩm thuộc 1 trong 2 danh mục này (in - tức là bên trong)
    category_id: { $in: [category.id, ...listSubCategoryId] }, // cú pháp spread trải ra, lấy ra các phần tử trong mảng
    deleted: false,
    status: "active",
  }).sort({ position: "desc" });
  // console.log(products);

  const newProducts = productsHelper.priceNewProducts(products);

  res.render("client/pages/products/index", {
    pageTitle: `${category.title}`,
    products: newProducts,
  });
};
