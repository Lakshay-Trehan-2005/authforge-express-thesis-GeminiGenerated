"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const user_routes_1 = __importDefault(require("./user.routes"));
const session_routes_1 = __importDefault(require("./session.routes"));
const refresh_routes_1 = __importDefault(require("./refresh.routes"));
const logout_routes_1 = __importDefault(require("./logout.routes"));
const admin_routes_1 = __importDefault(require("./admin.routes"));
const router = (0, express_1.Router)();
// Register route modules
router.use('/users', user_routes_1.default);
router.use('/sessions', session_routes_1.default);
router.use('/token', refresh_routes_1.default);
router.use('/logout', logout_routes_1.default);
router.use('/admin', admin_routes_1.default);
exports.default = router;
