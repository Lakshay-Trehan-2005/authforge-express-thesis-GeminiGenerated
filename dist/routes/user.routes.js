"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const user_controller_1 = __importDefault(require("../controllers/user.controller"));
const validate_middleware_1 = __importDefault(require("../middlewares/validate.middleware"));
const user_validator_1 = require("../validators/user.validator");
const rateLimit_middleware_1 = __importDefault(require("../middlewares/rateLimit.middleware"));
const router = (0, express_1.Router)();
// POST /api/users - Register a new user (with IP rate limiting)
router.post('/', rateLimit_middleware_1.default, (0, validate_middleware_1.default)(user_validator_1.registerSchema), user_controller_1.default.register);
exports.default = router;
