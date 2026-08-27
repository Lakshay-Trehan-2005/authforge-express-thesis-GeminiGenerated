import { z } from 'zod';

export const registerSchema = z.object({
  body: z.object({
    email: z
      .string({ message: 'Email is required' })
      .min(1, 'Email is required')
      .email('Please enter a valid email address'),
    password: z
      .string({ message: 'Password is required' })
      .min(6, 'Password must be at least 6 characters long'),
    role: z
      .enum(['user', 'admin'] as const, { message: 'Role must be user or admin' })
      .optional()
      .default('user'),
  }),
});

export type RegisterInput = z.infer<typeof registerSchema>;
