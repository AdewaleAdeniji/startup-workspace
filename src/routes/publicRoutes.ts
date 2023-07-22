const expressPublc = require("express");
import { getProductByProductID, getActiveProducts } from "../controllers/ProductController";

const publicRouter = expressPublc.Router();

publicRouter.route("/product/:productID").get(getProductByProductID);
publicRouter.route("/products/active").get(getActiveProducts);


module.exports = publicRouter;