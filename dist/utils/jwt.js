"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyRefreshToken = exports.verifyAccessToken = exports.signRefreshToken = exports.signAccessToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const env_1 = __importDefault(require("../config/env"));
const ApiError_1 = __importDefault(require("./ApiError"));
/**
 * Sign a short-lived access token
 */
const signAccessToken = (payload) => {
    return jsonwebtoken_1.default.sign({ ...payload }, env_1.default.JWT_ACCESS_SECRET, {
        expiresIn: env_1.default.JWT_ACCESS_EXPIRATION,
    });
};
exports.signAccessToken = signAccessToken;
/**
 * Sign a long-lived refresh token
 */
const signRefreshToken = (payload) => {
    return jsonwebtoken_1.default.sign({ ...payload }, env_1.default.JWT_REFRESH_SECRET, {
        expiresIn: env_1.default.JWT_REFRESH_EXPIRATION,
    });
};
exports.signRefreshToken = signRefreshToken;
/**
 * Verify access token and return its payload
 */
const verifyAccessToken = (token) => {
    try {
        return jsonwebtoken_1.default.verify(token, env_1.default.JWT_ACCESS_SECRET);
    }
    catch (error) {
        throw new ApiError_1.default(401, 'Unauthorized: Invalid or expired access token');
    }
};
exports.verifyAccessToken = verifyAccessToken;
/**
 * Verify refresh token and return its payload
 */
const verifyRefreshToken = (token) => {
    try {
        return jsonwebtoken_1.default.verify(token, env_1.default.JWT_REFRESH_SECRET);
    }
    catch (error) {
        throw new ApiError_1.default(401, 'Unauthorized: Invalid or expired refresh token');
    }
};
exports.verifyRefreshToken = verifyRefreshToken;
