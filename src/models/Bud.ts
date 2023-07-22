import mongoose from "mongoose";
const Schema = mongoose.Schema;

const budSchema = new Schema({
    budgetID: {
        type: String,
        default: ''
    },
    userID: String,
    budID: String,
    budAmount: String,
    budTitle: String,
    budDesc: {
        type: String,
        default: ''
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    updatedAt: {
        type: Date,
        default: Date.now,
    },
})
module.exports = mongoose.model("buds", budSchema);
