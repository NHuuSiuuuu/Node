//  [GET] /admin/products

const Product = require("../../models/product.model");
const systemConfig = require("../../config/system");

// import thằng filterStatus
const filterStatusHelper = require("../../helpers/filterStatus");
const searchHelper = require("../../helpers/search");

module.exports.product = async (req, res) => {
  let find = {
    deleted: false,
    // title:"iPhone 14"
  };

  // Bộ lọc
  const filterStatus = filterStatusHelper(req.query);
  // console.log(filterStatus)

  //1. Thêm key status vào obj find - thằng này có 3 trạng thái: active, inactive, ...
  // Kiểm tra xem có không đã
  if (req.query.status) {
    find.status = req.query.status; // Lấy status trên url
    // console.log('Param',req.query.status)
  }

  //3. Chức năng tìm kiếm key
  const objectSearch = searchHelper(req.query);
  if (objectSearch.keyword) {
    find.title = objectSearch.regex;
  }

  // 4. Chức năng phân trang
  let objectPagination = {
    currentPage: 1,
    limitItems: 5,
  };
  // Tính skip - lấy từ sản phẩm thứ?
  if (req.query.page) {
    objectPagination.currentPage = parseInt(req.query.page); //req.query.page là thằng value của page lấy trên url
  }
  objectPagination.skip =
    (objectPagination.currentPage - 1) * objectPagination.limitItems;
  // console.log(objectPagination.skip )

  // Số lượng sản phẩm trong database thỏa mãn điều kiện
  const countProducts = await Product.countDocuments(find);
  // Tổng số trang
  const totalPage = Math.ceil(countProducts / objectPagination.limitItems);
  objectPagination.totalPage = totalPage;

  // sort
  let sort = {}
  
  // Lấy sortKey và sortValue trên URL
  if(req.query.sortKey && req.query.sortValue) {
    sort[req.query.sortKey] = req.query.sortValue //sort["price"] = "asc" convert sang obj {price: "asc"} - Đây là cách tạo obj với dynamic key
//     const key = req.query.sortKey;
//     const value = req.query.sortValue;
//     sort[key] = value; 
  }else {
    sort.position = "desc"

  }


  // End sort

  const products = await Product.find(find)
    .sort(sort)
    .limit(objectPagination.limitItems)
    .skip(objectPagination.skip);

  res.render(
    "admin/pages/products/index.pug", // epress tự hiểu đường dẫn tương đối so với thư mục view
    {
      pageTitle: "ADMIN Danh sách sản phẩm",
      products: products,
      filterStatus: filterStatus,

      // objectSearch.keyword → chuỗi người dùng nhập vào, dùng cho giao diện (đúng ✅)
      // objectSearch.regex → biểu thức tìm kiếm (object RegExp), chỉ dùng để query MongoDB, không hiển thị ra ngoài ❌
      keyword: objectSearch.keyword,
      pagination: objectPagination, // truyền luôn obj vào để sang bên view kia dùng các gtri: currentPage, limitItem
    }
  );
};

// [PATCH] Chức năng thay đổi trạng thái sản phẩm  /change-status/:status/:id
module.exports.changeStatus = async (req, res) => {
  // console.log(req.params);

  const status = req.params.status;
  const id = req.params.id;

  // Update 1 sản phẩm dunngf updateOne - nhận 2 đối số - đối số đầu là id - đối số 2 là trường muốn thay đổi
  await Product.updateOne({ _id: id }, { status: status });

  // Flash
  req.flash("success", "Cập nhật trạng thái sản phẩm thành công!");

  // res.send(`${status} - ${id}`)
  // res.redirect("/admin/products")
  // chuyển về trang trước đó
  // req.get('Referer') : Lấy URL của trang trước (trình duyệt tự gửi)
  res.redirect(req.get("Referer") || "/admin/products");
};

// Chức năng thay đổi trạng thái nhiều sản phẩm'
module.exports.changeMulti = async (req, res) => {
  // Khi submit gửi form lên sẽ trả về 2 trường
  const type = req.body.type;
  const ids = req.body.ids.split(","); // convert chuỗi sang arr

  switch (type) {
    case "active":
      await Product.updateMany({ _id: { $in: ids } }, { status: "active" });
      // Flash
      req.flash(
        "success",
        `Cập nhật trạng thái thành công ${ids.length} sản phẩm!`
      );
      break;
    case "inactive":
      await Product.updateMany({ _id: { $in: ids } }, { status: "inactive" });
      req.flash(
        "success",
        `Cập nhật trạng thái thành công ${ids.length} sản phẩm!`
      );

      break;
    case "delete-all":
      await Product.updateMany(
        { _id: { $in: ids } },
        { deleted: true, deletedAt: new Date() }
      );
      req.flash("success", `Xóa thành công ${ids.length} sản phẩm!`);

      break;

    case "change-position":
      // console.log(ids)
      // Vì phần update khác nhau lên dùng for không dùng $in
      for (const item of ids) {
        //  cắt chuỗi thành mảng - tách mỗi phần tử là 1 mảng
        let [id, position] = item.split("-"); // sử dụng destructuring [ '6911b746b0fd2b52c6673473', '1' ]
        position = parseInt(position);

        await Product.updateOne({ _id: id }, { position: position });

        req.flash(
          "success",
          `Thay đổi vị trí thành công ${ids.length} sản phẩm!`
        );

        // console.log(id)
        // console.log(position)
      }

      break;

    default:
      break;
  }
  console.log(type);
  // console.log(ids);
  res.redirect(req.get("Referer") || "/admin/products");
};

// Xóa vĩnh viễn sản phẩm
module.exports.deleteItem = async (req, res) => {
  const id = req.params.id;

  // Xóa cứng
  // await Product.deleteOne({_id: id}, {status: status})

  // Xóa mềm = cách thay đỏi trường deleted: true - tức là ẩn nó đi thôi
  // Thăng mongoDB lưu Date theo giờ quốc tế UTC
  // Convert sang Việtt Nam cài thư viện npm install moment-timezone
  const moment = require("moment-timezone");
  const deletedAtVN = moment().tz("Asia/Ho_Chi_Minh").toDate();

  await Product.updateOne(
    { _id: id },
    {
      deleted: true,
      //  deletedAt: new Date()
      deletedAt: deletedAtVN,
    }
  );

  res.redirect(req.get("Referer") || "/admin/products");
};

// [CREATE] Thêm sản phẩm
module.exports.createItem = async (req, res) => {
  res.render("admin/pages/products/create.pug", {
    pageTitle: "ADMIN Thêm mới sản phẩm",
  });
};

module.exports.createPost = async (req, res) => {
  // console.log(req.file)

  // convert những thằng này về int
  req.body.price = parseInt(req.body.price);
  req.body.discountPercentage = parseInt(req.body.discountPercentage);
  req.body.stock = parseInt(req.body.stock);

  // Tự động tăng position khi tạo mới sản phẩm
  if (req.body.position == "") {
    const countProducts = await Product.estimatedDocumentCount();
    req.body.position = countProducts + 1;
    console.log("Tổng sản phẩm", countProducts);
  } else {
    req.body.position = parseInt(req.body.position);
  }

  // Lưu vào trường thumbnail ( Đoạn này chuyển sang controller upload online)
  // if (req.file) {
  //   // kiểm tra xem có file ảnh không
  //   req.body.thumbnail = `/uploads/${req.file.filename}`;
  // } else {
  //   req.body.thumbnail = ``;
  // }

  // Tạo mới Product
  const product = new Product(req.body);
  await product.save();

  // console.log(req.body);
  res.redirect(`${systemConfig.prefixAdmin}/products`);
};
// End [CREATE] Thêm sản phẩm

// Hiển thị trang chỉnh sửa sản phẩm
// [GET] /admin/products/edit/:id
module.exports.edit = async (req, res) => {
  try {
    // console.log(req.params.id);

    const find = {
      deleted: false, // tìm sp chưa bị xóa
      _id: req.params.id, // tìm theo id
    };

    const product = await Product.findOne(find);
    console.log(product);
    res.render("admin/pages/products/edit.pug", {
      pageTitle: "ADMIN Sửa sản phẩm",
      product: product,
    });
  } catch (error) {
    res.redirect(`${systemConfig.prefixAdmin}/products`);
  }
};

// [PATCH] Chỉnh sửa sản phẩm /admin/products/edit/:id
module.exports.editPatch = async (req, res) => {
  const id = req.params.id;
  req.body.price = parseInt(req.body.price);
  req.body.discountPercentage = parseInt(req.body.discountPercentage);
  req.body.stock = parseInt(req.body.stock);
  req.body.position = parseInt(req.body.position);

  // update lại ảnh nếu có ảnh mới
  if (req.file) { 
    req.body.thumbnail = `/uploads/${req.file.filename}`;
  }

  try {
    await Product.updateOne({ _id: id }, req.body);
    req.flash("success", `Cập nhật thành cônng`);
  } catch (error) {
    req.flash("success", `Cập nhật thất bại`);
    res.redirect(`${systemConfig.prefixAdmin}/products`);
  }

  res.redirect(`${systemConfig.prefixAdmin}/products`);
};

// Chi tiết sản phẩm
module.exports.detail = async (req, res) => {
  try {
    const find = {
      deleted: false, // tìm sp chưa bị xóa
      _id: req.params.id, // tìm theo id
    };

    const product = await Product.findOne(find);
    console.log(product);
    res.render("admin/pages/products/detail.pug", {
      pageTitle: product.title,
      product: product,
    });
  } catch (error) {
    res.redirect(`${systemConfig.prefixAdmin}/products`);
  }
};