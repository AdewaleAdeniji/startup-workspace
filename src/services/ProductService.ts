const PS = require("../models/Products");

exports.getAllProducts = async () => {
  return await PS.find();
};

exports.getAllActiveProducts = async () => {
  return await PS.find({
    status: true,
  });
};
exports.getAllDefaultProducts = async () => {
  return await PS.find({
    status: true,
    default: true,
  });
};
exports.createProducts = async (workspace: any) => {
  return await PS.create(workspace);
};
exports.getProductByID = async (id: string) => {
  return await PS.findById(id);
};
exports.getProductByProductID = async (id: string) => {
  return await PS.findOne({
    productID: id,
  });
};

exports.updateProduct = async (id: string, product: any) => {
  return await PS.findByIdAndUpdate(id, product);
};
