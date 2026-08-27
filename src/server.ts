import app from './app';
import env from './config/env';
import connectDB from './config/db';
import { Server } from 'http';

let server: Server;

const startServer = async () => {
  // Connect to Database
  await connectDB();

  // Start HTTP Server
  server = app.listen(env.PORT, () => {
    console.log(`🚀 Authentication microservice running in ${env.NODE_ENV} mode on port ${env.PORT}`);
  });
};

// Graceful shutdown helper
const gracefulShutdown = (signal: string) => {
  console.log(`\n⏳ Received ${signal}. Shutting down gracefully...`);
  if (server) {
    server.close(() => {
      console.log('🛑 Server closed.');
      process.exit(0);
    });
  } else {
    process.exit(0);
  }
};

// Error handlers for unhandled problems
process.on('uncaughtException', (err) => {
  console.error('💥 UNCAUGHT EXCEPTION! Shutting down...');
  console.error(err.name, err.message, err.stack);
  process.exit(1);
});

process.on('unhandledRejection', (reason: any) => {
  console.error('💥 UNHANDLED REJECTION! Shutting down...');
  console.error(reason?.name || reason, reason?.message || reason, reason?.stack || '');
  if (server) {
    server.close(() => {
      process.exit(1);
    });
  } else {
    process.exit(1);
  }
});

// Capture termination signals
process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

startServer();
