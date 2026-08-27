"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const logout_controller_1 = __importDefault(require("../controllers/logout.controller"));
const validate_middleware_1 = __importDefault(require("../middlewares/validate.middleware"));
const session_validator_1 = require("../validators/session.validator");
const router = (0, express_1.Router)();
// POST /api/logout - Invalidate current session (revoke refresh token)
router.post('/', (0, validate_middleware_1.default)(session_validator_1.refreshSchema), logout_controller_1.default.logout);
exports.default = router;
