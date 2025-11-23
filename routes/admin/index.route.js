// Định nghĩa đường dẫn gọi controller nào
const systemConfig = require("../../config/system");

const dashboardRoutes = require("./dashboard.route");
const productRoutes = require("./product.route");
const producCategorytRoutes = require("./product-category.route");
const roleRoutes = require("./role.route");
const accountRoutes = require("./account.route");
const authRoutes = require("./auth.route");

const authMiddleware = require("../../middlewares/admin/auth.middleware");

module.exports = (app) => {
  const PATH_ADMIN = systemConfig.prefixAdmin;
  
  app.use(
    PATH_ADMIN + "/dashboard",
    authMiddleware.requireAuth,
    dashboardRoutes
  );

  app.use(PATH_ADMIN + "/products",  authMiddleware.requireAuth, productRoutes);

  app.use(PATH_ADMIN + "/products-category",  authMiddleware.requireAuth, producCategorytRoutes);

  app.use(PATH_ADMIN + "/roles",  authMiddleware.requireAuth, roleRoutes);

  app.use(PATH_ADMIN + "/accounts",  authMiddleware.requireAuth, accountRoutes);

  app.use(PATH_ADMIN + "/auth", authRoutes);
};
