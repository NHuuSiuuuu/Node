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
    limitItem: 3,
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
  res.render("admin/pages/products-category/index.pug", {
    pageTitle: "ADMIN Danh mục sản phẩm",
    records: records,
    filterStatus: filterStatus,
    keyword: objectSearch.keyword,
    pagination:objectPagination
  });
};

// [PATH] Thay đổi trạng thái danh mục 
module.exports.changeStatus = async (req, res)=> {
  console.log(req.params)
  const status = req.params.status
  const id = req.params.id

  await ProductCategory.updateOne({_id: id}, {status: status})

  // res.send(`${status} - ${id}`)
  // req.get('Referer') : Lấy URL của trang trước (trình duyệt tự gửi)
 res.redirect(req.get('Referer') || '/admin/products');
}

// [GET] admin/products-category/create
module.exports.create = async (req, res) => {
  res.render("admin/pages/products-category/create", {
    pageTitle: "ADMIN tạo danh mục sản phẩm",
  });
};

// [POST] admin/products-category/create
module.exports.createPost = async (req, res) => {
  // console.log(req.file)

  // convert những thằng này về int

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
