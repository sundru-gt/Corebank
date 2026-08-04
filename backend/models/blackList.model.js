const mongoose = require("mongoose");

const tokenBlackListSchema = new mongoose.Schema({
    token: {
        type: String,
        required: [true, "Token is required to blacklist"],
        unique: [true, "Token is already blacklisted"]
    }
}, {
    timestamps: true
})

tokenBlackListSchema.index({ createdAt: 1 }, {
    expireAfterSeconds: 86400 * 3
})

const tokenBlackListModel = mongoose.model("TokenBlackList", tokenBlackListSchema)

module.exports = tokenBlackListModel;