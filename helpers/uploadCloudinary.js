// import 2 thư viện này
const cloudinary = require("cloudinary").v2;
const streamifier = require("streamifier");

// stream là cơ chế xử lý dlieu theo từng phần nhỏ thay vì tải toàn biij dữ liệu 1 lần
// Khi bạn đọc file lớn bằng buffer → phải load hết 2GB file vào RAM → dễ crash.
// Khi đọc bằng stream → đọc từng 64KB → RAM chỉ dùng vài trăm KB → an toàn, nhẹ.

// Chuyển buffer -> Stream vì  Cloudinary không nhận buffer, lên phải chuyển buffeer thành stream để upload
let streamUpload = (buffer) => {
  return new Promise((resolve, reject) => {
    let stream = cloudinary.uploader.upload_stream((error, result) => {
      if (result) {
        resolve(result);
      } else {
        reject(error);
      }
    });

    streamifier.createReadStream(buffer).pipe(stream);
  });
};

// Hàm này để gọi hàm streamUpload
module.exports = async (buffer) => {  // Nhận buffer
  let result = await streamUpload(buffer); // await upload thành công lên Cloudinary
  // console.log(result);
  return result.secure_url;  // trả về secure_url của ảnh
};
