const mongoose = require("mongoose");
const slug = require("mongoose-slug-updater");
mongoose.plugin(slug);

// Schema: Định nghĩa cấi trúc dữ liệu sản phẩm, định nghĩa sản phẩm có trường gì
// Schema giúp Mongoose kiểm soát dữ liệu trước khi lưu vào database
const productCategorySchema = new mongoose.Schema(
  {
    title: String, // sản phẩm 1
    description: {
        type: String,
        default: ""
    },
    thumbnail: String,
    status: String,
    position: Number,
    slug: {
      type: String,
      slug: "title", // san-pham-1
      unique: true   // chỉ tạo slug duy nhất
    },
    deleted: {
      type: Boolean,
      default: false,
    },
    deletedAt: Date,
  },
  {
    timestamps: true,
  }
);


// Tạo medel từ schema giúp thêm sửa xóa lấy sản phẩm bà không cầ viết lệnh trực tiếp trong MonggoDB
const ProductCategory = mongoose.model("ProductCategory", productCategorySchema, "products-category"); // Đối số thứ 3 là bảng colection

module.exports = ProductCategory;
