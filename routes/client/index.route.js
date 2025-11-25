// Định nghĩa đường dẫn gọi controller nào
const categoryMiddleware = require("../../middlewares/client/category.middleware");

const homeRoutes = require("./home.route");
const productRoutes = require("./product.route");

module.exports = (app) => {
  app.get("/", categoryMiddleware.category, homeRoutes);

  app.use("/products", categoryMiddleware.category, productRoutes);
};
