const mongoose = require("mongoose");
const slug = require("mongoose-slug-updater");
mongoose.plugin(slug);

// Schema: Định nghĩa cấi trúc dữ liệu sản phẩm, định nghĩa sản phẩm có trường gì
// Schema giúp Mongoose kiểm soát dữ liệu trước khi lưu vào database
const productSchema = new mongoose.Schema({
  title: String, // sản phẩm 1
  category_id: {
    type: String,
    default: "",
  },
  description: String,
  price: Number,
  discountPercentage: Number,
  stock: Number,
  thumbnail: String,
  status: String,
  position: Number,
  slug: {
    type: String,
    slug: "title", // san-pham-1
    unique: true, // chỉ tạo slug duy nhất
  },
  createBy: {
    account_id: String,
    // Thời gian tạo
    createAt: {
      type: Date,
      default: Date.now,
    },
  },
  deleted: {
    type: Boolean,
    default: false,
  },

  // deletedAt: Date,
  deletedBy: {
    account_id: String,
    deletedAt: Date,
  },

  updatedBy: [
    {
      account_id: String,
      updatedAt: Date,
    },
  ],
});

//  timestamps: true
// bằng với
/**
 * timestamps: {
 * createAt: 'created_at',
 * updateAt: 'updated_at
 * }
 *
 */

// Tạo medel từ schema giúp thêm sửa xóa lấy sản phẩm bà không cầ viết lệnh trực tiếp trong MonggoDB
const Product = mongoose.model("Product", productSchema, "demoproducts"); // Đối số thứ 3 là bảng colection

module.exports = Product;
