import Joi from 'joi';

// ─── Create Session (Login) ───────────────────────────────────────────────────
// Delegates to user.validator loginSchema but kept separate
// so session-specific fields can be added independently.

export const createSessionSchema = Joi.object({
  email: Joi.string()
    .email({ tlds: { allow: false } })
    .required()
    .lowercase()
    .trim()
    .messages({
      'string.email': 'Please provide a valid email address',
      'any.required': 'Email is required',
    }),

  password: Joi.string().required().messages({
    'any.required': 'Password is required',
  }),
});

// ─── Refresh Token ────────────────────────────────────────────────────────────

export const refreshTokenSchema = Joi.object({
  refreshToken: Joi.string().required().messages({
    'any.required': 'Refresh token is required',
  }),
});

// ─── Logout ───────────────────────────────────────────────────────────────────

export const logoutSchema = Joi.object({
  refreshToken: Joi.string().required().messages({
    'any.required': 'Refresh token is required',
  }),
});
