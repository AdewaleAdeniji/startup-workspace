const expressA = require("express");
import { testAdminService, createProduct, getProductByProductID, updateProduct, getActiveProducts, getAllProducts } from "../controllers/ProductController";

const adminRouter = expressA.Router();

adminRouter.route("/").get(testAdminService);
adminRouter.route("/products/create").post(createProduct);

adminRouter.route("/product/:productID").get(getProductByProductID);
adminRouter.route("/product/:productID").put(updateProduct);

adminRouter.route("/products/active").get(getActiveProducts);
adminRouter.route("/products/all").get(getAllProducts);

module.exports = adminRouter;