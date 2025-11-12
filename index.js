const express = require("express"); // import
// Cấu hình env
require('dotenv').config()
// console.log(process.env.PORT)

// import mongoose
const database = require("./config/database")
database.connect();

// import routes client
const route = require("./routes/client/index.route")

// import routes admin
const routeAdmin = require("./routes/admin/index.route")

// import thằng method-override
var methodOverride = require('method-override')

const app = express(); // toàn bộ chương trình

// import thằng method-override (ghi sau biến app)
app.use(methodOverride('_method'))

const port = process.env.PORT; // port = 3000

app.set("views", "./views");
app.set("view engine", "pug");

// Biến toàn cục
const systemConfig = require("./config/system")
// Đặt tên biến là prefixAdmin
app.locals.prefixAdmin = systemConfig.prefixAdmin // /ADMIN

// Routes
route(app)
routeAdmin(app)

// Nhúng file tĩnh: các file có thể xem được ở bên ngoài
app.use(express.static('public'))


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
