const express = require("express"); // import
// Cấu hình env
require('dotenv').config()
// console.log(process.env.PORT)

const route = require("./routes/client/index.route")

const app = express(); // toàn bộ chương trình

const port = process.env.PORT; // port = 3000

app.set("views", "./views");
app.set("view engine", "pug");

// Routes
route(app)



app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
