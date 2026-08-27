"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = void 0;
const env_1 = __importDefault(require("../config/env"));
const errorHandler = (err, req, res, next) => {
    let statusCode = err.statusCode || 500;
    let message = err.message || 'Internal Server Error';
    let errors = err.errors;
    // Handle Mongoose duplicate key error (code 11000)
    if (err.code === 11000) {
        statusCode = 409;
        const field = Object.keys(err.keyValue || {}).join(', ');
        message = field ? `Duplicate field: ${field} already exists.` : 'Resource already exists.';
    }
    // Handle Mongoose validation errors
    if (err.name === 'ValidationError') {
        statusCode = 400;
        message = err.message;
        errors = Object.values(err.errors || {}).map((e) => ({
            field: e.path,
            message: e.message,
        }));
    }
    // Handle JWT signature error
    if (err.name === 'JsonWebTokenError') {
        statusCode = 401;
        message = 'Unauthorized: Invalid access token signature';
    }
    // Handle JWT expiration error
    if (err.name === 'TokenExpiredError') {
        statusCode = 401;
        message = 'Unauthorized: Access token has expired';
    }
    // Hide internal server errors details in production
    if (statusCode === 500 && env_1.default.NODE_ENV === 'production') {
        message = 'Something went wrong on our end';
    }
    const responseBody = {
        success: false,
        message,
        ...(errors && { errors }),
        ...(env_1.default.NODE_ENV === 'development' && { stack: err.stack }),
    };
    // Log server errors (500)
    if (statusCode === 500) {
        console.error(`💥 [500 Error]: ${err.stack || err}`);
    }
    res.status(statusCode).json(responseBody);
};
exports.errorHandler = errorHandler;
exports.default = exports.errorHandler;
