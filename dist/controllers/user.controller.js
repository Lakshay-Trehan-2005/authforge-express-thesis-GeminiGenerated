"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserController = void 0;
const user_service_1 = __importDefault(require("../services/user.service"));
class UserController {
    /**
     * Register user handler
     */
    register = async (req, res, next) => {
        try {
            const { email, password, role } = req.body;
            const user = await user_service_1.default.createUser({ email, password, role });
            res.status(201).json({
                success: true,
                message: 'User registered successfully',
                data: {
                    id: user._id.toString(),
                    email: user.email,
                    role: user.role,
                },
            });
        }
        catch (error) {
            next(error);
        }
    };
}
exports.UserController = UserController;
exports.default = new UserController();
