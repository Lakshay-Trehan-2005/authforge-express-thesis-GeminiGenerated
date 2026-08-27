import { z } from 'zod';

export const loginSchema = z.object({
  body: z.object({
    email: z
      .string({ message: 'Email is required' })
      .min(1, 'Email is required')
      .email('Please enter a valid email address'),
    password: z
      .string({ message: 'Password is required' })
      .min(1, 'Password cannot be empty'),
  }),
});

export const refreshSchema = z.object({
  body: z.object({
    refreshToken: z
      .string({ message: 'Refresh token is required' })
      .min(1, 'Refresh token cannot be empty'),
  }),
});

export type LoginInput = z.infer<typeof loginSchema>;
export type RefreshInput = z.infer<typeof refreshSchema>;
