"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RefreshService = void 0;
const Session_model_1 = __importDefault(require("../models/Session.model"));
const user_service_1 = __importDefault(require("./user.service"));
const jwt_1 = require("../utils/jwt");
const ApiError_1 = __importDefault(require("../utils/ApiError"));
class RefreshService {
    /**
     * Validate refresh token and issue a new short-lived access token
     */
    async refreshAccessToken(refreshToken) {
        // 1. Verify the signature and expiration of the refresh token
        const payload = (0, jwt_1.verifyRefreshToken)(refreshToken);
        // 2. Ensure session exists in the database
        const activeSession = await Session_model_1.default.findOne({ token: refreshToken });
        if (!activeSession) {
            throw new ApiError_1.default(401, 'Unauthorized: Session is invalid or has expired');
        }
        // 3. Confirm user still exists
        const user = await user_service_1.default.getUserById(payload.id);
        if (!user) {
            throw new ApiError_1.default(401, 'Unauthorized: User belonging to this token no longer exists');
        }
        // 4. Generate new access token
        const newAccessToken = (0, jwt_1.signAccessToken)({
            id: user._id.toString(),
            email: user.email,
            role: user.role,
        });
        return {
            accessToken: newAccessToken,
        };
    }
}
exports.RefreshService = RefreshService;
exports.default = new RefreshService();
