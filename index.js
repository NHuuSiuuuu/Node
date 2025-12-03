const express = require("express"); // import
// Cấu hình env
require("dotenv").config();
// console.log(process.env.PORT)

// Cấu hình cho thăng socket io
const http = require("http");
const { Server } = require("socket.io");

// import path để dùng tinyMCE
const path = require("path");

// import thư viện moment để xử lý thời gian
const moment = require("moment");

// import mongoose
const database = require("./config/database");
database.connect();

// import routes client
const route = require("./routes/client/index.route");

// import routes admin
const routeAdmin = require("./routes/admin/index.route");

// import thằng method-override
var methodOverride = require("method-override");

const app = express(); // toàn bộ chương trình

// Socket IO
const server = http.createServer(app);
const io = new Server(server);

io.on("connection", (socket) => {
  console.log("a user connected", socket.id);
});

// End Socket IO


// import thằng method-override (ghi sau biến app)
app.use(methodOverride("_method"));

// import bodyparser
const bodyParser = require("body-parser");

// import thư viện multer
const multer = require("multer");

// import thư viện express-flash
const flash = require("express-flash");
const cookieParser = require("cookie-parser");
const session = require("express-session");

const port = process.env.PORT; // port = 3000

// app.set("views", "./views");
app.set("views", `${__dirname}/views`);

app.set("view engine", "pug");

// Khởi tạo Flash
app.use(cookieParser("keyboard cat")); // Đọc cookie session ID từ trình duyệt
app.use(session({ cookie: { maxAge: 60000 } })); // middleware lưu dữ liệu session trên server, cookie giúp liên kết session với clien
app.use(flash()); // Dùng session này để lưu thông báo tạm thời
/**
 * Flash Message (thông báo tạm thời) không lưu trực tiếp trên cookie
 * Cookie chỉ lưu session ID, để sever biết message nào của client nào
 * Dữ liệu message thực sự nằm trên server, cookie chỉ là cầu nối
 */
// Biến toàn cục
const systemConfig = require("./config/system");
// Đặt tên biến là prefixAdmin
app.locals.prefixAdmin = systemConfig.prefixAdmin; // /ADMIN

// Tạo biến moment local
app.locals.moment = moment;

// TinyMCE
app.use(
  "/tinymce",
  express.static(path.join(__dirname, "node_modules", "tinymce"))
);

app.use(bodyParser.urlencoded()); // nên khai báo th này trước route

// Nhúng file tĩnh: các file có thể xem được ở bên ngoài
// app.use(express.static('public')) // public để o ffline được nhưng online sẽ lỗi
app.use(express.static(`${__dirname}/public`)); // biến này chạy đc cả local cả online

// Routes
route(app);
routeAdmin(app);

app.use((req, res) => {
  res.render("client/errors/404", {
    pageTitle: "404 Not Found",
  });
});

server.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
