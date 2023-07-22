import mongoose from "mongoose";
const Schema = mongoose.Schema;

const productsSchema = new Schema(
  {
    productID: {
      type: String,
      default: "",
      immutable: true,
    },
    productName: {
      type: String,
      default: "",
    },
    productDescription: {
      type: String,
      default: true,
    },
    productUrl: String,
    status: {
      type: Boolean,
      default: true,
    },
    default: {
      type: Boolean,
      default: false,
    },
    paid: {
      type: Boolean,
      default: false,
    },
    createdBy: {
      type: String,
      default: "",
      immutable: true,
    },
  },
  {
    timestamps: true,
  }
);
exports.invites = productsSchema;
module.exports = mongoose.model("products", productsSchema);
