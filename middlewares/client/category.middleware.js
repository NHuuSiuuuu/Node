const ProductCategory = require("../../models/product-category.model");

module.exports.category = async (req, res, next) => {
  function createTree(arr, parentId = "") {
    const tree = [];
    arr.forEach((item) => {
      if (item.parent_id === parentId) {
        const newItem = item;
        const children = createTree(arr, item.id);
        if (children.length > 0) {
          newItem.children = children;
        }
        tree.push(newItem);
      }
    });
    return tree;
  }
  let find = {
    deleted: false,
  };
  const productsCategory = await ProductCategory.find(find);

  const newProductsCategory = createTree(productsCategory);

  res.locals.layoutProductsCategory =newProductsCategory
  next();

//   res.render("client/pages/home/index", {
//     pageTitle: "Trang chủ",
//     layoutProductsCategory: newRecords,
//   });
};
