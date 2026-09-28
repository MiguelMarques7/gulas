import { z } from 'zod';

export const loginSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, 'O email é obrigatório.')
    .email('Introduza um endereço de email válido.'),
  password: z
    .string()
    .min(6, 'A palavra-passe deve ter pelo menos 6 caracteres.'),
});

export type LoginInput = z.infer<typeof loginSchema>;
