import express, { Application, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import routes from './routes';
import errorHandler from './middlewares/error.middleware';
import ApiError from './utils/ApiError';

const app: Application = express();

// 1. Set Security HTTP headers
app.use(helmet());

// 2. Enable CORS
app.use(cors());

// 3. Body parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 4. API Routes
app.use('/api', routes);

// 5. Catch-all for undefined routes
app.use((req: Request, res: Response, next: NextFunction) => {
  next(new ApiError(404, `Cannot find ${req.originalUrl} on this server`));
});

// 6. Global centralized error handler
app.use(errorHandler);

export default app;
