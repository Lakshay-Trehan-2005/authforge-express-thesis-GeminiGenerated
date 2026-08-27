"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = __importDefault(require("./app"));
const env_1 = __importDefault(require("./config/env"));
const db_1 = __importDefault(require("./config/db"));
let server;
const startServer = async () => {
    // Connect to Database
    await (0, db_1.default)();
    // Start HTTP Server
    server = app_1.default.listen(env_1.default.PORT, () => {
        console.log(`🚀 Authentication microservice running in ${env_1.default.NODE_ENV} mode on port ${env_1.default.PORT}`);
    });
};
// Graceful shutdown helper
const gracefulShutdown = (signal) => {
    console.log(`\n⏳ Received ${signal}. Shutting down gracefully...`);
    if (server) {
        server.close(() => {
            console.log('🛑 Server closed.');
            process.exit(0);
        });
    }
    else {
        process.exit(0);
    }
};
// Error handlers for unhandled problems
process.on('uncaughtException', (err) => {
    console.error('💥 UNCAUGHT EXCEPTION! Shutting down...');
    console.error(err.name, err.message, err.stack);
    process.exit(1);
});
process.on('unhandledRejection', (reason) => {
    console.error('💥 UNHANDLED REJECTION! Shutting down...');
    console.error(reason?.name || reason, reason?.message || reason, reason?.stack || '');
    if (server) {
        server.close(() => {
            process.exit(1);
        });
    }
    else {
        process.exit(1);
    }
});
// Capture termination signals
process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));
startServer();
