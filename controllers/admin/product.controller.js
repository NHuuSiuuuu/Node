//  [GET] /admin/products

const Product = require("../../models/product.model");
module.exports.product = async (req, res) => {
  let filterStatus = [
    {
      name: "Tất cả",
      status: "",
      class: "",
    },
    {
      name: "Hoạt động",
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
  // Thêm key status vào obj find - thằng này có 3 trạng thái: active, inactive, ...
  // Kiểm tra xem có không đã
  if (req.query.status) {
    find.status = req.query.status;
  }
  // console.log('Param',req.query.status)

  if (req.query.status) {
    // Lấy ra index đagn được active
   const index = filterStatus.findIndex( item => item.status == req.query.status)
   filterStatus[index].class = "active"
   console.log(index)
  }else {
   const index = filterStatus.findIndex( item => item.status == "")
   filterStatus[index].class = "active"

  }

  const products = await Product.find(find);

  res.render(
    "admin/pages/products/index.pug", // epress tự hiểu đường dẫn tương đối so với thư mục view
    {
      pageTitle: "ADMIN Danh sách sản phẩm",
      products: products,
      filterStatus: filterStatus
    }
  );
};
