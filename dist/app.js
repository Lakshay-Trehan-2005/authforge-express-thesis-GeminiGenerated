"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const routes_1 = __importDefault(require("./routes"));
const error_middleware_1 = __importDefault(require("./middlewares/error.middleware"));
const ApiError_1 = __importDefault(require("./utils/ApiError"));
const app = (0, express_1.default)();
// 1. Set Security HTTP headers
app.use((0, helmet_1.default)());
// 2. Enable CORS
app.use((0, cors_1.default)());
// 3. Body parsers
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
// 4. API Routes
app.use('/api', routes_1.default);
// 5. Catch-all for undefined routes
app.use((req, res, next) => {
    next(new ApiError_1.default(404, `Cannot find ${req.originalUrl} on this server`));
});
// 6. Global centralized error handler
app.use(error_middleware_1.default);
exports.default = app;
