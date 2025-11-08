const express = require("express"); // import
// Cấu hình env
require('dotenv').config()
// console.log(process.env.PORT)

// import mongoose
const database = require("./config/database")
database.connect();

const route = require("./routes/client/index.route")

const app = express(); // toàn bộ chương trình

const port = process.env.PORT; // port = 3000

app.set("views", "./views");
app.set("view engine", "pug");

// Routes
route(app)

// Nhúng file tĩnh: các file có thể xem được ở bên ngoài
app.use(express.static('public'))


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
