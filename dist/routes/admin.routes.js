"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_middleware_1 = __importDefault(require("../middlewares/auth.middleware"));
const role_middleware_1 = __importDefault(require("../middlewares/role.middleware"));
const router = (0, express_1.Router)();
// GET /api/admin/dashboard - Protected route, restricted to users with 'admin' role
router.get('/dashboard', auth_middleware_1.default, (0, role_middleware_1.default)('admin'), (req, res) => {
    res.status(200).json({
        success: true,
        message: 'Welcome to the Admin Dashboard!',
        adminUser: req.user,
    });
});
exports.default = router;
