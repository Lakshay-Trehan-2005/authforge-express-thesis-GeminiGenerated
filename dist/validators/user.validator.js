"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerSchema = void 0;
const zod_1 = require("zod");
exports.registerSchema = zod_1.z.object({
    body: zod_1.z.object({
        email: zod_1.z
            .string({ message: 'Email is required' })
            .min(1, 'Email is required')
            .email('Please enter a valid email address'),
        password: zod_1.z
            .string({ message: 'Password is required' })
            .min(6, 'Password must be at least 6 characters long'),
        role: zod_1.z
            .enum(['user', 'admin'], { message: 'Role must be user or admin' })
            .optional()
            .default('user'),
    }),
});
