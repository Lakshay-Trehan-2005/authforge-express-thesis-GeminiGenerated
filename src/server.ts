import http from 'http';
import app from './app';
import { connectDB, disconnectDB } from './config/db';
import { env } from './config/env';

let server: http.Server;

async function startServer(): Promise<void> {
  // Connect to MongoDB before accepting traffic
  await connectDB();

  server = http.createServer(app);

  server.listen(env.port, () => {
    console.info(
      `[Server] Auth Microservice running in ${env.nodeEnv} mode on port ${env.port}`
    );
    console.info(`[Server] API available at http://localhost:${env.port}/api`);
  });

  server.on('error', (err: NodeJS.ErrnoException) => {
    if (err.code === 'EADDRINUSE') {
      console.error(`[Server] Port ${env.port} is already in use.`);
    } else {
      console.error('[Server] Server error:', err.message);
    }
    process.exit(1);
  });
}

// ─── Graceful Shutdown ────────────────────────────────────────────────────────

async function shutdown(signal: string): Promise<void> {
  console.info(`\n[Server] Received ${signal}. Starting graceful shutdown...`);

  // Stop accepting new connections
  server.close(async (err) => {
    if (err) {
      console.error('[Server] Error during server close:', err.message);
      process.exit(1);
    }

    // Close database connection
    await disconnectDB();
    console.info('[Server] Shutdown complete.');
    process.exit(0);
  });

  // Force-exit if graceful shutdown takes too long
  setTimeout(() => {
    console.error('[Server] Forced shutdown after timeout.');
    process.exit(1);
  }, 10_000).unref();
}

process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));

// Handle uncaught exceptions & unhandled promise rejections
process.on('uncaughtException', (err: Error) => {
  console.error('[Process] Uncaught Exception:', err.message, err.stack);
  process.exit(1);
});

process.on('unhandledRejection', (reason: unknown) => {
  const message = reason instanceof Error ? reason.message : String(reason);
  console.error('[Process] Unhandled Rejection:', message);
  process.exit(1);
});

startServer();
