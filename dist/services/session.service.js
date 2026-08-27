"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SessionService = void 0;
const Session_model_1 = __importDefault(require("../models/Session.model"));
const user_service_1 = __importDefault(require("./user.service"));
const jwt_1 = require("../utils/jwt");
const ApiError_1 = __importDefault(require("../utils/ApiError"));
const env_1 = __importDefault(require("../config/env"));
class SessionService {
    /**
     * Parse simple duration strings like "7d", "15m", "1h" to milliseconds
     */
    parseDuration(duration) {
        const match = duration.match(/^(\d+)([dhm])$/);
        if (!match)
            return 7 * 24 * 60 * 60 * 1000; // default 7 days
        const value = parseInt(match[1], 10);
        const unit = match[2];
        switch (unit) {
            case 'd':
                return value * 24 * 60 * 60 * 1000;
            case 'h':
                return value * 60 * 60 * 1000;
            case 'm':
                return value * 60 * 1000;
            default:
                return 7 * 24 * 60 * 60 * 1000;
        }
    }
    /**
     * Create a new session (login) and return access/refresh tokens
     */
    async createSession(email, passwordCandidate, ip, userAgent) {
        const user = await user_service_1.default.getUserByEmail(email, true);
        if (!user || !(await user.comparePassword(passwordCandidate))) {
            throw new ApiError_1.default(401, 'Invalid email or password');
        }
        const userPayload = {
            id: user._id.toString(),
            email: user.email,
            role: user.role,
        };
        const accessToken = (0, jwt_1.signAccessToken)(userPayload);
        const refreshToken = (0, jwt_1.signRefreshToken)(userPayload);
        // Save refresh token to MongoDB Session tracking
        const refreshExpMs = this.parseDuration(env_1.default.JWT_REFRESH_EXPIRATION);
        const expiresAt = new Date(Date.now() + refreshExpMs);
        await Session_model_1.default.create({
            userId: user._id,
            token: refreshToken,
            expiresAt,
            ip,
            userAgent,
        });
        return {
            accessToken,
            refreshToken,
            user: userPayload,
        };
    }
    /**
     * Invalidate a session (logout) by deleting the token
     */
    async invalidateSession(token) {
        const deletedSession = await Session_model_1.default.findOneAndDelete({ token });
        if (!deletedSession) {
            throw new ApiError_1.default(404, 'Session not found or already invalidated');
        }
    }
}
exports.SessionService = SessionService;
exports.default = new SessionService();
