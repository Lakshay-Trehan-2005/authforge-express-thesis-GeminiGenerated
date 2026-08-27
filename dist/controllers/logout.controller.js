"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LogoutController = void 0;
const session_service_1 = __importDefault(require("../services/session.service"));
const ApiError_1 = __importDefault(require("../utils/ApiError"));
class LogoutController {
    /**
     * Logout user handler - invalidates the session in database
     */
    logout = async (req, res, next) => {
        try {
            const { refreshToken } = req.body;
            if (!refreshToken) {
                throw new ApiError_1.default(400, 'Refresh token is required to log out');
            }
            await session_service_1.default.invalidateSession(refreshToken);
            res.status(200).json({
                success: true,
                message: 'Logged out successfully, session invalidated',
            });
        }
        catch (error) {
            next(error);
        }
    };
}
exports.LogoutController = LogoutController;
exports.default = new LogoutController();
