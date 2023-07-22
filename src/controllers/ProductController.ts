import { NextFunction, Request, Response } from "express";
const utils = require("../utils.js");
const ProductService = require("../services/ProductService");
const EmailService = require("../services/EmailService");
import { middlewares } from "../middlewares/user";

export const testAdminService = middlewares.WrapHandler(
  async (req: Request, res: Response) => {
    res.status(200).send({ message: "Works" || [] });
  }
);
export const createProduct = middlewares.WrapHandler(
  async (req: Request, res: Response) => {
    const body = req.body;
    const val = middlewares.validateRequest(body, [
      "productName",
      "productUrl",
      "productDescription",
    ]);
    if (val) return res.status(400).send({ message: val });
    //all good
    body.productID = utils.generateID();
    const create = await ProductService.createProducts(body);
    if (!create)
      return res.status(400).send({ message: "Failed to create product" });
    return res.status(200).send({ data: create, message: "Product created" });
  }
);
export const getActiveProducts = middlewares.WrapHandler(
  async (req: Request, res: Response) => {
    const products = await ProductService.getAllActiveProducts();
    if (!products)
      return res.status(400).send({ message: "Failed to get product" });
    return res
      .status(200)
      .send({ data: products, message: "Product returned" });
  }
);
export const getAllProducts = middlewares.WrapHandler(
  async (req: Request, res: Response) => {
    const products = await ProductService.getAllProducts();
    if (!products)
      return res.status(400).send({ message: "Failed to get product" });
    return res
      .status(200)
      .send({ data: products, message: "All Products returned" });
  }
);
export const getProductByProductID = middlewares.WrapHandler(
  async (req: any, res: Response) => {
    const productID = req.params.productID;
    const product = await ProductService.getProductByProductID(productID);
    if (!product)
      return res.status(400).send({ message: "Failed to get product" });
    return res.status(200).send({ data: product, message: "Product returned" });
  }
);
export const updateProduct = middlewares.WrapHandler(
  async (req: any, res: Response) => {
    const newProduct = req.body;
    const productID = req.params.productID;
    const product = await ProductService.getProductByProductID(productID);
    if (!product)
      return res.status(400).send({ message: "Failed to create product" });
    const updateProduct = await ProductService.updateProduct(
      product._id,
      newProduct
    );
    if (updateProduct) {
      const updatedProduct = await ProductService.getProductByProductID(
        productID
      );
      return res
        .status(200)
        .send({ data: updatedProduct, message: "Product updated" });
    } else {
      return res
        .status(400)
        .send({ data: product, message: "Product failed to update" });
    }
  }
);
