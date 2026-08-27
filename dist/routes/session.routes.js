"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const session_controller_1 = __importDefault(require("../controllers/session.controller"));
const validate_middleware_1 = __importDefault(require("../middlewares/validate.middleware"));
const session_validator_1 = require("../validators/session.validator");
const rateLimit_middleware_1 = __importDefault(require("../middlewares/rateLimit.middleware"));
const router = (0, express_1.Router)();
// POST /api/sessions - Login user (with IP rate limiting)
router.post('/', rateLimit_middleware_1.default, (0, validate_middleware_1.default)(session_validator_1.loginSchema), session_controller_1.default.login);
exports.default = router;
