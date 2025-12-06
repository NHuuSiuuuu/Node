const uploadToCloudinary = require("../../helpers/uploadCloudinary")

// Middleware Express để xử lý upload
module.exports.upload = async  (req, res, next) => {
  // Nếu có file up lên
  if (req.file) {
    const link = await uploadToCloudinary(req.file.buffer);
    req.body[req.file.fieldname] = link; 
  }
  next(); // next qua bước tiếp theo
};
