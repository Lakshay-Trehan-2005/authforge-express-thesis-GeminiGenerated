import { AccessTokenPayload } from '../utils/jwt';

// Extend Express Request to include the authenticated user payload
declare global {
  namespace Express {
    interface Request {
      /**
       * Set by authMiddleware after successful JWT verification.
       * Contains the decoded access-token payload.
       */
      user?: AccessTokenPayload;
    }
  }
}

export {};
