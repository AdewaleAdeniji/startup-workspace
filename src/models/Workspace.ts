import mongoose from "mongoose";
const Schema = mongoose.Schema;

const workspaceSchema = new Schema({
    workspaceID: {
        type: String,
        default: '',
        immutable: true,
    },
    workspaceName: String,
    workspaceUserName: String,
    workspaceDescription: String,
    workspaceAdmins: Array,
    workspacePhoto: String,
    workspaceProducts: {
        type: Array,
        default: []
    },
    workspaceSettings: {
        type: {
            String: String
        },
        default: {}
    },
},
{
    timestamps: true
})
module.exports = mongoose.model("workspaces", workspaceSchema);
