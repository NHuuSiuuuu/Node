// import 2 thư viện này
const cloudinary = require("cloudinary").v2;
const streamifier = require("streamifier");

module.exports.upload = (req, res, next) => {
  if (req.file) {
    let streamUpload = (req) => {
      return new Promise((resolve, reject) => {
        let stream = cloudinary.uploader.upload_stream((error, result) => {
          if (result) {
            resolve(result);
          } else {
            reject(error);
          }
        });

        streamifier.createReadStream(req.file.buffer).pipe(stream);
      });
    };

    async function upload(req) {
      let result = await streamUpload(req);
      console.log(result);
      //   req.body.thumbnail = result.secure_url // thumbnail là tên thuộc tính input nhập ảnh bên form
      req.body[req.file.fieldname] = result.secure_url; // thumbnail là tên thuộc tính input nhập ảnh bên form
      next(); // next qua bước tiếp theo
    }

    upload(req);
  } else {
    next(); // next qua bước tiếp theo
  }
};
