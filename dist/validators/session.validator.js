"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.refreshSchema = exports.loginSchema = void 0;
const zod_1 = require("zod");
exports.loginSchema = zod_1.z.object({
    body: zod_1.z.object({
        email: zod_1.z
            .string({ message: 'Email is required' })
            .min(1, 'Email is required')
            .email('Please enter a valid email address'),
        password: zod_1.z
            .string({ message: 'Password is required' })
            .min(1, 'Password cannot be empty'),
    }),
});
exports.refreshSchema = zod_1.z.object({
    body: zod_1.z.object({
        refreshToken: zod_1.z
            .string({ message: 'Refresh token is required' })
            .min(1, 'Refresh token cannot be empty'),
    }),
});
