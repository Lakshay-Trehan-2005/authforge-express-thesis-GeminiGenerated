"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.restrictTo = void 0;
const ApiError_1 = __importDefault(require("../utils/ApiError"));
const restrictTo = (...allowedRoles) => {
    return (req, res, next) => {
        if (!req.user) {
            return next(new ApiError_1.default(401, 'Unauthorized: User authentication is required'));
        }
        if (!allowedRoles.includes(req.user.role)) {
            return next(new ApiError_1.default(403, `Forbidden: You do not have permission to access this resource`));
        }
        next();
    };
};
exports.restrictTo = restrictTo;
exports.default = exports.restrictTo;
