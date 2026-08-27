"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.protect = void 0;
const jwt_1 = require("../utils/jwt");
const ApiError_1 = __importDefault(require("../utils/ApiError"));
const protect = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            throw new ApiError_1.default(401, 'Unauthorized: Access token is missing or malformed');
        }
        const token = authHeader.split(' ')[1];
        if (!token) {
            throw new ApiError_1.default(401, 'Unauthorized: Access token is empty');
        }
        const payload = (0, jwt_1.verifyAccessToken)(token);
        req.user = payload;
        next();
    }
    catch (error) {
        next(error);
    }
};
exports.protect = protect;
exports.default = exports.protect;
