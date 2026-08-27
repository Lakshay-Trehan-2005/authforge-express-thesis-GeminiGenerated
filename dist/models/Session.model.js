"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Session = void 0;
const mongoose_1 = require("mongoose");
const sessionSchema = new mongoose_1.Schema({
    userId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'User ID is required'],
    },
    token: {
        type: String,
        required: [true, 'Session token is required'],
        unique: true,
        index: true,
    },
    expiresAt: {
        type: Date,
        required: [true, 'Expiration date is required'],
        index: { expires: 0 }, // MongoDB TTL index to auto-delete documents after expiresAt date
    },
    ip: {
        type: String,
    },
    userAgent: {
        type: String,
    },
}, {
    timestamps: true,
});
exports.Session = (0, mongoose_1.model)('Session', sessionSchema);
exports.default = exports.Session;
