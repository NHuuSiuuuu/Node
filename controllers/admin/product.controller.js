//  [GET] /admin/products

const Product = require("../../models/product.model");

// import thằng filterStatus
const filterStatusHelper = require("../../helpers/filterStatus")
const searchHelper = require("../../helpers/search")

module.exports.product = async (req, res) => {

  let find = {
    deleted: false,
    // title:"iPhone 14"
  };

  // Bộ lọc
  const filterStatus = filterStatusHelper(req.query)
  // console.log(filterStatus)

  //1. Thêm key status vào obj find - thằng này có 3 trạng thái: active, inactive, ...
  // Kiểm tra xem có không đã
  if (req.query.status) {
    find.status = req.query.status; // Lấy status trên url
    // console.log('Param',req.query.status)
  }

  //3. Chức năng tìm kiếm key
  const objectSearch = searchHelper(req.query)
  if(objectSearch.keyword){
    find.title = objectSearch.regex
  }

  // 4. Chức năng phân trang
  let objectPagination = {
    currentPage: 1,
    limitItems: 5
  }
  // Tính skip - lấy từ sản phẩm thứ?
  if(req.query.page){
    objectPagination.currentPage = parseInt(req.query.page) //req.query.page là thằng value của page lấy trên url
  }
  objectPagination.skip = (objectPagination.currentPage - 1)*objectPagination.limitItems
  // console.log(objectPagination.skip )

  // Số lượng sản phẩm trong database thỏa mãn điều kiện
  const countProducts = await Product.countDocuments(find)
  // Tổng số trang
  const totalPage = Math.ceil(countProducts / objectPagination.limitItems)
  objectPagination.totalPage = totalPage

  const products = await Product.find(find).limit(objectPagination.limitItems).skip(objectPagination.skip);

  res.render(
    "admin/pages/products/index.pug", // epress tự hiểu đường dẫn tương đối so với thư mục view
    {
      pageTitle: "ADMIN Danh sách sản phẩm",
      products: products,
      filterStatus: filterStatus,

      // objectSearch.keyword → chuỗi người dùng nhập vào, dùng cho giao diện (đúng ✅)
      // objectSearch.regex → biểu thức tìm kiếm (object RegExp), chỉ dùng để query MongoDB, không hiển thị ra ngoài ❌
      keyword: objectSearch.keyword,
      pagination: objectPagination // truyền luôn obj vào để sang bên view kia dùng các gtri: currentPage, limitItem
    }
  );
};

// [PATCH] Chức năng thay đổi trạng thái sản phẩm  /change-status/:status/:id
module.exports.changeStatus = async (req, res) => {
  console.log(req.params)
  const status = req.params.status
  const id = req.params.id

  // Update 1 sản phẩm dunngf updateOne - nhận 2 đối số - đối số đầu là id - đối số 2 là trường muốn thay đổi
  await Product.updateOne({_id: id}, {status: status})

  // res.send(`${status} - ${id}`)
  // res.redirect("/admin/products")
  // chuyển về trang trước đó
  // req.get('Referer') : Lấy URL của trang trước (trình duyệt tự gửi)
 res.redirect(req.get('Referer') || '/admin/products');

}