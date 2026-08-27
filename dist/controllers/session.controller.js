"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SessionController = void 0;
const session_service_1 = __importDefault(require("../services/session.service"));
class SessionController {
    /**
     * Login user handler
     */
    login = async (req, res, next) => {
        try {
            const { email, password } = req.body;
            const ip = req.ip || req.socket.remoteAddress;
            const userAgent = req.headers['user-agent'];
            const result = await session_service_1.default.createSession(email, password, ip, userAgent);
            res.status(200).json({
                success: true,
                message: 'Login successful',
                data: result,
            });
        }
        catch (error) {
            next(error);
        }
    };
}
exports.SessionController = SessionController;
exports.default = new SessionController();
