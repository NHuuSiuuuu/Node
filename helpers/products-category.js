const ProductCategory = require("../models/product-category.model");

module.exports.getSubCategory = async(parentId) => {
  const getCategory = async (parentId) => {
    const subs = await ProductCategory.find({
      parent_id: parentId,
      status: "active",
      deleted: false,
    });

    // console.log(subs)

    // Mảng để chứa các phần tử cũ của subs
    let allSub = [...subs];

    // Lặp qua từng phần tử trong mảng sub để lấy ra những thằng con
    for (const sub of subs) {
      const childs = await getCategory(sub.id); // đệ quy gọi lại hàm
      allSub = allSub.concat(childs);
    }

    return allSub;
  };
  const result = await getCategory(parentId)
  return result
};
