const ProductCategory = require("../../models/product-category.model");
const systemConfig = require("../../config/system");

// [GET] /admin/products-category
module.exports.index = async (req, res) => {
  let filterStatus = [
    {
      name: "Tất cả",
      status: "",
      class: "",
    },
    {
      name: "Đang hoạt động",
      status: "active",
      class: "",
    },
    {
      name: "Dừng hoạt động",
      status: "inactive",
      class: "",
    },
  ];
  let find = {
    deleted: false,
  };

  let count = 0;
  function createTree(arr, parentId = "") {
    const tree = [];
    arr.forEach((item) => {
      if (item.parent_id === parentId) {
        count++;
        const newItem = item;
        newItem.index = count;
        const children = createTree(arr, item.id);
        if (children.length > 0) {
          newItem.children = children;
        }
        tree.push(newItem);
      }
    });
    return tree;
  }

  // Nếu có status trên URL
  if (req.query.status) {
    find.status = req.query.status;
  }

  // Lấy ra index đang được active
  if (req.query.status) {
    const index = filterStatus.findIndex(
      (item) => item.status == req.query.status
    );
    filterStatus[index].class = "active";
  } else {
    filterStatus[0].class = "active";
  }

  // Chức năng tìm kiếm bằng keyword
  let objectSearch = {
    keyword: "",
  };

  if (req.query.keyword) {
    objectSearch.keyword = req.query.keyword.trim();
    const regex = new RegExp(objectSearch.keyword, "i");
    objectSearch.regex = regex;
    find.title = objectSearch.regex;
  }
  // [END] Chức năng tìm kiếm bằng keyword

  // Chức năng phân trang: Lấy ra skip, limit để lọc
  objectPagination = {
    currentPage: 1,
    limitItem: 20,
  };
  if (req.query.page) {
    objectPagination.currentPage = parseInt(req.query.page);

    objectPagination.skip =
      (objectPagination.currentPage - 1) * objectPagination.limitItem;
    // Tổng số danh mục thỏa mãn
    const countProducts = await ProductCategory.countDocuments(find);
    // Tổng số trang
    const totalPage = Math.ceil(countProducts / objectPagination.limitItem);
    objectPagination.totalPage = totalPage;
  }
  // [END] Chức năng phân trang: Lấy ra skip, limit để lọc

  const records = await ProductCategory.find(find)
    .skip(objectPagination.skip)
    .limit(objectPagination.limitItem);

  const newRecords = createTree(records);

  res.render("admin/pages/products-category/index.pug", {
    pageTitle: "ADMIN Danh mục sản phẩm",
    records: newRecords,
    filterStatus: filterStatus,
    keyword: objectSearch.keyword,
    pagination: objectPagination,
  });
};

// [PATH] Thay đổi trạng thái danh mục
module.exports.changeStatus = async (req, res) => {
  console.log(req.params);
  const status = req.params.status;
  const id = req.params.id;

  await ProductCategory.updateOne({ _id: id }, { status: status });
  res.redirect(req.get("Referer") || "/admin/products");
};

// [GET] admin/products-category/create
module.exports.create = async (req, res) => {
  let find = {
    deleted: false,
  };

  function createTree(arr, parentId = "") {
    const tree = []; // Mảng chứa các node của level hiẹn tại
    arr.forEach((item) => {
      // Duyệt qua toàn bộ danh sách category danh mục sản phẩm
      if (item.parent_id === parentId) {
        // Tìm những record có parent_id = "" - tức là những thằng cấp cao nhất
        const newItem = item;
        const children = createTree(arr, item.id); // Gọi đệ quy để tìm các danh mục có parent_id = item.id (tức là tmf con của nó)
        if (children.length > 0) {
          // Nếu có con
          newItem.children = children; // gán mảng con vào thuộc tính children
        }
        tree.push(newItem); // Thêm node (kèm children nếu có) vào mảng có kết quả
      }
    });
    return tree; // Trả về cây phân cấp cho level hiện tại
  }

  const records = await ProductCategory.find(find);
  const newRecords = createTree(records);
  console.log("records", records);
  console.log("newRecords", newRecords);

  res.render("admin/pages/products-category/create", {
    pageTitle: "ADMIN tạo danh mục sản phẩm",
    records: newRecords,
  });
};

// [POST] admin/products-category/create
module.exports.createPost = async (req, res) => {
  // console.log(req.file)
  // Tự động tăng position khi tạo mới sản phẩm
  if (req.body.position == "") {
    const countProducts = await ProductCategory.estimatedDocumentCount();
    req.body.position = countProducts + 1;
    console.log("Tổng sản phẩm", countProducts);
  } else {
    req.body.position = parseInt(req.body.position);
  }

  // Tạo mới lưu vào database
  const record = new ProductCategory(req.body);
  await record.save();

  // console.log(req.body);
  res.redirect(`${systemConfig.prefixAdmin}/products-category`);
};

// Chi tiết sản phẩm
module.exports.detail = async (req, res) => {
  try {
    const find = {
      deleted: false, // tìm sp chưa bị xóa
      _id: req.params.id, // tìm theo id
    };

    const records = await ProductCategory.findOne(find);
    res.render("admin/pages/products-category/detail.pug", {
      pageTitle: records.title,
      category: records,
    });
  } catch (error) {
    res.redirect(`${systemConfig.prefixAdmin}/products-category`);
  }
};

// Sửa danh mục sản phẩm
module.exports.edit = async (req, res) => {
  try {
    const id = req.params.id;
    const find = {
      deleted: false,
      _id: id,
    };
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
    const records = await ProductCategory.find({ deleted: false });
    // console.log(records);
    const newRecords = createTree(records);

    const data = await ProductCategory.findOne(find);
    res.render("admin/pages/products-category/edit", {
      pageTitle: "Chỉnh sửa danh mục sản phẩm",
      category: data,
      records: newRecords,
    });
  } catch (error) {
    res.redirect(`${systemConfig.prefixAdmin}/products-category`);
  }
};
// [PATCH] Chỉnh sửa danh mục sản phẩm /admin/products-category/edit/:id
module.exports.editPatch = async (req, res) => {
  const id = req.params.id;
  req.body.position = parseInt(req.body.position);

  // update lại ảnh nếu có ảnh mới
  if (req.file) {
    req.body.thumbnail = `/uploads/${req.file.filename}`;
  }

  try {
    await ProductCategory.updateOne({ _id: id }, req.body);
    req.flash("success", `Cập nhật thành cônng`);
  } catch (error) {
    req.flash("success", `Cập nhật thất bại`);
    res.redirect(`${systemConfig.prefixAdmin}/products-category`);
  }

  res.redirect(`${systemConfig.prefixAdmin}/products-category`);
};
