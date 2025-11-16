const multer = require("multer")
module.exports = () => {
  const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      // destination: đường dẫn
      cb(null, "./public/uploads/");
    },
    filename: function (req, file, cb) {
      // filename: Tên file
      const uniqueSuffix = Date.now();
      cb(null, `${uniqueSuffix}-${file.originalname}`);
    },
  });

  return storage;
};
// {
//   fieldname: 'thumbnail',
//   originalname: 'iphone-15-pro-max-natural-titanium-1-hhm.webp',
//   encoding: '7bit',
//   mimetype: 'image/webp',
//   destination: './public/uploads/',
//   filename: '4f7806610c32b679288a06239146a336',
//   path: 'public\\uploads\\4f7806610c32b679288a06239146a336',
//   size: 34836
// }
