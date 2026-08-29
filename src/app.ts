import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';

import { env } from './config/env';
import routes from './routes/index';
import { globalRateLimiter } from './middlewares/rateLimit.middleware';
import { notFoundHandler, errorHandler } from './middlewares/error.middleware';

const app: Application = express();

// ─── Security ─────────────────────────────────────────────────────────────────

// Set security-related HTTP headers
app.use(helmet());

// CORS configuration
app.use(
  cors({
    origin: env.cors.origin,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

// Trust the first proxy (needed for req.ip behind load balancers / Nginx)
app.set('trust proxy', 1);

// Global IP-based rate limiter
app.use(globalRateLimiter);

// ─── Logging ──────────────────────────────────────────────────────────────────

if (!env.isProduction) {
  app.use(morgan('dev'));
} else {
  // Combined format for production log aggregators (ELK, Datadog, etc.)
  app.use(morgan('combined'));
}

// ─── Body Parsing ─────────────────────────────────────────────────────────────

app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));
app.use(cookieParser());

// ─── Routes ───────────────────────────────────────────────────────────────────

// Mount all application routes under /api
app.use('/api', routes);

// Root sanity-check
app.get('/', (_req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: 'Auth Microservice is running',
    version: '1.0.0',
  });
});

// ─── Error Handling ───────────────────────────────────────────────────────────

// 404 — must come after all routes
app.use(notFoundHandler);

// Global error handler — must have 4 parameters (err, req, res, next)
app.use(errorHandler);

export default app;
