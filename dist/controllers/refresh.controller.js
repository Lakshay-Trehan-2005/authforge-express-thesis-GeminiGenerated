"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RefreshController = void 0;
const refresh_service_1 = __importDefault(require("../services/refresh.service"));
class RefreshController {
    /**
     * Refresh token handler
     */
    refresh = async (req, res, next) => {
        try {
            const { refreshToken } = req.body;
            const result = await refresh_service_1.default.refreshAccessToken(refreshToken);
            res.status(200).json({
                success: true,
                message: 'Access token refreshed successfully',
                data: result,
            });
        }
        catch (error) {
            next(error);
        }
    };
}
exports.RefreshController = RefreshController;
exports.default = new RefreshController();
