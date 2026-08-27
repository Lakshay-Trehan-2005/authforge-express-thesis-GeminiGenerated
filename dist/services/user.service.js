"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserService = void 0;
const User_model_1 = __importDefault(require("../models/User.model"));
const ApiError_1 = __importDefault(require("../utils/ApiError"));
class UserService {
    /**
     * Register a new user
     */
    async createUser(userData) {
        const existingUser = await User_model_1.default.findOne({ email: userData.email.toLowerCase() });
        if (existingUser) {
            throw new ApiError_1.default(409, 'User with this email already exists');
        }
        const newUser = new User_model_1.default({
            email: userData.email,
            password: userData.password,
            role: userData.role,
        });
        await newUser.save();
        // Remove password before returning
        newUser.password = undefined;
        return newUser;
    }
    /**
     * Find user by email (optionally include password)
     */
    async getUserByEmail(email, includePassword = false) {
        const query = User_model_1.default.findOne({ email: email.toLowerCase() });
        if (includePassword) {
            query.select('+password');
        }
        return query.exec();
    }
    /**
     * Find user by id
     */
    async getUserById(id) {
        return User_model_1.default.findById(id).exec();
    }
}
exports.UserService = UserService;
exports.default = new UserService();
